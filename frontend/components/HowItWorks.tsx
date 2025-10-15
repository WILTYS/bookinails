import { Search, Calendar, Sparkles, Star } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Trouvez votre salon idéal",
      description: "Recherchez par localisation, services ou prix. Notre IA Naia vous recommande les meilleurs salons.",
      color: "from-pink-500 to-pink-600",
      iconColor: "text-pink-600"
    },
    {
      icon: Calendar,
      number: "2", 
      title: "Réservez votre créneau préféré",
      description: "Choisissez date et heure en temps réel. Confirmation immédiate, paiement sur place.",
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-600"
    },
    {
      icon: Sparkles,
      number: "3",
      title: "Profitez de votre moment beauté",
      description: "Détendez-vous pendant que nos professionnels certifiés prennent soin de vos ongles.",
      color: "from-purple-500 to-purple-600", 
      iconColor: "text-purple-600"
    },
    {
      icon: Star,
      number: "4",
      title: "Partagez votre expérience",
      description: "Laissez un avis, gagnez des points fidélité et aidez la communauté Bookinails.",
      color: "from-yellow-500 to-orange-500",
      iconColor: "text-yellow-600"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Réserver votre salon de manucure n'a jamais été aussi simple. 
            En 4 étapes, vous êtes prête à briller !
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-200 to-pink-300 z-0"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                {/* Number Badge */}
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 mt-4 rounded-2xl bg-gradient-to-r ${step.color} bg-opacity-10 flex items-center justify-center`}>
                  <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bottom */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Prête à commencer votre expérience beauté ?
            </h3>
            <p className="text-pink-100 mb-6">
              Rejoignez les milliers de clientes qui nous font confiance chaque jour
            </p>
            <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-lg text-lg">
              Trouver un salon maintenant
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          {[
            { number: "15,000+", label: "Clientes satisfaites" },
            { number: "500+", label: "Salons partenaires" },
            { number: "98%", label: "Taux de satisfaction" },
            { number: "24/7", label: "Support client" }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
