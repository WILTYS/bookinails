import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Calendar, Clock, MapPin, Star, User, Phone, Mail, 
  Settings, LogOut, Plus, TrendingUp, Users, Euro,
  Edit, Eye, CheckCircle, XCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Reservation, Salon } from '@/types'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProDashboard() {
  const { user, logout, isAuthenticated, isProfessional } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [salon, setSalon] = useState<Salon | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'salon' | 'schedule'>('overview')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (!isProfessional) {
      router.push('/dashboard/client')
      return
    }

    loadData()
  }, [isAuthenticated, isProfessional])

  const loadData = async () => {
    try {
      const [reservationsRes, salonRes] = await Promise.all([
        axios.get('/api/reservations'),
        axios.get('/api/salons/my-salon') // Assuming this endpoint exists
      ])
      
      setReservations(reservationsRes.data)
      setSalon(salonRes.data)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (reservationId: number, status: string) => {
    try {
      await axios.patch(`/api/reservations/${reservationId}/status`, { status })
      toast.success('Statut mis à jour')
      loadData()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  // Statistics
  const todayReservations = reservations.filter(r => 
    new Date(r.appointment_date).toDateString() === new Date().toDateString()
  )
  
  const thisMonthRevenue = reservations
    .filter(r => 
      new Date(r.appointment_date).getMonth() === new Date().getMonth() &&
      r.payment_status === 'paid'
    )
    .reduce((sum, r) => sum + r.price, 0)

  const upcomingReservations = reservations.filter(r => 
    new Date(r.appointment_date) > new Date() && r.status === 'confirmed'
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
        <title>Dashboard Professionnel | Bookinails</title>
        <meta name="description" content="Gérez votre salon et vos réservations" />
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
                <span className="text-xl font-bold text-gray-900">Bookinails Pro</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{salon?.name || user?.name}</div>
                  <div className="text-sm text-gray-600">Professionnel</div>
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
                    <div className="w-6 h-6 bg-primary-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{salon?.name || 'Mon salon'}</div>
                    <div className="text-sm text-gray-600">{salon?.city}</div>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Vue d'ensemble</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'reservations'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Réservations ({reservations.length})</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('salon')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'salon'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Mon salon</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'schedule'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Horaires</span>
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{todayReservations.length}</div>
                          <div className="text-sm text-gray-600">RDV aujourd'hui</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Euro className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{thisMonthRevenue}€</div>
                          <div className="text-sm text-gray-600">CA ce mois</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{upcomingReservations.length}</div>
                          <div className="text-sm text-gray-600">RDV à venir</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Appointments */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">RDV d'aujourd'hui</h2>
                    
                    {todayReservations.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun rendez-vous aujourd'hui</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todayReservations.map(reservation => (
                          <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{reservation.service_type}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(reservation.appointment_date).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} - Client #{reservation.client_id}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-primary-600">{reservation.price}€</div>
                              <div className="text-sm text-gray-600">{reservation.duration_minutes} min</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des réservations</h1>
                    <span className="text-gray-600">{reservations.length} réservations</span>
                  </div>

                  <div className="space-y-4">
                    {reservations.map(reservation => (
                      <div key={reservation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {reservation.service_type}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                reservation.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : reservation.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {reservation.status}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(reservation.appointment_date).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
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
                                <User className="w-4 h-4" />
                                <span>Client #{reservation.client_id}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold text-primary-600 mb-2">
                              {reservation.price}€
                            </div>
                            <div className="space-x-2">
                              {reservation.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => updateReservationStatus(reservation.id, 'completed')}
                                    className="text-green-600 hover:text-green-700 text-sm"
                                  >
                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                    Terminer
                                  </button>
                                  <button
                                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    <XCircle className="w-4 h-4 inline mr-1" />
                                    Annuler
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'salon' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Configuration du salon</h1>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations générales</h2>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du salon
                          </label>
                          <input
                            type="text"
                            defaultValue={salon?.name}
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ville
                          </label>
                          <input
                            type="text"
                            defaultValue={salon?.city}
                            className="input-field"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse complète
                        </label>
                        <input
                          type="text"
                          defaultValue={salon?.address}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          defaultValue={salon?.description}
                          className="input-field resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            defaultValue={salon?.phone}
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue={salon?.email}
                            className="input-field"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button type="submit" className="btn-primary">
                          Sauvegarder les modifications
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des horaires</h1>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Horaires d'ouverture</h2>
                    
                    <div className="space-y-4">
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                        <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="font-medium text-gray-900">{day}</div>
                          <div>
                            <input
                              type="time"
                              defaultValue={index < 6 ? "09:00" : ""}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <input
                              type="time"
                              defaultValue={index < 6 ? "18:00" : ""}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                defaultChecked={index < 6}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-600">Ouvert</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6">
                      <button className="btn-primary">
                        Mettre à jour les horaires
                      </button>
                    </div>
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
