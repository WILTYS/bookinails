import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">💅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bookinails</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Bonjour, {user?.name}</span>
                <Link 
                  href={user?.is_professional ? "/dashboard/pro" : "/dashboard/client"} 
                  className="text-gray-600 hover:text-primary-500"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-primary-500"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/register?type=professional" className="text-gray-600 hover:text-primary-500">
                  Devenir partenaire
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-primary-500">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-primary-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
