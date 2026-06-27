import os
import glob
import logging
import psycopg
from psycopg.rows import dict_row

logger = logging.getLogger(__name__)

class MigrationRunner:
    def __init__(self, dsn: str, migrations_dir: str):
        self.dsn = dsn
        self.migrations_dir = migrations_dir

    def ensure_history_table(self, conn: psycopg.Connection):
        """Creates the migration history table if it doesn't exist."""
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS migrations_history (
                    id SERIAL PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL UNIQUE,
                    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()

    def get_applied_migrations(self, conn: psycopg.Connection) -> set:
        """Returns a set of already applied migration filenames."""
        with conn.cursor() as cur:
            cur.execute("SELECT filename FROM migrations_history;")
            return {row[0] for row in cur.fetchall()}

    def run_migrations(self):
        """Runs all unapplied migrations in the migrations directory."""
        if not os.path.exists(self.migrations_dir):
            logger.warning(f"Migrations directory not found: {self.migrations_dir}")
            return

        with psycopg.connect(self.dsn) as conn:
            self.ensure_history_table(conn)
            applied = self.get_applied_migrations(conn)

            # Get all .sql files and sort them
            migration_files = sorted(glob.glob(os.path.join(self.migrations_dir, "*.sql")))

            if not migration_files:
                logger.info("No migration files found.")
                return

            for file_path in migration_files:
                filename = os.path.basename(file_path)
                if filename in applied:
                    continue

                logger.info(f"Applying migration: {filename}")
                with open(file_path, "r", encoding="utf-8") as f:
                    sql = f.read()

                try:
                    with conn.cursor() as cur:
                        cur.execute(sql)
                        cur.execute(
                            "INSERT INTO migrations_history (filename) VALUES (%s);",
                            (filename,)
                        )
                    conn.commit()
                    logger.info(f"Successfully applied {filename}")
                except Exception as e:
                    conn.rollback()
                    logger.error(f"Failed to apply migration {filename}: {e}")
                    raise

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    logging.basicConfig(level=logging.INFO)
    dsn = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    migrations_dir = os.path.join(os.path.dirname(__file__), "migrations")
    runner = MigrationRunner(dsn, migrations_dir)
    runner.run_migrations()
