import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Star, MapPin, Phone, Mail, Clock, Euro, Users, Check } from 'lucide-react'
import Calendar from '@/components/Calendar'
import { Salon } from '@/types'
import toast from 'react-hot-toast'

const MOCK_SALON: Salon = {
  id: 1,
  name: "Nail Art Paradise",
  description: "Salon spécialisé dans l'art des ongles et la manucure française. Notre équipe d'expertes vous accueille dans un cadre moderne et chaleureux pour vous offrir des prestations d'exception.",
  address: "123 Rue de la Beauté",
  city: "Paris",
  phone: "01 23 45 67 89",
  email: "contact@nailartparadise.fr",
  rating: 4.8,
  total_reviews: 127,
  price_range: "€€",
  image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
  open_time: "09:00",
  close_time: "19:00",
  created_at: new Date().toISOString()
}

const SERVICES = [
  { name: "Manucure classique", duration: "45 min", price: 35 },
  { name: "Pose d'ongles en gel", duration: "90 min", price: 55 },
  { name: "Nail art personnalisé", duration: "120 min", price: 70 },
  { name: "Manucure française", duration: "60 min", price: 45 },
  { name: "Soin des cuticules", duration: "30 min", price: 25 },
  { name: "Pédicure complète", duration: "60 min", price: 40 }
]

const REVIEWS = [
  {
    id: 1,
    name: "Sophie M.",
    rating: 5,
    date: "Il y a 2 jours",
    comment: "Excellent salon ! L'équipe est très professionnelle et le résultat est parfait. Je recommande vivement !"
  },
  {
    id: 2,
    name: "Marie L.",
    rating: 5,
    date: "Il y a 1 semaine",
    comment: "Ma nail art est magnifique, exactement ce que je voulais. Très bon accueil et salon très propre."
  },
  {
    id: 3,
    name: "Camille R.",
    rating: 4,
    date: "Il y a 2 semaines",
    comment: "Très satisfaite de ma manucure française. Le salon est moderne et l'ambiance agréable."
  }
]

export default function SalonDetail() {
  const router = useRouter()
  const { id } = router.query
  const [salon, setSalon] = useState<Salon | null>(null)
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        setSalon(MOCK_SALON)
        setLoading(false)
      }, 500)
    }
  }, [id])

  const handleSlotSelect = (date: Date, time: string, price: number) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner un créneau')
      return
    }

    // Simulate booking process
    toast.success('Redirection vers le paiement...')
    
    // In real app, redirect to payment page
    setTimeout(() => {
      router.push(`/reservation?salon=${salon?.id}&service=${selectedService.name}&date=${selectedDate}&time=${selectedTime}&price=${selectedService.price}`)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Salon non trouvé</h1>
          <button onClick={() => router.back()} className="btn-primary">
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{salon.name} - Réserver une manucure | Bookinails</title>
        <meta name="description" content={salon.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">💅</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Bookinails</span>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80">
          <img
            src={salon.image_url || '/placeholder-salon.jpg'}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{salon.name}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{salon.rating}</span>
                    <span>({salon.total_reviews} avis)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{salon.city}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Euro className="w-4 h-4" />
                    <span>{salon.price_range}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">À propos du salon</h2>
                <p className="text-gray-600 leading-relaxed">{salon.description}</p>
              </div>

              {/* Services */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nos prestations</h2>
                <div className="grid gap-4">
                  {SERVICES.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedService.name === service.name
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary-600">{service.price}€</div>
                          {selectedService.name === service.name && (
                            <Check className="w-5 h-5 text-primary-500 ml-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Avis clients</h2>
                <div className="space-y-4">
                  {REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{salon.address}</div>
                      <div className="text-sm text-gray-600">{salon.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${salon.phone}`} className="text-primary-600 hover:text-primary-700">
                      {salon.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${salon.email}`} className="text-primary-600 hover:text-primary-700">
                      {salon.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{salon.open_time} - {salon.close_time}</span>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <Calendar
                salonId={salon.id}
                onSlotSelect={handleSlotSelect}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />

              {/* Booking Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prestation</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-medium">{selectedService.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix</span>
                    <span className="font-medium">{selectedService.price}€</span>
                  </div>
                  {selectedDate && selectedTime && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heure</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">{selectedService.price}€</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
