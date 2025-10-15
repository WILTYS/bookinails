import { useRouter } from 'next/router'
import Head from 'next/head'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function PaymentCancel() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Paiement annulé | Bookinails</title>
        <meta name="description" content="Votre paiement a été annulé" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50">
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
          {/* Cancel Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paiement annulé
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Que s'est-il passé ?</h2>
            <div className="space-y-3 text-gray-600">
              <p>• Vous avez annulé le processus de paiement</p>
              <p>• Aucune réservation n'a été créée</p>
              <p>• Aucun montant n'a été prélevé</p>
              <p>• Vous pouvez reprendre votre réservation à tout moment</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réessayer le paiement</span>
            </button>
            
            <button 
              onClick={() => router.push('/')}
              className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide ?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Si vous rencontrez des difficultés avec le paiement, notre équipe est là pour vous aider.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a 
                href="mailto:support@bookinails.fr" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                support@bookinails.fr
              </a>
              <a 
                href="tel:0123456789" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                01 23 45 67 89
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
