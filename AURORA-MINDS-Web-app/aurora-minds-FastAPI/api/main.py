import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.adhd.adhd_controller import router as adhd_router
from api.auth.auth_controller import router as auth_router
from api.models.db_models import Base
from api.utils.database_session_manager import db_manager
from api.utils.exception_handler import ExceptionHandlerMiddleware
from api.utils.settings import settings

# Initialize the FastAPI app
app = FastAPI()

# load the .env file (it sets the Setting member fields automatically, not path declare needed)
load_dotenv()


async def startup():
    # Begin the database session manager which sets up the database engine and session maker
    async_engine = db_manager.start_engine()
    # Create all database columns and tables (if they don't exist), using a transaction
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def shutdown():
    # Properly close the database connection
    await db_manager.close_engine()


# Register events
app.add_event_handler("startup", startup)  # startup db
app.add_event_handler("shutdown", shutdown)  # shutdown db

# Include routers from controllers
app.include_router(auth_router)
app.include_router(adhd_router)

# Add middleware for handling exceptions across the application
app.add_middleware(ExceptionHandlerMiddleware)

# Configure CORS
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main entry point for running the application/server with Uvicorn
if __name__ == "__main__":
    try:
        uvicorn.run(app, host=settings.db_host, port=settings.db_port)
    except BaseException:
        print("The server was terminated")
