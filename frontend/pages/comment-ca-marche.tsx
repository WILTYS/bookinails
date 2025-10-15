import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import { Search, Calendar, CreditCard, Check } from 'lucide-react'

export default function CommentCaMarche() {
  return (
    <>
      <Head>
        <title>Comment ça marche - Bookinails</title>
        <meta name="description" content="Découvrez comment réserver facilement votre manucure avec Bookinails." />
      </Head>

      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Réservez votre manucure en 3 étapes simples
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Recherchez</h3>
              <p className="text-gray-600">
                Trouvez le salon parfait près de chez vous grâce à notre moteur de recherche avancé.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Réservez</h3>
              <p className="text-gray-600">
                Choisissez votre créneau idéal sur notre calendrier intelligent et réservez instantanément.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Profitez</h3>
              <p className="text-gray-600">
                Rendez-vous au salon à l'heure convenue et profitez de votre prestation.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/" className="btn-primary">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
