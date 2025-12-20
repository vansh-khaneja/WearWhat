"""
FastAPI Application
Main application file for the WearWhat backend API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints.authentication.routes import router as authentication_router

# Create FastAPI app
app = FastAPI(
    title="WearWhat API",
    description="Backend API for WearWhat application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(authentication_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to WearWhat API"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

