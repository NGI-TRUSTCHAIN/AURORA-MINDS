from dotenv import load_dotenv
from pydantic_settings import BaseSettings

''' This file is responsible for loading the configurations from the .env file '''


class Settings(BaseSettings):
    sqlalchemy_database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    db_host: str
    db_port: int

    # load the .env file (it sets the Setting member fields automatically, not path declare needed)
    load_dotenv()


# Global Initialization
settings = Settings()
