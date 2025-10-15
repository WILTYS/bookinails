import { useState, useEffect } from 'react'
import { Star, Users, Calendar, Award, TrendingUp } from 'lucide-react'

export default function SocialProof() {
  const [counters, setCounters] = useState({
    reviews: 0,
    bookings: 0,
    salons: 0,
    satisfaction: 0
  })

  // Animation des compteurs
  useEffect(() => {
    const targets = {
      reviews: 15247,
      bookings: 2583,
      salons: 547,
      satisfaction: 98
    }

    const duration = 2000 // 2 secondes
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounters({
        reviews: Math.floor(targets.reviews * progress),
        bookings: Math.floor(targets.bookings * progress),
        salons: Math.floor(targets.salons * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounters(targets)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const testimonials = [
    {
      name: "Sophie Martin",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Service parfait ! Le salon était exactement comme sur les photos. Je recommande vivement Bookinails.",
      salon: "Nail Art Paradise",
      service: "Manucure française",
      verified: true
    },
    {
      name: "Emma Dubois",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "L'IA Naia m'a trouvé le salon parfait près de chez moi. Réservation en 2 clics, c'est magique !",
      salon: "Beauty Nails Studio",
      service: "Pose de gel",
      verified: true
    },
    {
      name: "Léa Moreau",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Première fois que je réserve en ligne pour mes ongles. Interface super intuitive, j'adore !",
      salon: "Luxe Nails Spa",
      service: "Nail art créatif",
      verified: true
    }
  ]

  const liveActivities = [
    "🎉 Camille vient de réserver chez Nail Boutique (Lyon)",
    "⭐ Marie a laissé un avis 5 étoiles à Beauty Studio",
    "💅 Julie termine sa manucure chez Luxe Nails (Nice)",
    "🔥 10 nouvelles réservations dans les 5 dernières minutes",
    "✨ Sarah a recommandé Bookinails à ses amies"
  ]

  const [currentActivity, setCurrentActivity] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Activity Ticker */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-full py-3 px-6 text-white text-center mb-12 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="font-medium">
              {liveActivities[currentActivity]}
            </span>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Star,
              number: counters.reviews.toLocaleString(),
              suffix: "+",
              label: "Avis clients vérifiés",
              color: "text-yellow-600",
              bgColor: "bg-yellow-50"
            },
            {
              icon: Calendar,
              number: counters.bookings.toLocaleString(),
              suffix: "+",
              label: "Réservations ce mois",
              color: "text-blue-600",
              bgColor: "bg-blue-50"
            },
            {
              icon: Users,
              number: counters.salons.toLocaleString(),
              suffix: "+",
              label: "Salons partenaires",
              color: "text-purple-600",
              bgColor: "bg-purple-50"
            },
            {
              icon: Award,
              number: counters.satisfaction,
              suffix: "%",
              label: "Taux de satisfaction",
              color: "text-green-600",
              bgColor: "bg-green-50"
            }
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className={`w-16 h-16 mx-auto rounded-2xl ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}{stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Ce que disent nos clientes
          </h3>
          <p className="text-gray-600 text-center mb-8">
            Avis 100% authentiques de vraies utilisatrices Bookinails
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Service Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{testimonial.salon}</span>
                  <span>{testimonial.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">
            Ils nous font confiance
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "Stripe Certified",
              "SSL Sécurisé", 
              "RGPD Compliant",
              "Google Partner",
              "Trusted Reviews"
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <Award className="w-5 h-5" />
                <span className="font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
