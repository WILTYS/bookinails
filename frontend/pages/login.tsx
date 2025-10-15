import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, User } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await login(formData)
      toast.success(`Bienvenue ${user.name} !`)
      
      // Redirect based on user type
      if (user.is_professional) {
        router.push('/dashboard/pro')
      } else {
        router.push('/dashboard/client')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Head>
        <title>Connexion | Bookinails</title>
        <meta name="description" content="Connectez-vous à votre compte Bookinails" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="bg-primary-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">💅</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Bookinails</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Connexion
            </h2>
            <p className="mt-2 text-gray-600">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Comptes de démonstration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Client</span>
                </div>
                <button
                  onClick={() => setFormData({ email: 'sophie@example.com', password: 'demo123' })}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  sophie@example.com
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium">Professionnel</span>
                </div>
                <button
                  onClick={() => setFormData({ email: 'salon@nailart.fr', password: 'demo123' })}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  salon@nailart.fr
                </button>
              </div>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
