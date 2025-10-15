#!/usr/bin/env python3
"""
Script pour peupler la base de données avec des données de test
"""

import sys
import os
from datetime import datetime, time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from models import Base, Salon, User, Reservation
from db import DATABASE_URL

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Créer toutes les tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Tables créées avec succès")

def seed_users():
    """Ajouter des utilisateurs de test"""
    db = SessionLocal()
    
    users = [
        User(
            email="sophie@example.com",
            name="Sophie Martin",
            phone="06 12 34 56 78",
            is_professional=False
        ),
        User(
            email="marie@example.com", 
            name="Marie Dupont",
            phone="06 87 65 43 21",
            is_professional=False
        ),
        User(
            email="salon@nailart.fr",
            name="Nail Art Paradise",
            phone="01 23 45 67 89",
            is_professional=True
        ),
        User(
            email="contact@beautynails.fr",
            name="Beauty Nails Studio", 
            phone="04 12 34 56 78",
            is_professional=True
        )
    ]
    
    for user in users:
        db.add(user)
    
    db.commit()
    print(f"✅ {len(users)} utilisateurs ajoutés")
    db.close()

def seed_salons():
    """Ajouter des salons de test"""
    db = SessionLocal()
    
    # Get professional users
    owner1 = db.query(User).filter(User.email == "salon@nailart.fr").first()
    owner2 = db.query(User).filter(User.email == "contact@beautynails.fr").first()
    
    salons = [
        Salon(
            name="Nail Art Paradise",
            description="Salon spécialisé dans l'art des ongles et la manucure française. Notre équipe d'expertes vous accueille dans un cadre moderne et chaleureux.",
            address="123 Rue de la Beauté",
            city="Paris",
            phone="01 23 45 67 89",
            email="contact@nailartparadise.fr",
            rating=4.8,
            total_reviews=127,
            price_range="€€",
            image_url="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
            open_time=time(9, 0),
            close_time=time(19, 0),
            owner_id=owner1.id if owner1 else None
        ),
        Salon(
            name="Beauty Nails Studio",
            description="Pose d'ongles en gel et manucure traditionnelle dans une ambiance cosy et moderne.",
            address="456 Avenue des Champs",
            city="Lyon", 
            phone="04 12 34 56 78",
            email="hello@beautynails.fr",
            rating=4.6,
            total_reviews=89,
            price_range="€",
            image_url="https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
            open_time=time(10, 0),
            close_time=time(18, 0),
            owner_id=owner2.id if owner2 else None
        ),
        Salon(
            name="Luxe Nails Spa",
            description="Expérience spa premium avec manucure et pédicure dans un cadre luxueux.",
            address="789 Boulevard Royal",
            city="Nice",
            phone="04 98 76 54 32", 
            email="contact@luxenails.fr",
            rating=4.9,
            total_reviews=203,
            price_range="€€€",
            image_url="https://images.unsplash.com/photo-1595475884562-dcadd9821e71?w=800",
            open_time=time(8, 0),
            close_time=time(20, 0),
            owner_id=None
        ),
        Salon(
            name="Ongles & Co",
            description="Salon familial proposant tous types de prestations pour les ongles dans une ambiance conviviale.",
            address="321 Rue des Fleurs",
            city="Marseille",
            phone="04 91 23 45 67",
            email="info@ongles-co.fr", 
            rating=4.4,
            total_reviews=76,
            price_range="€",
            image_url="https://images.unsplash.com/photo-1562887189-1d458946e3a0?w=800",
            open_time=time(9, 30),
            close_time=time(18, 30),
            owner_id=None
        ),
        Salon(
            name="Nail Boutique",
            description="Boutique tendance spécialisée dans le nail art créatif et les dernières tendances.",
            address="654 Place Bellecour",
            city="Lyon",
            phone="04 78 90 12 34",
            email="contact@nailboutique.fr",
            rating=4.7,
            total_reviews=156,
            price_range="€€",
            image_url="https://images.unsplash.com/photo-1599948128020-9a44168c34c4?w=800",
            open_time=time(10, 0),
            close_time=time(19, 0),
            owner_id=None
        )
    ]
    
    for salon in salons:
        db.add(salon)
    
    db.commit()
    print(f"✅ {len(salons)} salons ajoutés")
    db.close()

def seed_reservations():
    """Ajouter des réservations de test"""
    db = SessionLocal()
    
    # Get some users and salons
    client1 = db.query(User).filter(User.email == "sophie@example.com").first()
    client2 = db.query(User).filter(User.email == "marie@example.com").first()
    salon1 = db.query(Salon).filter(Salon.name == "Nail Art Paradise").first()
    salon2 = db.query(Salon).filter(Salon.name == "Beauty Nails Studio").first()
    
    reservations = [
        Reservation(
            salon_id=salon1.id if salon1 else 1,
            client_id=client1.id if client1 else 1, 
            service_type="Manucure française",
            appointment_date=datetime(2024, 11, 15, 14, 0),
            duration_minutes=60,
            price=45.0,
            status="confirmed",
            payment_status="paid",
            client_notes="Couleur nude s'il vous plaît"
        ),
        Reservation(
            salon_id=salon2.id if salon2 else 2,
            client_id=client2.id if client2 else 2,
            service_type="Pose d'ongles en gel", 
            appointment_date=datetime(2024, 11, 18, 16, 30),
            duration_minutes=90,
            price=55.0,
            status="confirmed",
            payment_status="paid",
            client_notes="Première fois, j'ai des ongles fragiles"
        )
    ]
    
    for reservation in reservations:
        db.add(reservation)
    
    db.commit()
    print(f"✅ {len(reservations)} réservations ajoutées")
    db.close()

def main():
    """Fonction principale pour peupler la base de données"""
    print("🚀 Début du peuplement de la base de données...")
    
    try:
        create_tables()
        seed_users()
        seed_salons()
        seed_reservations()
        
        print("🎉 Base de données peuplée avec succès !")
        
    except Exception as e:
        print(f"❌ Erreur lors du peuplement : {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
