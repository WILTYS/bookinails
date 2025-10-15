import Head from 'next/head'
import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page non trouvée - Bookinails</title>
        <meta name="description" content="La page que vous cherchez n'existe pas." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="bg-primary-500 p-3 rounded-lg">
              <span className="text-white font-bold text-2xl">💅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bookinails</h1>
          </div>

          {/* 404 Message */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="text-6xl font-bold text-primary-500 mb-4">404</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Page non trouvée
            </h2>
            <p className="text-gray-600 mb-6">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            {/* Actions */}
            <div className="space-y-4">
              <Link href="/" className="btn-primary w-full flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Retour à l'accueil</span>
              </Link>
              
              <Link href="/" className="btn-secondary w-full flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Rechercher un salon</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-sm text-gray-500 space-x-4">
            <Link href="/login" className="hover:text-primary-600">Connexion</Link>
            <span>•</span>
            <Link href="/register" className="hover:text-primary-600">S'inscrire</Link>
            <span>•</span>
            <Link href="/support" className="hover:text-primary-600">Support</Link>
          </div>
        </div>
      </div>
    </>
  )
}
