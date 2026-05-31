import os
from typing import List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Global Configs
    PORT: int = Field(default=8000, alias="PORT")
    ENVIRONMENT: str = Field(default="development", alias="ENVIRONMENT")
    CORS_ORIGINS_RAW: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="CORS_ORIGINS")

    # Security
    JWT_SECRET: str = Field(alias="JWT_SECRET")

    # Supabase (PostgreSQL)
    SUPABASE_DB_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/postgres",
        alias="SUPABASE_DB_URL")
    NEXT_PUBLIC_SUPABASE_URL: str = Field(alias="NEXT_PUBLIC_SUPABASE_URL")
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = Field(alias="NEXT_PUBLIC_SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(alias="SUPABASE_SERVICE_ROLE_KEY")

    # AI API keys
    GEMINI_API_KEY: str = Field(alias="GEMINI_API_KEY")
    OPENAI_API_KEY: str = Field(alias="OPENAI_API_KEY")

    # Payments
    RAZORPAY_KEY_ID: str = Field(alias="RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET: str = Field(alias="RAZORPAY_KEY_SECRET")
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: str = Field(alias="NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
    STRIPE_SECRET_KEY: str = Field(alias="STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET: str = Field(alias="STRIPE_WEBHOOK_SECRET")

    # Automation
    N8N_API_KEY: str = Field(alias="N8N_API_KEY")
    N8N_WEBHOOK_URL: str = Field(alias="N8N_WEBHOOK_URL")

    # Telemetry
    SENTRY_DSN: str = Field(default="", alias="SENTRY_DSN")
    NEXT_PUBLIC_POSTHOG_KEY: str = Field(
        default="mock_posthog_key",
        alias="NEXT_PUBLIC_POSTHOG_KEY")
    NEXT_PUBLIC_POSTHOG_HOST: str = Field(
        default="https://app.posthog.com",
        alias="NEXT_PUBLIC_POSTHOG_HOST")

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip()
                for origin in self.CORS_ORIGINS_RAW.split(",") if origin.strip()]

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        allowed = {"development", "staging", "production"}
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {allowed}")
        return v

    @field_validator("JWT_SECRET")
    @classmethod
    def validate_jwt_secret(cls, v: str, info) -> str:
        # Enforce high-entropy checks in production envs
        env = os.getenv("ENVIRONMENT", "development")
        if env == "production" and (len(v) < 32 or "your_jwt_secret" in v):
            raise ValueError(
                "JWT_SECRET must be at least 32 characters long in production")
        return v

    model_config = SettingsConfigDict(
        env_file=os.path.join(
            os.path.dirname(
                os.path.dirname(
                    os.path.dirname(__file__))),
            ".env"),
        env_file_encoding="utf-8",
        extra="ignore")


settings = Settings()
