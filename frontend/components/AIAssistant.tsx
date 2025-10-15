import { useState, useEffect } from 'react'
import { MessageCircle, Sparkles, X, Send, Loader, Star, MapPin, Clock } from 'lucide-react'
import { Salon } from '@/types'

interface AIMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  salons?: Salon[]
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userLocation?: { lat: number; lng: number }
  userPreferences?: {
    budget?: string
    preferredServices?: string[]
    distance?: number
  }
}

export default function AIAssistant({ isOpen, onClose, userLocation, userPreferences }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [step, setStep] = useState<'greeting' | 'gathering' | 'suggesting' | 'booking'>('greeting')

  // Message d'accueil initial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: '1',
        type: 'assistant',
        content: '👋 Salut ! Je suis Naia, votre assistante beauté IA. Je suis là pour vous aider à trouver le salon parfait pour vos ongles ! Que recherchez-vous aujourd\'hui ?',
        timestamp: new Date(),
        suggestions: [
          'Je veux une manucure française',
          'Salon près de moi',
          'Pose de gel disponible aujourd\'hui',
          'Recommande-moi un salon'
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simuler la réponse de l'IA
    setTimeout(() => {
      const response = generateAIResponse(inputValue, step)
      setMessages(prev => [...prev, response])
      setIsTyping(false)
      
      // Mise à jour de l'étape
      if (step === 'greeting') setStep('gathering')
      else if (step === 'gathering') setStep('suggesting')
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSendMessage()
  }

  const generateAIResponse = (userInput: string, currentStep: string): AIMessage => {
    const input = userInput.toLowerCase()
    
    // Réponses intelligentes selon le contexte
    if (input.includes('manucure française') || input.includes('french')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✨ Parfait ! La manucure française est un classique intemporel. J\'ai trouvé 3 salons spécialisés près de vous avec d\'excellentes notes pour ce service.',
        timestamp: new Date(),
        salons: getMockSalons().slice(0, 3),
        suggestions: ['Voir les disponibilités', 'Comparer les prix', 'Lire les avis']
      }
    }
    
    if (input.includes('près de moi') || input.includes('proche')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: '📍 Voici les meilleurs salons dans un rayon de 5km autour de vous, triés par distance et note client :',
        timestamp: new Date(),
        salons: getMockSalons().slice(0, 4),
        suggestions: ['Afficher sur la carte', 'Filtrer par prix', 'Voir les horaires']
      }
    }
    
    if (input.includes('gel') || input.includes('pose')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: '💅 Pour une pose de gel durable, je recommande ces salons qui utilisent des produits premium et ont les meilleures techniques :',
        timestamp: new Date(),
        salons: getMockSalons().filter(s => s.rating >= 4.5).slice(0, 3),
        suggestions: ['Réserver maintenant', 'Voir les créneaux libres', 'Comparer les durées']
      }
    }
    
    if (input.includes('recommande') || input.includes('conseil')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: '🌟 Basé sur vos préférences et les avis clients, voici mes recommandations TOP pour vous. Ces salons ont tous plus de 4.5 étoiles !',
        timestamp: new Date(),
        salons: getMockSalons().filter(s => s.rating >= 4.5),
        suggestions: ['Pourquoi ces choix ?', 'Voir d\'autres options', 'Réserver le meilleur']
      }
    }

    // Réponse générique intelligente
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: '🤔 Intéressant ! Pour mieux vous conseiller, pouvez-vous me dire quel type de prestation vous intéresse le plus ? Je peux aussi vous suggérer des salons selon votre budget et vos préférences.',
      timestamp: new Date(),
      suggestions: [
        'Manucure classique (15-25€)',
        'Pose de gel (30-50€)', 
        'Nail art créatif (40-70€)',
        'Soin complet (50-80€)'
      ]
    }
  }

  const getMockSalons = (): Salon[] => [
    {
      id: 1,
      name: "Nail Paradise",
      description: "Spécialiste manucure française et nail art",
      address: "15 rue de la Beauté, Paris",
      city: "Paris",
      phone: "01 23 45 67 89",
      email: "contact@nailparadise.fr",
      rating: 4.8,
      total_reviews: 127,
      price_range: "€€",
      image_url: null,
      open_time: "09:00",
      close_time: "19:00",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Beauty Lounge",
      description: "Salon premium avec pose de gel exclusive",
      address: "8 avenue des Champs, Paris",
      city: "Paris", 
      phone: "01 23 45 67 90",
      email: "info@beautylounge.fr",
      rating: 4.9,
      total_reviews: 89,
      price_range: "€€€",
      image_url: null,
      open_time: "10:00",
      close_time: "20:00",
      created_at: new Date().toISOString()
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Naia IA</h3>
              <p className="text-sm text-gray-600">Assistante beauté</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Salons recommandés */}
                {message.salons && (
                  <div className="mt-3 space-y-2">
                    {message.salons.map((salon) => (
                      <div key={salon.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{salon.name}</h4>
                            <div className="flex items-center mt-1 space-x-3">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs ml-1 text-gray-600">{salon.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">{salon.price_range}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600 ml-1">{salon.city}</span>
                            </div>
                          </div>
                          <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs transition-colors">
                            Voir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center mr-2 mt-auto order-2">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Posez-moi une question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Bouton d'ouverture de l'assistant
export function AIAssistantTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 animate-pulse-soft"
    >
      <MessageCircle className="w-6 h-6" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <Sparkles className="w-2 h-2 text-white" />
      </div>
    </button>
  )
}
