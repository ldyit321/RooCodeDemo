from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    crowncad_api_base_url: str = "https://cad.crowncad.com"
    crowncad_access_token: str = ""

    model_config = SettingsConfigDict(env_prefix="CROWNCAD_")


settings = Settings()
