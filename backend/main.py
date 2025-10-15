from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from datetime import datetime, date, time
from typing import List, Optional
import uvicorn

from models import Salon, Reservation, User, SalonCreate, ReservationCreate
from db import get_db, SessionLocal
from routers import salons, reservations, auth

app = FastAPI(
    title="Bookinails API",
    description="API pour la réservation de prestations d'ongles",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://bookinails.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(salons.router, prefix="/api/salons", tags=["salons"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["reservations"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Import and include payments router
from routers import payments
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

@app.get("/")
async def root():
    return {"message": "Bookinails API - Réservez votre manucure facilement!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
