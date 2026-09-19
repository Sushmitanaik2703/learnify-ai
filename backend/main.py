from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import notes
app = FastAPI()

# CORS configuration - allow all origins for development (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(notes.router, prefix="/api")
@app.get("/api/health")
async def health():
    return {"status": "ok"}
