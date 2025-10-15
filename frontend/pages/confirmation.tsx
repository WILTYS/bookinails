import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Check, Calendar, Clock, MapPin, Mail, Download } from 'lucide-react'

export default function Confirmation() {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock reservation data (in real app, get from URL params or API)
  const reservationData = {
    id: "BN-2024-001",
    salonName: "Nail Art Paradise",
    salonAddress: "123 Rue de la Beauté, Paris",
    salonPhone: "01 23 45 67 89",
    service: "Manucure française",
    date: "Vendredi 15 novembre 2024",
    time: "14:00",
    duration: "60 min",
    price: "45€",
    clientName: "Sophie Martin",
    clientEmail: "sophie@example.com"
  }

  return (
    <>
      <Head>
        <title>Réservation confirmée ! | Bookinails</title>
        <meta name="description" content="Votre réservation a été confirmée avec succès" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-500 p-2 rounded-lg">
                  <span className="text-white font-bold text-xl">💅</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Bookinails</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 transform transition-all duration-1000 ${
              animationComplete ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}>
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Réservation confirmée ! 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Votre rendez-vous est réservé. Un email de confirmation a été envoyé à votre adresse.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reservation Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de votre réservation</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Numéro de réservation</span>
                    <span className="font-semibold text-primary-600">{reservationData.id}</span>
                  </div>
                  
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Salon</span>
                    <div className="text-right">
                      <div className="font-semibold">{reservationData.salonName}</div>
                      <div className="text-sm text-gray-500">{reservationData.salonAddress}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Prestation</span>
                    <span className="font-semibold">{reservationData.service}</span>
                  </div>
                  
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Date et heure</span>
                    <div className="text-right">
                      <div className="font-semibold">{reservationData.date}</div>
                      <div className="text-sm text-gray-500">{reservationData.time} - {reservationData.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between py-3">
                    <span className="text-gray-600">Prix total</span>
                    <span className="font-semibold text-lg text-primary-600">{reservationData.price}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prochaines étapes</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-primary-600">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Confirmation reçue</h3>
                      <p className="text-sm text-gray-600">Un email de confirmation a été envoyé à {reservationData.clientEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-primary-600">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Rappel automatique</h3>
                      <p className="text-sm text-gray-600">Vous recevrez un rappel 24h avant votre rendez-vous</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-primary-600">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Rendez-vous au salon</h3>
                      <p className="text-sm text-gray-600">Présentez-vous 5 minutes avant l'heure prévue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salon Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contacter le salon</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <div className="font-medium">{reservationData.salonName}</div>
                      <div className="text-gray-600">{reservationData.salonAddress}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <a
                      href={`tel:${reservationData.salonPhone}`}
                      className="flex items-center space-x-3 text-primary-600 hover:text-primary-700"
                    >
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">{reservationData.salonPhone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Télécharger le reçu</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Ajouter au calendrier</span>
                  </button>
                  
                  <Link href="/" className="w-full block">
                    <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg transition-colors">
                      Nouvelle réservation
                    </button>
                  </Link>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2">À savoir</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Annulation gratuite jusqu'à 24h avant</li>
                  <li>• Arrivez 5 min avant l'heure</li>
                  <li>• Apportez une pièce d'identité</li>
                  <li>• Paiement déjà effectué</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/" className="btn-primary">
                Retour à l'accueil
              </Link>
              <Link href="/dashboard/client" className="btn-secondary">
                Mes réservations
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Une question ? Contactez-nous à{' '}
              <a href="mailto:support@bookinails.fr" className="text-primary-600 hover:text-primary-700">
                support@bookinails.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
