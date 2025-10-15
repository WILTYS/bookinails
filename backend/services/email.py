"""
Service d'envoi d'emails pour Bookinails
Gestion des notifications par email
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import asyncio
from datetime import datetime

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@bookinails.fr")
        
    async def send_email(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None):
        """Envoyer un email"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # Partie texte
            if text_content:
                part1 = MIMEText(text_content, 'plain', 'utf-8')
                msg.attach(part1)
            
            # Partie HTML
            part2 = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(part2)
            
            # Envoi via SMTP
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.sendmail(self.from_email, to_email, msg.as_string())
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Erreur envoi email: {e}")
            return False
    
    async def send_booking_confirmation(self, user_email: str, user_name: str, salon_name: str, 
                                       appointment_date: datetime, service: str, price: float):
        """Email de confirmation de réservation"""
        subject = f"✅ Confirmation de votre réservation chez {salon_name}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #f97316); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">💅 Bookinails</h1>
                <p style="color: white; margin: 5px 0;">Confirmation de réservation</p>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #333;">Bonjour {user_name},</h2>
                <p>Votre réservation a été confirmée avec succès !</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #ec4899; margin-top: 0;">Détails de votre réservation</h3>
                    <p><strong>Salon :</strong> {salon_name}</p>
                    <p><strong>Service :</strong> {service}</p>
                    <p><strong>Date :</strong> {appointment_date.strftime('%d/%m/%Y à %H:%M')}</p>
                    <p><strong>Prix :</strong> {price}€</p>
                </div>
                
                <p>Vous recevrez un rappel 24h avant votre rendez-vous.</p>
                <p>Merci de votre confiance !</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://bookinails-live.vercel.app/dashboard/client" 
                       style="background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        Voir mes réservations
                    </a>
                </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>Bookinails - La plateforme de réservation beauté</p>
                <p>Ne pas répondre à cet email automatique</p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Bonjour {user_name},
        
        Votre réservation a été confirmée avec succès !
        
        Détails :
        - Salon : {salon_name}
        - Service : {service}
        - Date : {appointment_date.strftime('%d/%m/%Y à %H:%M')}
        - Prix : {price}€
        
        Rendez-vous sur https://bookinails-live.vercel.app/dashboard/client pour voir vos réservations.
        
        Merci de votre confiance !
        Bookinails
        """
        
        return await self.send_email(user_email, subject, html_content, text_content)
    
    async def send_reminder_24h(self, user_email: str, user_name: str, salon_name: str, 
                               appointment_date: datetime, service: str):
        """Email de rappel 24h avant"""
        subject = f"⏰ Rappel : Votre rendez-vous chez {salon_name} demain"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fbbf24; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">⏰ Rappel Bookinails</h1>
            </div>
            
            <div style="padding: 20px;">
                <h2>Bonjour {user_name},</h2>
                <p>N'oubliez pas votre rendez-vous demain !</p>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Demain - {appointment_date.strftime('%d/%m/%Y à %H:%M')}</h3>
                    <p><strong>Salon :</strong> {salon_name}</p>
                    <p><strong>Service :</strong> {service}</p>
                </div>
                
                <p>À très bientôt ! 💅</p>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(user_email, subject, html_content)

# Instance globale
email_service = EmailService()
