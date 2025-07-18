from pydantic_settings import BaseSettings

class EnvironmentVariables(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"
        case_sensitive = True

environment_variables = EnvironmentVariables()