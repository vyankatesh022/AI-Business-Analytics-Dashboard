import os
import hashlib
from cryptography.fernet import Fernet
import logging

logger = logging.getLogger(__name__)

# Must be a base64url encoded 32-byte key for Fernet.
# If not provided, we generate one for testing, but in production it MUST be provided.
ENCRYPTION_MASTER_KEY = os.environ.get("ENCRYPTION_MASTER_KEY")
if not ENCRYPTION_MASTER_KEY:
    logger.warning("ENCRYPTION_MASTER_KEY not found in environment, using ephemeral key. DO NOT USE IN PRODUCTION.")
    ENCRYPTION_MASTER_KEY = Fernet.generate_key().decode('utf-8')

fernet = Fernet(ENCRYPTION_MASTER_KEY.encode('utf-8'))

class SecretVaultLayer:
    @staticmethod
    def encrypt_secret(secret: str) -> str:
        """Encrypts a plaintext secret into a cipher text."""
        if not secret:
            return None
        return fernet.encrypt(secret.encode('utf-8')).decode('utf-8')

    @staticmethod
    def decrypt_secret(encrypted_secret: str) -> str:
        """Decrypts a cipher text back to plaintext secret."""
        if not encrypted_secret:
            return None
        try:
            return fernet.decrypt(encrypted_secret.encode('utf-8')).decode('utf-8')
        except Exception as e:
            logger.error(f"Failed to decrypt secret: {e}")
            raise ValueError("Invalid or corrupted secret.")

    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Creates a one-way SHA-256 hash of an API key for storage."""
        return hashlib.sha256(api_key.encode('utf-8')).hexdigest()

    @staticmethod
    def generate_api_key() -> str:
        """Generates a secure random API key."""
        return "ak_" + os.urandom(32).hex()

    @staticmethod
    def generate_webhook_secret() -> str:
        """Generates a secure random webhook signing secret."""
        return "whsec_" + os.urandom(32).hex()
