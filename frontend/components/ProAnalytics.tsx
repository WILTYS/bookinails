import { useState, useEffect } from 'react'
import { TrendingUp, Users, Euro, Calendar, Download, Eye, BarChart3, PieChart, Clock, Star } from 'lucide-react'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  bookings: {
    current: number
    previous: number
    growth: number
  }
  clients: {
    current: number
    previous: number
    growth: number
  }
  occupancy: {
    current: number
    previous: number
    growth: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number }>
  serviceBreakdown: Array<{ service: string; count: number; revenue: number }>
  timeSlotPopularity: Array<{ time: string; bookings: number }>
  clientRetention: {
    new: number
    returning: number
    loyal: number
  }
}

// Composant de statistique
function StatCard({ title, value, previousValue, growth, icon, format = 'number' }: {
  title: string
  value: number
  previousValue: number
  growth: number
  icon: React.ReactNode
  format?: 'number' | 'currency' | 'percentage'
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `${val}€`
      case 'percentage':
        return `${val}%`
      default:
        return val.toString()
    }
  }

  const isPositive = growth >= 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`w-4 h-4 ${!isPositive && 'rotate-180'}`} />
          <span className="text-sm font-medium">{Math.abs(growth)}%</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        vs mois précédent ({formatValue(previousValue)})
      </div>
    </div>
  )
}

// Graphique simplifié avec barres
function BarChart({ data, title }: { data: Array<{ label: string; value: number }>, title: string }) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-12 text-sm font-medium text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Camembert simplifié
function PieChartSimple({ data, title }: { 
  data: Array<{ label: string; value: number; color: string }>, 
  title: string 
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        {/* Cercle visuel simplifié */}
        <div className="relative w-32 h-32">
          <div className="w-32 h-32 rounded-full bg-gray-200 relative overflow-hidden">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${item.color} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg 360deg)`,
                    transform: `rotate(${data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0)}deg)`
                  }}
                />
              )
            })}
          </div>
        </div>
        
        {/* Légende */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setAnalyticsData({
        revenue: { current: 3420, previous: 2980, growth: 14.8 },
        bookings: { current: 87, previous: 76, growth: 14.5 },
        clients: { current: 54, previous: 48, growth: 12.5 },
        occupancy: { current: 78, previous: 72, growth: 8.3 },
        monthlyRevenue: [
          { month: 'Jan', revenue: 2800 },
          { month: 'Fév', revenue: 3100 },
          { month: 'Mar', revenue: 2950 },
          { month: 'Avr', revenue: 3200 },
          { month: 'Mai', revenue: 3420 }
        ],
        serviceBreakdown: [
          { service: 'Manucure classique', count: 32, revenue: 960 },
          { service: 'Pose de gel', count: 24, revenue: 1200 },
          { service: 'Nail art', count: 18, revenue: 900 },
          { service: 'Soin complet', count: 13, revenue: 910 }
        ],
        timeSlotPopularity: [
          { time: '9h-11h', bookings: 12 },
          { time: '11h-13h', bookings: 18 },
          { time: '13h-15h', bookings: 8 },
          { time: '15h-17h', bookings: 25 },
          { time: '17h-19h', bookings: 24 }
        ],
        clientRetention: {
          new: 35,
          returning: 45,
          loyal: 20
        }
      })
      setLoading(false)
    }, 1000)
  }, [period])

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytiques & Statistiques</h2>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <button className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chiffre d'affaires"
          value={analyticsData.revenue.current}
          previousValue={analyticsData.revenue.previous}
          growth={analyticsData.revenue.growth}
          icon={<Euro className="w-5 h-5 text-primary-500" />}
          format="currency"
        />
        <StatCard
          title="Réservations"
          value={analyticsData.bookings.current}
          previousValue={analyticsData.bookings.previous}
          growth={analyticsData.bookings.growth}
          icon={<Calendar className="w-5 h-5 text-primary-500" />}
        />
        <StatCard
          title="Clients uniques"
          value={analyticsData.clients.current}
          previousValue={analyticsData.clients.previous}
          growth={analyticsData.clients.growth}
          icon={<Users className="w-5 h-5 text-primary-500" />}
        />
        <StatCard
          title="Taux d'occupation"
          value={analyticsData.occupancy.current}
          previousValue={analyticsData.occupancy.previous}
          growth={analyticsData.occupancy.growth}
          icon={<Clock className="w-5 h-5 text-primary-500" />}
          format="percentage"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Services les plus demandés"
          data={analyticsData.serviceBreakdown.map(s => ({ label: s.service, value: s.count }))}
        />
        
        <BarChart
          title="Créneaux populaires"
          data={analyticsData.timeSlotPopularity.map(t => ({ label: t.time, value: t.bookings }))}
        />
      </div>

      {/* Rétention client */}
      <PieChartSimple
        title="Répartition clientèle"
        data={[
          { label: 'Nouveaux clients', value: analyticsData.clientRetention.new, color: '#3b82f6' },
          { label: 'Clients récurrents', value: analyticsData.clientRetention.returning, color: '#10b981' },
          { label: 'Clients fidèles', value: analyticsData.clientRetention.loyal, color: '#f59e0b' }
        ]}
      />

      {/* Insights IA */}
      <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">💡 Insights IA</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Votre CA a augmenté de <strong>14.8%</strong> ce mois - excellente performance !</li>
              <li>• Les créneaux 15h-17h sont les plus demandés (+25 réservations)</li>
              <li>• Les poses de gel génèrent le meilleur CA/prestation (50€ moyenne)</li>
              <li>• 45% de clients récurrents - fidélité au-dessus de la moyenne du secteur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
