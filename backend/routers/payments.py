from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Dict, Any
import stripe
import os
from datetime import datetime

from db import get_db
from models import Reservation, User, Salon

router = APIRouter()

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

@router.post("/create-checkout-session")
async def create_checkout_session(
    reservation_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Créer une session de paiement Stripe"""
    try:
        # Validate reservation data
        salon_id = reservation_data.get("salon_id")
        service_type = reservation_data.get("service_type")
        appointment_date = reservation_data.get("appointment_date")
        price = reservation_data.get("price")
        client_email = reservation_data.get("client_email")
        client_name = reservation_data.get("client_name")
        
        if not all([salon_id, service_type, appointment_date, price, client_email]):
            raise HTTPException(status_code=400, detail="Données de réservation incomplètes")
        
        # Get salon info
        salon = db.query(Salon).filter(Salon.id == salon_id).first()
        if not salon:
            raise HTTPException(status_code=404, detail="Salon non trouvé")
        
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': f'{service_type} - {salon.name}',
                        'description': f'Réservation le {appointment_date}',
                        'images': [salon.image_url] if salon.image_url else [],
                    },
                    'unit_amount': int(float(price) * 100),  # Stripe uses cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{FRONTEND_URL}/payment-cancel',
            customer_email=client_email,
            metadata={
                'salon_id': str(salon_id),
                'service_type': service_type,
                'appointment_date': appointment_date,
                'client_email': client_email,
                'client_name': client_name,
            }
        )
        
        return {'checkout_url': session.url, 'session_id': session.id}
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Erreur Stripe: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@router.get("/session/{session_id}")
async def get_checkout_session(session_id: str):
    """Récupérer les détails d'une session de paiement"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            'payment_status': session.payment_status,
            'customer_details': session.customer_details,
            'metadata': session.metadata
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Session introuvable: {str(e)}")

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Webhook Stripe pour traiter les événements de paiement"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Payload invalide")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Signature invalide")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_successful_payment(session, db)
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        await handle_failed_payment(payment_intent, db)
    
    return {'status': 'success'}

async def handle_successful_payment(session: Dict[str, Any], db: Session):
    """Traiter un paiement réussi"""
    try:
        metadata = session.get('metadata', {})
        
        # Get or create client
        client_email = metadata.get('client_email')
        client = db.query(User).filter(User.email == client_email).first()
        
        if not client:
            # Create new client
            client = User(
                email=client_email,
                name=metadata.get('client_name', ''),
                phone='',
                is_professional=False
            )
            db.add(client)
            db.commit()
            db.refresh(client)
        
        # Create reservation
        reservation = Reservation(
            salon_id=int(metadata.get('salon_id')),
            client_id=client.id,
            service_type=metadata.get('service_type'),
            appointment_date=datetime.fromisoformat(metadata.get('appointment_date')),
            duration_minutes=60,  # Default duration
            price=session['amount_total'] / 100,  # Convert from cents
            status='confirmed',
            payment_status='paid',
            stripe_payment_id=session['payment_intent']
        )
        
        db.add(reservation)
        db.commit()
        
        # TODO: Send confirmation email
        print(f"Réservation confirmée: {reservation.id}")
        
    except Exception as e:
        print(f"Erreur lors du traitement du paiement: {str(e)}")

async def handle_failed_payment(payment_intent: Dict[str, Any], db: Session):
    """Traiter un paiement échoué"""
    # TODO: Log failed payment and notify if needed
    print(f"Paiement échoué: {payment_intent['id']}")

@router.post("/refund")
async def create_refund(
    payment_intent_id: str,
    reason: str = "requested_by_customer",
    db: Session = Depends(get_db)
):
    """Créer un remboursement"""
    try:
        # Find the reservation
        reservation = db.query(Reservation).filter(
            Reservation.stripe_payment_id == payment_intent_id
        ).first()
        
        if not reservation:
            raise HTTPException(status_code=404, detail="Réservation non trouvée")
        
        # Create refund in Stripe
        refund = stripe.Refund.create(
            payment_intent=payment_intent_id,
            reason=reason
        )
        
        # Update reservation status
        reservation.status = 'cancelled'
        reservation.payment_status = 'refunded'
        db.commit()
        
        return {
            'refund_id': refund.id,
            'status': refund.status,
            'amount': refund.amount / 100
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Erreur Stripe: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@router.get("/refunds")
async def list_refunds(payment_intent_id: str):
    """Lister les remboursements pour un paiement"""
    try:
        refunds = stripe.Refund.list(payment_intent=payment_intent_id)
        return {
            'refunds': [{
                'id': refund.id,
                'amount': refund.amount / 100,
                'status': refund.status,
                'reason': refund.reason,
                'created': refund.created
            } for refund in refunds.data]
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Erreur Stripe: {str(e)}")
