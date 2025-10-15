import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Loader } from 'lucide-react'
import { Salon } from '@/types'

interface MapProps {
  salons: Salon[]
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  onSalonClick?: (salon: Salon) => void
}

// Hook pour la géolocalisation
export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLoading(false)
      },
      (error) => {
        setError('Impossible d\'obtenir votre position')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  return { location, error, loading, getCurrentLocation }
}

// Composant Carte (version simplifiée sans dépendance externe)
export default function Map({ salons, center, zoom = 12, className = '', onSalonClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const { location, error, loading, getCurrentLocation } = useGeolocation()

  // Default center (Paris)
  const defaultCenter = center || { lat: 48.8566, lng: 2.3522 }
  const mapCenter = location || defaultCenter

  const handleSalonClick = (salon: Salon) => {
    setSelectedSalon(salon)
    onSalonClick?.(salon)
  }

  return (
    <div className={`relative bg-gray-100 rounded-xl overflow-hidden ${className}`}>
      {/* Header avec géolocalisation */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            {salons.length} salon{salons.length > 1 ? 's' : ''} trouvé{salons.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:bg-white transition-colors"
          title="Localiser ma position"
        >
          {loading ? (
            <Loader className="w-5 h-5 text-primary-500 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5 text-primary-500" />
          )}
        </button>
      </div>

      {/* Carte factice avec pins */}
      <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
        {/* Grid pattern pour simuler une carte */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}
        />

        {/* Position utilisateur */}
        {location && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* Pins des salons */}
        {salons.map((salon, index) => (
          <div
            key={salon.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10 group"
            style={{
              left: `${30 + (index % 3) * 20}%`,
              top: `${40 + (index % 2) * 20}%`
            }}
            onClick={() => handleSalonClick(salon)}
          >
            <div className="relative">
              <MapPin className="w-8 h-8 text-primary-500 drop-shadow-lg group-hover:text-primary-600 transition-colors" />
              <div className="absolute -top-2 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-xs font-bold text-primary-600">
                {index + 1}
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white rounded-lg shadow-lg p-3 min-w-48">
                <h4 className="font-semibold text-gray-900">{salon.name}</h4>
                <p className="text-sm text-gray-600">{salon.city}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm ml-1">{salon.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({salon.total_reviews})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Salon sélectionné */}
      {selectedSalon && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-20 animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedSalon.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedSalon.address}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm ml-1">{selectedSalon.rating}</span>
                </div>
                <span className="text-sm text-primary-600 font-medium">{selectedSalon.price_range}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSalon(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message d'erreur géolocalisation */}
      {error && (
        <div className="absolute top-16 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 z-10">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}

// Composant SearchNearby
export function SearchNearby({ onLocationFound }: { onLocationFound: (location: { lat: number; lng: number }) => void }) {
  const { location, error, loading, getCurrentLocation } = useGeolocation()

  useEffect(() => {
    if (location) {
      onLocationFound(location)
    }
  }, [location, onLocationFound])

  return (
    <button
      onClick={getCurrentLocation}
      disabled={loading}
      className="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-lg transition-colors"
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Navigation className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {loading ? 'Localisation...' : 'Près de moi'}
      </span>
    </button>
  )
}
