from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENV: str = "dev"
    DATABASE_URL: str
    JWT_SECRET: str
    CORS_ORIGINS: str = "http://localhost:3000"

    ADMIN_EMAIL: str = "admin@raven.local"
    ADMIN_PASSWORD: str = "ChangeMeNow123!"

    @field_validator("CORS_ORIGINS")
    @classmethod
    def normalize_origins(cls, v: str) -> str:
        return v.strip()

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

settings = Settings()
