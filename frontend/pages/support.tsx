import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react'

export default function Support() {
  return (
    <>
      <Head>
        <title>Support & Aide - Bookinails</title>
        <meta name="description" content="Contactez notre équipe support pour toute question." />
      </Head>

      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nous sommes là pour vous aider
            </h1>
            <p className="text-xl text-gray-600">
              Une question ? Un problème ? Contactez notre équipe support
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Email</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Envoyez-nous un email, nous vous répondons sous 24h
              </p>
              <a href="mailto:support@bookinails.fr" className="text-primary-600 hover:text-primary-700 font-medium">
                support@bookinails.fr
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Téléphone</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Appelez-nous du lundi au vendredi de 9h à 18h
              </p>
              <a href="tel:+33123456789" className="text-primary-600 hover:text-primary-700 font-medium">
                01 23 45 67 89
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Comment annuler une réservation ?</h3>
                <p className="text-gray-600">
                  Vous pouvez annuler votre réservation depuis votre espace client jusqu'à 24h avant le rendez-vous.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Comment modifier ma réservation ?</h3>
                <p className="text-gray-600">
                  Contactez directement le salon ou utilisez votre espace client pour modifier les détails de votre réservation.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Les prix sont-ils garantis ?</h3>
                <p className="text-gray-600">
                  Oui, les prix affichés sur Bookinails sont garantis et correspondent exactement aux tarifs du salon.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/" className="btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
