import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, User, Phone, Mail, CreditCard, LogOut, Plus } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Reservation } from '@/types'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ClientDashboard() {
  const { user, logout, isAuthenticated, isProfessional } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile'>('upcoming')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (isProfessional) {
      router.push('/dashboard/pro')
      return
    }

    loadReservations()
  }, [isAuthenticated, isProfessional])

  const loadReservations = async () => {
    try {
      const response = await axios.get('/api/reservations')
      setReservations(response.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations')
    } finally {
      setLoading(false)
    }
  }

  const cancelReservation = async (reservationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return

    try {
      await axios.patch(`/api/reservations/${reservationId}/cancel`)
      toast.success('Réservation annulée avec succès')
      loadReservations()
    } catch (error) {
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const upcomingReservations = reservations.filter(r => 
    new Date(r.appointment_date) > new Date() && r.status === 'confirmed'
  )
  
  const pastReservations = reservations.filter(r => 
    new Date(r.appointment_date) <= new Date() || r.status !== 'confirmed'
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Mon espace client | Bookinails</title>
        <meta name="description" content="Gérez vos réservations de manucure" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-500 p-2 rounded-lg">
                  <span className="text-white font-bold text-xl">💅</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Bookinails</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-600">Client</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'upcoming'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>RDV à venir ({upcomingReservations.length})</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('past')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'past'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Historique ({pastReservations.length})</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </div>
                  </button>
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => router.push('/')}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouvelle réservation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'upcoming' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Mes prochains rendez-vous</h1>
                    <span className="text-gray-600">{upcomingReservations.length} RDV</span>
                  </div>

                  {upcomingReservations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun rendez-vous à venir
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Réservez votre prochaine séance de manucure dès maintenant !
                      </p>
                      <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                      >
                        Réserver maintenant
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingReservations.map(reservation => (
                        <div key={reservation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {reservation.service_type}
                                </h3>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Confirmé
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(reservation.appointment_date).toLocaleDateString('fr-FR', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {new Date(reservation.appointment_date).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })} - {reservation.duration_minutes} min
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>Salon {reservation.salon_id}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-semibold text-primary-600 mb-2">
                                {reservation.price}€
                              </div>
                              <button
                                onClick={() => cancelReservation(reservation.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'past' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Historique des rendez-vous</h1>
                    <span className="text-gray-600">{pastReservations.length} RDV</span>
                  </div>

                  <div className="space-y-4">
                    {pastReservations.map(reservation => (
                      <div key={reservation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {reservation.service_type}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                reservation.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : reservation.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {reservation.status === 'completed' ? 'Terminé' :
                                 reservation.status === 'cancelled' ? 'Annulé' : 'Passé'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(reservation.appointment_date).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900 mb-2">
                              {reservation.price}€
                            </div>
                            {reservation.status === 'completed' && (
                              <button className="text-primary-600 hover:text-primary-700 text-sm">
                                Laisser un avis
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            defaultValue={user?.phone}
                            className="input-field"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="input-field"
                          disabled
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button type="submit" className="btn-primary">
                          Mettre à jour
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
