import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    is_professional: false,
    acceptTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation')
      setLoading(false)
      return
    }

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        is_professional: formData.is_professional
      })
      
      toast.success(`Bienvenue ${user.name} ! Votre compte a été créé.`)
      
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
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <>
      <Head>
        <title>Inscription | Bookinails</title>
        <meta name="description" content="Créez votre compte Bookinails" />
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
              Créer un compte
            </h2>
            <p className="mt-2 text-gray-600">
              Rejoignez la communauté Bookinails
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Type de compte</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_professional: false })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  !formData.is_professional
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Client</div>
                <div className="text-xs text-gray-600">Réserver des prestations</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_professional: true })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.is_professional
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-6 h-6 bg-primary-500 rounded-full mx-auto mb-2"></div>
                <div className="font-medium">Professionnel</div>
                <div className="text-xs text-gray-600">Recevoir des réservations</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.is_professional ? 'Nom du salon' : 'Nom complet'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder={formData.is_professional ? 'Nail Art Paradise' : 'Sophie Martin'}
                  />
                </div>
              </div>

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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="06 12 34 56 78"
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  J'accepte les{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    conditions d'utilisation
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    politique de confidentialité
                  </a>
                </label>
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
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
