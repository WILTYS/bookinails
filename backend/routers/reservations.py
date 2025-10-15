from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from db import get_db
from models import Reservation, ReservationCreate, ReservationResponse

router = APIRouter()

@router.post("/", response_model=ReservationResponse)
async def create_reservation(
    reservation: ReservationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Créer une nouvelle réservation"""
    # Vérifier que le salon existe
    from models import Salon
    salon = db.query(Salon).filter(Salon.id == reservation.salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon non trouvé")
    
    # Créer la réservation
    db_reservation = Reservation(
        **reservation.dict(),
        client_id=1,  # TODO: récupérer l'ID du client authentifié
        status="confirmed"
    )
    
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    
    # Envoyer email de confirmation en arrière-plan
    background_tasks.add_task(send_confirmation_email, db_reservation.id)
    
    return db_reservation

@router.get("/", response_model=List[ReservationResponse])
async def get_reservations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20
):
    """Récupérer les réservations de l'utilisateur connecté"""
    # TODO: filtrer par client_id de l'utilisateur authentifié
    reservations = db.query(Reservation).offset(skip).limit(limit).all()
    return reservations

@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    """Récupérer une réservation par son ID"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    return reservation

@router.patch("/{reservation_id}/cancel")
async def cancel_reservation(reservation_id: int, db: Session = Depends(get_db)):
    """Annuler une réservation"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    reservation.status = "cancelled"
    db.commit()
    
    return {"message": "Réservation annulée avec succès"}

async def send_confirmation_email(reservation_id: int):
    """Envoyer un email de confirmation (placeholder)"""
    # TODO: Implémenter l'envoi d'email
    print(f"Email de confirmation envoyé pour la réservation {reservation_id}")
