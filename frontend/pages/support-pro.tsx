import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import { Mail, Phone, MessageCircle, Users } from 'lucide-react'

export default function SupportPro() {
  return (
    <>
      <Head>
        <title>Support Professionnel - Bookinails</title>
        <meta name="description" content="Support dédié aux salons et professionnels partenaires." />
      </Head>

      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Professionnel
            </h1>
            <p className="text-xl text-gray-600">
              Support dédié aux salons et professionnels partenaires
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Email Pro</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Support technique et commercial dédié aux professionnels
              </p>
              <a href="mailto:pro@bookinails.fr" className="text-primary-600 hover:text-primary-700 font-medium">
                pro@bookinails.fr
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Ligne Pro</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ligne prioritaire pour les partenaires professionnels
              </p>
              <a href="tel:+33123456790" className="text-primary-600 hover:text-primary-700 font-medium">
                01 23 45 67 90
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Services inclus</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Configuration du profil salon</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Gestion des créneaux</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Formation à l'utilisation</span>
                </li>
              </ul>
              
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Support technique</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Optimisation SEO</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-700">Rapports détaillés</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/register?type=professional" className="btn-primary mr-4">
              Devenir partenaire
            </Link>
            <Link href="/dashboard/pro" className="btn-secondary">
              Accéder au dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
