import { useState, useEffect } from 'react'
import { MapPin, Search, Star, Calendar, Shield, Headphones } from 'lucide-react'
import SearchBar from './SearchBar'

interface HeroSectionProps {
  onSearch?: (query: string, location: string) => void
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [userLocation, setUserLocation] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Géolocalisation automatique
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
            )
            const data = await response.json()
            if (data.results[0]) {
              setUserLocation(data.results[0].components.city || 'Paris')
            }
          } catch (error) {
            setUserLocation('Paris') // Fallback
          }
        },
        () => setUserLocation('Paris')
      )
    }
  }, [])

  return (
    <div className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-orange-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12">
          {/* Titre Principal - Inspiré Booking */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Trouvez votre salon <span className="text-yellow-300">parfait</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-pink-100 mb-8 max-w-3xl mx-auto">
            Réservez en 2 clics, les meilleurs professionnels près de vous
          </p>

          {/* Barre de Recherche Principale */}
          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar 
              placeholder={`Rechercher à ${userLocation || 'Paris'}...`}
              onSearch={onSearch}
              showFilters={true}
              className="shadow-2xl"
            />
          </div>

          {/* Quick Stats - Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-white/90 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">15,000+ avis clients</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">2,500+ réservations ce mois</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">98% de satisfaction</span>
            </div>
          </div>
        </div>

        {/* Trust Pillars - 4 Piliers Booking Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            {
              icon: Calendar,
              title: "Réservation instantanée",
              description: "Paiement sur place + modification gratuite jusqu'à 24h",
              color: "text-blue-400"
            },
            {
              icon: Star,
              title: "500+ salons vérifiés",
              description: "Professionnels certifiés avec vrais avis clients",
              color: "text-yellow-400"
            },
            {
              icon: Headphones,
              title: "IA Naia disponible 24/7",
              description: "Assistant intelligent pour vous conseiller",
              color: "text-green-400"
            },
            {
              icon: Shield,
              title: "Garantie satisfaction",
              description: "Service client réactif, remboursement possible",
              color: "text-purple-400"
            }
          ].map((pillar, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4`}>
                  <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {pillar.title}
                </h3>
                <p className="text-pink-100 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Secondaire */}
        <div className="text-center mt-12">
          <p className="text-pink-100 mb-4">
            Vous êtes professionnel ? 
          </p>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-lg">
            Rejoindre Bookinails Pro
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    </div>
  )
}
