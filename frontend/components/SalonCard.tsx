import { Star, MapPin, Clock, Euro, Phone } from 'lucide-react'
import Link from 'next/link'
import { Salon } from '@/types'

interface SalonCardProps {
  salon: Salon;
}

export default function SalonCard({ salon }: SalonCardProps) {
  const getPriceRangeText = (range: string) => {
    switch (range) {
      case '€': return '25-40€'
      case '€€': return '40-60€'
      case '€€€': return '60-100€'
      default: return 'Prix sur demande'
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-500'
    if (rating >= 4.0) return 'bg-blue-500'
    if (rating >= 3.5) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
      <Link href={`/salon/${salon.id}`}>
        {/* Image */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img
            src={salon.image_url || '/placeholder-salon.jpg'}
            alt={salon.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-3 right-3">
            <span className={`${getRatingColor(salon.rating)} text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center space-x-1`}>
              <Star className="w-3 h-3 fill-current" />
              <span>{salon.rating}</span>
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="bg-white text-gray-700 px-2 py-1 rounded-lg text-sm font-medium">
              {salon.price_range}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title & Rating */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-500 transition-colors">
              {salon.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{salon.rating}</span>
                <span>({salon.total_reviews} avis)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {salon.description}
          </p>

          {/* Location */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{salon.address}, {salon.city}</span>
          </div>

          {/* Hours & Price */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{salon.open_time} - {salon.close_time}</span>
            </div>
            <div className="flex items-center space-x-1 text-primary-600 font-medium">
              <Euro className="w-4 h-4" />
              <span>{getPriceRangeText(salon.price_range)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                window.location.href = `/salon/${salon.id}`
              }}
              className="btn-primary flex-1 text-center"
            >
              Réserver
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                window.open(`tel:${salon.phone}`, '_self')
              }}
              className="btn-secondary p-2"
              title="Appeler le salon"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
