import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Search, Clock, Star, MapPin } from 'lucide-react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import SocialProof from '../components/SocialProof'
import SalonCard from '../components/SalonCard'

interface Salon {
  id: number
  name: string
  description: string
  address: string
  city: string
  phone: string
  email: string
  rating: number
  total_reviews: number
  price_range: string
  image_url: string
  open_time: string
  close_time: string
  created_at: string
}

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

export default function HomeV2() {
  const [salons, setSalons] = useState<Salon[]>(MOCK_SALONS)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (query: string, location: string) => {
    setLoading(true)
    
    // Simuler une recherche API
    setTimeout(() => {
      if (location) {
        const filtered = MOCK_SALONS.filter(salon => 
          salon.city.toLowerCase().includes(location.toLowerCase()) ||
          salon.name.toLowerCase().includes(query.toLowerCase())
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
        <title>Bookinails - Trouvez votre salon parfait</title>
        <meta name="description" content="Réservez en 2 clics, les meilleurs professionnels près de vous. 15,000+ avis clients, 500+ salons vérifiés." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Hero Section - Inspiré Booking.com */}
      <HeroSection onSearch={handleSearch} />

      {/* How It Works - 4 étapes */}
      <HowItWorks />

      {/* Social Proof - Témoignages & Stats */}
      <SocialProof />

      {/* Salons Populaires */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Salons populaires près de vous
            </h2>
            <p className="text-gray-600 text-lg">
              Découvrez les salons les mieux notés par notre communauté
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {salons.map((salon) => (
                <div key={salon.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={salon.image_url} 
                      alt={salon.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-sm">{salon.rating}</span>
                    </div>
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      VÉRIFIÉ
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {salon.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {salon.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{salon.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{salon.open_time} - {salon.close_time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-pink-600">{salon.price_range}</span>
                        <span className="text-gray-500">• {salon.total_reviews} avis</span>
                      </div>
                      <Link 
                        href={`/salon/${salon.id}`}
                        className="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-12">
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all text-lg"
            >
              <Search className="w-5 h-5" />
              Voir tous les salons
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prête à découvrir votre nouveau salon de beauté ?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Rejoignez les milliers de clientes qui nous font confiance pour leurs ongles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors text-lg"
            >
              Créer mon compte gratuit
            </Link>
            <Link 
              href="/search"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors text-lg"
            >
              Explorer les salons
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">💅</span>
              <span className="text-2xl font-bold">Bookinails</span>
            </div>
            <p className="text-gray-400 mb-6">
              La plateforme de référence pour réserver votre salon de manucure
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/conditions" className="hover:text-pink-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/support" className="hover:text-pink-400 transition-colors">
                Support
              </Link>
              <Link href="/support-pro" className="hover:text-pink-400 transition-colors">
                Espace Pro
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-gray-500 text-sm">
              © 2024 Bookinails. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
