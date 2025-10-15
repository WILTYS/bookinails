from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from db import get_db
from models import Salon, SalonCreate, SalonResponse, SearchFilters

router = APIRouter()

@router.get("/", response_model=List[SalonResponse])
async def get_salons(
    db: Session = Depends(get_db),
    city: Optional[str] = Query(None, description="Filtrer par ville"),
    service_type: Optional[str] = Query(None, description="Type de service"),
    price_range: Optional[str] = Query(None, description="Gamme de prix (€, €€, €€€)"),
    min_rating: Optional[float] = Query(None, description="Note minimum"),
    available_date: Optional[date] = Query(None, description="Date de disponibilité"),
    available_time: Optional[str] = Query(None, description="Heure de disponibilité (HH:MM)"),
    sort_by: Optional[str] = Query("rating", description="Tri par: rating, price, distance"),
    skip: int = Query(0, description="Nombre d'éléments à ignorer"),
    limit: int = Query(20, description="Nombre maximum d'éléments")
):
    """Récupérer la liste des salons avec filtres avancés"""
    query = db.query(Salon)
    
    # Filtrage par ville
    if city:
        query = query.filter(Salon.city.ilike(f"%{city}%"))
    
    # Filtrage par gamme de prix
    if price_range:
        query = query.filter(Salon.price_range == price_range)
    
    # Filtrage par note minimum
    if min_rating:
        query = query.filter(Salon.rating >= min_rating)
    
    # Tri
    if sort_by == "rating":
        query = query.order_by(Salon.rating.desc())
    elif sort_by == "price":
        # Tri par prix (€ < €€ < €€€)
        price_order = {"€": 1, "€€": 2, "€€€": 3}
        query = query.order_by(Salon.price_range)
    elif sort_by == "reviews":
        query = query.order_by(Salon.total_reviews.desc())
    else:
        query = query.order_by(Salon.rating.desc())
    
    salons = query.offset(skip).limit(limit).all()
    
    # Filtrage par disponibilité (logique simplifiée)
    if available_date and available_time:
        # Dans une vraie app, on vérifierait les créneaux disponibles
        # Pour le MVP, on retourne tous les salons
        pass
    
    return salons

@router.get("/search", response_model=List[SalonResponse])
async def search_salons(
    q: str = Query(..., description="Terme de recherche"),
    db: Session = Depends(get_db),
    limit: int = Query(10, description="Nombre maximum de résultats")
):
    """Recherche textuelle dans les salons"""
    query = db.query(Salon).filter(
        Salon.name.ilike(f"%{q}%") |
        Salon.description.ilike(f"%{q}%") |
        Salon.city.ilike(f"%{q}%") |
        Salon.address.ilike(f"%{q}%")
    ).order_by(Salon.rating.desc())
    
    return query.limit(limit).all()

@router.get("/popular", response_model=List[SalonResponse])
async def get_popular_salons(
    db: Session = Depends(get_db),
    limit: int = Query(6, description="Nombre de salons populaires")
):
    """Récupérer les salons populaires (les mieux notés)"""
    return db.query(Salon).filter(
        Salon.rating >= 4.5,
        Salon.total_reviews >= 20
    ).order_by(
        Salon.rating.desc(),
        Salon.total_reviews.desc()
    ).limit(limit).all()

@router.get("/nearby")
async def get_nearby_salons(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(10, description="Rayon en km"),
    db: Session = Depends(get_db),
    limit: int = Query(20)
):
    """Récupérer les salons à proximité (fonctionnalité future)"""
    # Pour le MVP, on retourne tous les salons
    # Dans une vraie app, on utiliserait PostGIS ou une API de géolocalisation
    salons = db.query(Salon).order_by(Salon.rating.desc()).limit(limit).all()
    
    return {
        "center": {"lat": lat, "lng": lng},
        "radius": radius,
        "salons": salons,
        "message": "Géolocalisation en cours d'implémentation"
    }

@router.get("/{salon_id}", response_model=SalonResponse)
async def get_salon(salon_id: int, db: Session = Depends(get_db)):
    """Récupérer un salon par son ID"""
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    
    if not salon:
        raise HTTPException(status_code=404, detail="Salon non trouvé")
    
    return salon

@router.post("/", response_model=SalonResponse)
async def create_salon(salon: SalonCreate, db: Session = Depends(get_db)):
    """Créer un nouveau salon"""
    db_salon = Salon(**salon.dict())
    db.add(db_salon)
    db.commit()
    db.refresh(db_salon)
    return db_salon

@router.get("/{salon_id}/availability")
async def get_salon_availability(
    salon_id: int,
    date: date = Query(...),
    db: Session = Depends(get_db)
):
    """Récupérer les créneaux disponibles pour un salon à une date donnée"""
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    
    if not salon:
        raise HTTPException(status_code=404, detail="Salon non trouvé")
    
    # Logique simplifiée : créneaux par heure de 9h à 18h
    available_slots = []
    for hour in range(9, 19):  # 9h à 18h
        slot_time = f"{hour:02d}:00"
        available_slots.append({
            "time": slot_time,
            "available": True,  # Simplification - à améliorer avec vraies réservations
            "price": 45.0
        })
    
    return {
        "salon_id": salon_id,
        "date": date,
        "slots": available_slots
    }
