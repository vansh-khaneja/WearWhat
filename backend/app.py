"""
FastAPI Application
Main application file for the WearWhat backend API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints.authentication.routes import router as authentication_router
from endpoints.outfit.routes import router as outfit_router
from endpoints.weekly import router as weekly_router
from endpoints.chat import router as chat_router

# Create FastAPI app
app = FastAPI(
    title="WearWhat API",
    description="Backend API for WearWhat application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend dev origin; set specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(authentication_router)
app.include_router(outfit_router)
app.include_router(weekly_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Wearwhat Backend 1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

