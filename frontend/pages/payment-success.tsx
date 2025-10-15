import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CheckCircle, Download, Calendar, ArrowRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function PaymentSuccess() {
  const router = useRouter()
  const { session_id } = router.query
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session_id) {
      fetchSessionData()
    }
  }, [session_id])

  const fetchSessionData = async () => {
    try {
      const response = await axios.get(`/api/payments/session/${session_id}`)
      setSessionData(response.data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des données de paiement')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Paiement réussi ! | Bookinails</title>
        <meta name="description" content="Votre paiement a été traité avec succès" />
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paiement réussi ! 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Votre réservation a été confirmée et votre paiement a été traité avec succès.
            </p>

            {sessionData?.payment_status === 'paid' && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-md mx-auto mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Paiement confirmé</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Votre réservation est maintenant active
                </p>
              </div>
            )}
          </div>

          {/* Reservation Details */}
          {sessionData?.metadata && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de votre réservation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Prestation</h3>
                  <p className="text-gray-600">{sessionData.metadata.service_type}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Date et heure</h3>
                  <p className="text-gray-600">
                    {new Date(sessionData.metadata.appointment_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Client</h3>
                  <p className="text-gray-600">{sessionData.metadata.client_name}</p>
                  <p className="text-sm text-gray-500">{sessionData.metadata.client_email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Salon</h3>
                  <p className="text-gray-600">Salon #{sessionData.metadata.salon_id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button 
              onClick={() => router.push('/confirmation')}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <span>Voir ma réservation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Télécharger le reçu</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Ajouter au calendrier</span>
            </button>
          </div>

          {/* Email Confirmation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-medium text-blue-900 mb-2">Email de confirmation envoyé</h3>
            <p className="text-blue-800 text-sm">
              Un email de confirmation avec tous les détails de votre réservation a été envoyé à{' '}
              <strong>{sessionData?.customer_details?.email}</strong>
            </p>
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
                  <p className="text-sm text-gray-600">Votre réservation est confirmée et votre place est réservée</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-medium text-primary-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Rappel automatique</h3>
                  <p className="text-sm text-gray-600">Un rappel vous sera envoyé 24h avant votre rendez-vous</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-medium text-primary-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Rendez-vous au salon</h3>
                  <p className="text-sm text-gray-600">Présentez-vous à l'heure prévue pour profiter de votre prestation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                Nouvelle réservation
              </button>
              <button 
                onClick={() => router.push('/dashboard/client')}
                className="btn-secondary"
              >
                Mon espace client
              </button>
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
