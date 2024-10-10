from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine
from sqlalchemy.orm import sessionmaker

from api.utils.settings import settings


class DatabaseSessionManager:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.async_engine: AsyncEngine | None = None
        self.session_maker = None

    def start_engine(self) -> AsyncEngine:
        self.async_engine = create_async_engine(self.database_url, echo=False)
        self.session_maker = sessionmaker(bind=self.async_engine,
                                          class_=AsyncSession,
                                          expire_on_commit=False,
                                          autoflush=False,
                                          autocommit=False)
        return self.async_engine

    @asynccontextmanager
    async def get_db(self):
        assert self.session_maker, "DatabaseSessionManager is not initialized"
        async with self.session_maker() as session:
            yield session

    async def close_engine(self):
        if self.async_engine:
            await self.async_engine.dispose()


# Global Initialization
db_manager = DatabaseSessionManager(settings.sqlalchemy_database_url)
