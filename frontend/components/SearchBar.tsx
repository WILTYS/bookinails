import { useState } from 'react'
import { Search, MapPin, Calendar } from 'lucide-react'

interface SearchBarProps {
  onSearch: (city: string, serviceType: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('')
  const [serviceType, setServiceType] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(city, serviceType)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Où ?
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Paris, Lyon, Nice..."
              className="input-field pl-10 pr-4"
            />
          </div>
        </div>

        {/* Service Type */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prestation
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            <option value="">Toutes les prestations</option>
            <option value="manucure">Manucure classique</option>
            <option value="pose_gel">Pose d'ongles en gel</option>
            <option value="nail_art">Nail art</option>
            <option value="french">Manucure française</option>
            <option value="pedicure">Pédicure</option>
            <option value="soin">Soin des ongles</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-primary w-full h-12 flex items-center justify-center space-x-2 text-lg"
          >
            <Search className="w-5 h-5" />
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Recherches populaires :</span>
          {['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse'].map((popularCity) => (
            <button
              key={popularCity}
              type="button"
              onClick={() => {
                setCity(popularCity)
                onSearch(popularCity, serviceType)
              }}
              className="text-sm text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors"
            >
              {popularCity}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
