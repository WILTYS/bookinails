from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, validator
from datetime import datetime, date, time
from typing import List, Optional

Base = declarative_base()

# SQLAlchemy Models
class Salon(Base):
    __tablename__ = "salons"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    address = Column(String)
    city = Column(String, index=True)
    phone = Column(String)
    email = Column(String)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    price_range = Column(String)  # €, €€, €€€
    image_url = Column(String)
    open_time = Column(Time)
    close_time = Column(Time)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reservations = relationship("Reservation", back_populates="salon")
    owner = relationship("User", back_populates="owned_salons")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    phone = Column(String)
    is_professional = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reservations = relationship("Reservation", back_populates="client")
    owned_salons = relationship("Salon", back_populates="owner")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(Integer, ForeignKey("salons.id"))
    client_id = Column(Integer, ForeignKey("users.id"))
    service_type = Column(String)  # manucure, pose, etc.
    appointment_date = Column(DateTime)
    duration_minutes = Column(Integer, default=60)
    price = Column(Float)
    status = Column(String, default="confirmed")  # confirmed, cancelled, completed
    payment_status = Column(String, default="pending")  # pending, paid, refunded
    stripe_payment_id = Column(String)
    client_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    salon = relationship("Salon", back_populates="reservations")
    client = relationship("User", back_populates="reservations")

# Pydantic Models
class SalonBase(BaseModel):
    name: str
    description: str
    address: str
    city: str
    phone: str
    email: str
    price_range: str
    image_url: Optional[str] = None
    open_time: time
    close_time: time

class SalonCreate(SalonBase):
    pass

class SalonResponse(SalonBase):
    id: int
    rating: float
    total_reviews: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReservationBase(BaseModel):
    service_type: str
    appointment_date: datetime
    duration_minutes: int = 60
    price: float
    client_notes: Optional[str] = None

class ReservationCreate(ReservationBase):
    salon_id: int

class ReservationResponse(ReservationBase):
    id: int
    salon_id: int
    client_id: int
    status: str
    payment_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    name: str
    phone: str
    is_professional: bool = False

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SearchFilters(BaseModel):
    city: Optional[str] = None
    service_type: Optional[str] = None
    date: Optional[date] = None
    price_range: Optional[str] = None
