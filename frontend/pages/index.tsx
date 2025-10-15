import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { MapPin, Search, Star, Clock, Euro } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import SalonCard from '@/components/SalonCard'
import { Salon } from '@/types'

const MOCK_SALONS: Salon[] = [
  {
    id: 1,
    name: "Nail Art Paradise",
    description: "Salon spécialisé dans l'art des ongles et la manucure française",
    address: "123 Rue de la Beauté",
    city: "Paris",
    phone: "01 23 45 67 89",
    email: "contact@nailartparadise.fr",
    rating: 4.8,
    total_reviews: 127,
    price_range: "€€",
    image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
    open_time: "09:00",
    close_time: "19:00",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Beauty Nails Studio",
    description: "Pose d'ongles en gel et manucure traditionnelle",
    address: "456 Avenue des Champs",
    city: "Lyon",
    phone: "04 12 34 56 78",
    email: "hello@beautynails.fr",
    rating: 4.6,
    total_reviews: 89,
    price_range: "€",
    image_url: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=400",
    open_time: "10:00",
    close_time: "18:00",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Luxe Nails Spa",
    description: "Expérience spa premium avec manucure et pédicure",
    address: "789 Boulevard Royal",
    city: "Nice",
    phone: "04 98 76 54 32",
    email: "contact@luxenails.fr",
    rating: 4.9,
    total_reviews: 203,
    price_range: "€€€",
    image_url: "https://images.unsplash.com/photo-1595475884562-dcadd9821e71?w=400",
    open_time: "08:00",
    close_time: "20:00",
    created_at: new Date().toISOString()
  }
]

export default function Home() {
  const [salons, setSalons] = useState<Salon[]>(MOCK_SALONS)
  const [loading, setLoading] = useState(false)
  const [searchCity, setSearchCity] = useState('')

  const handleSearch = async (city: string, serviceType: string) => {
    setLoading(true)
    setSearchCity(city)
    
    // Simuler une recherche API
    setTimeout(() => {
      if (city) {
        const filtered = MOCK_SALONS.filter(salon => 
          salon.city.toLowerCase().includes(city.toLowerCase())
        )
        setSalons(filtered)
      } else {
        setSalons(MOCK_SALONS)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <Head>
        <title>Bookinails - Réservez votre manucure en ligne</title>
        <meta name="description" content="Trouvez et réservez votre salon de manucure facilement. Comme Booking.com mais pour vos ongles !" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">💅</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bookinails</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/register?type=professional" className="text-gray-600 hover:text-primary-500">Devenir partenaire</Link>
              <Link href="/login" className="text-gray-600 hover:text-primary-500">Connexion</Link>
              <Link href="/register" className="btn-primary">S'inscrire</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Réservez votre
            <span className="text-primary-500"> manucure </span>
            en 2 clics
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouvez le salon parfait près de chez vous et réservez votre créneau en ligne. 
            Simple comme Booking.com, mais pour vos ongles !
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">500+</div>
              <div className="text-gray-600">Salons partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">10k+</div>
              <div className="text-gray-600">Réservations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">4.8★</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {searchCity ? `Salons à ${searchCity}` : 'Salons populaires'}
            </h3>
            <div className="text-gray-600">
              {salons.length} salon{salons.length > 1 ? 's' : ''} trouvé{salons.length > 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salons.map(salon => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          )}

          {!loading && salons.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun salon trouvé</h3>
              <p className="text-gray-600">Essayez avec une autre ville ou réinitialisez votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Bookinails ?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plateforme qui simplifie la réservation de vos prestations d'ongles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Recherche facile</h4>
              <p className="text-gray-600">Trouvez le salon parfait près de chez vous en quelques secondes</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Réservation instantanée</h4>
              <p className="text-gray-600">Réservez votre créneau 24h/24 sans passer par téléphone</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Avis vérifiés</h4>
              <p className="text-gray-600">Consultez les avis clients pour choisir en toute confiance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">💅</span>
                <span className="text-xl font-bold">Bookinails</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour la réservation de prestations d'ongles en France.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Pour les clients</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/comment-ca-marche" className="hover:text-white">Comment ça marche</Link></li>
                <li><Link href="/support" className="hover:text-white">Aide & support</Link></li>
                <li><Link href="/conditions" className="hover:text-white">Conditions d'utilisation</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Pour les professionnels</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register?type=professional" className="hover:text-white">Rejoindre Bookinails</Link></li>
                <li><Link href="/dashboard/pro" className="hover:text-white">Dashboard salon</Link></li>
                <li><Link href="/support-pro" className="hover:text-white">Support professionnel</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>contact@bookinails.fr</li>
                <li>01 23 45 67 89</li>
                <li>Paris, France</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bookinails. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
