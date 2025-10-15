import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Check, CreditCard, User, Mail, Phone, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReservationData {
  salon: string
  service: string
  date: string
  time: string
  price: string
}

export default function Reservation() {
  const router = useRouter()
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Get reservation data from URL params
    const { salon, service, date, time, price } = router.query
    
    if (salon && service && date && time && price) {
      setReservationData({
        salon: salon as string,
        service: service as string,
        date: date as string,
        time: time as string,
        price: price as string
      })
    }
  }, [router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Réservation confirmée ! Un email de confirmation vous a été envoyé.')
      
      // Redirect to confirmation page
      setTimeout(() => {
        router.push('/confirmation')
      }, 1500)
      
    } catch (error) {
      toast.error('Erreur lors du paiement. Veuillez réessayer.')
    } finally {
      setProcessing(false)
    }
  }

  if (!reservationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Données de réservation manquantes</h1>
          <button onClick={() => router.push('/')} className="btn-primary">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Finaliser votre réservation | Bookinails</title>
        <meta name="description" content="Finalisez votre réservation et procédez au paiement" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Sélection</span>
              </div>
              <div className="w-16 h-px bg-primary-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Réservation</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Vos informations</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                        className="input-field"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                        className="input-field"
                        placeholder="06 12 34 56 78"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="input-field"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes particulières (optionnel)
                    </label>
                    <textarea
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Couleurs préférées, allergies, demandes spéciales..."
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Paiement</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="card"
                          name="payment"
                          className="text-primary-500 focus:ring-primary-500"
                          defaultChecked
                        />
                        <label htmlFor="card" className="flex items-center space-x-2">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Carte bancaire</span>
                        </label>
                      </div>
                      <div className="mt-3 ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input-field text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="input-field text-sm"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="input-field text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <p className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Paiement sécurisé par Stripe</span>
                      </p>
                      <p className="mt-1 text-xs">
                        Vos données bancaires sont chiffrées et sécurisées
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary w-full h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Traitement en cours...</span>
                    </div>
                  ) : (
                    `Payer ${reservationData.price}€`
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Salon</h4>
                  <p className="text-sm text-gray-600">Nail Art Paradise</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Prestation</h4>
                  <p className="text-sm text-gray-600">{reservationData.service}</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Date et heure</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(reservationData.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{reservationData.time}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">{reservationData.price}€</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Paiement immédiat - Annulation gratuite jusqu'à 24h avant
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary-700">Confirmation instantanée</p>
                    <p className="text-primary-600">Vous recevrez un email de confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
