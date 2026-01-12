from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

from routes import router as api_routes, set_db

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'lwr_portfolio')]

# Set database reference in routes
set_db(db)

# Create the main app
app = FastAPI(title="LWR Portfolio API")

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
main_router = APIRouter(prefix="/api")

# Root endpoint
@main_router.get("/")
async def root():
    return {"message": "LWR Portfolio API", "status": "running"}

# Include API routes
main_router.include_router(api_routes)

# Include the router in the main app
app.include_router(main_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Connected to MongoDB")
    # Create indexes
    await db.projects.create_index("id", unique=True)
    await db.albums.create_index("id", unique=True)
    await db.media.create_index("id", unique=True)
    await db.reviews.create_index("id", unique=True)
    await db.contact.create_index("id", unique=True)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Disconnected from MongoDB")
