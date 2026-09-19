import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend directory is on sys.path for clean imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

app = FastAPI(
    title="LearnLoop AI API",
    description="Backend API for LearnLoop AI — Learn From Your Notes",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes after setting up sys.path
from routes.notes import router as notes_router
app.include_router(notes_router)

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "ok",
        "message": "LearnLoop backend is running"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
