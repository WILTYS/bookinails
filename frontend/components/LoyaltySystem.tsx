import { useState } from 'react'
import { Star, Gift, Users, Share2, Copy, Check } from 'lucide-react'

interface LoyaltyPoints {
  current_points: number
  total_earned: number
  next_reward_threshold: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
}

interface ReferralData {
  referral_code: string
  referred_count: number
  earnings: number
}

// Badge de statut client
export function LoyaltyBadge({ points, tier }: { points: number; tier: string }) {
  const tierColors = {
    Bronze: 'bg-orange-100 text-orange-800 border-orange-200',
    Silver: 'bg-gray-100 text-gray-800 border-gray-200', 
    Gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Platinum: 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const tierIcons = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Platinum: '💎'
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${tierColors[tier as keyof typeof tierColors]}`}>
      <span>{tierIcons[tier as keyof typeof tierIcons]}</span>
      <span>{tier}</span>
      <span className="text-xs">({points} pts)</span>
    </div>
  )
}

// Système de points fidélité
export function LoyaltyCard({ loyalty }: { loyalty: LoyaltyPoints }) {
  const progressPercentage = (loyalty.current_points / loyalty.next_reward_threshold) * 100

  return (
    <div className="bg-gradient-to-br from-primary-500 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl">💅</div>
        <div className="absolute bottom-4 left-4 text-4xl">✨</div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Carte Fidélité</h3>
            <LoyaltyBadge points={loyalty.current_points} tier={loyalty.tier} />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{loyalty.current_points}</div>
            <div className="text-sm opacity-80">points</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Prochain palier</span>
            <span>{loyalty.next_reward_threshold} pts</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-sm opacity-90">
          Plus que {loyalty.next_reward_threshold - loyalty.current_points} points pour le prochain palier !
        </div>
      </div>
    </div>
  )
}

// Système de parrainage
export function ReferralSystem({ referral }: { referral: ReferralData }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const referralUrl = `https://bookinails.fr/register?ref=${referral.referral_code}`
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback pour navigateurs plus anciens
      const textArea = document.createElement('textarea')
      textArea.value = referralUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const referralUrl = `https://bookinails.fr/register?ref=${referral.referral_code}`
    const shareData = {
      title: 'Rejoins-moi sur Bookinails !',
      text: 'Découvre la meilleure plateforme pour réserver ta manucure. Reçois 5€ offerts à ton inscription !',
      url: referralUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // L'utilisateur a annulé le partage
      }
    } else {
      // Fallback : copier le lien
      handleCopy()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Parrainage</h3>
          <p className="text-sm text-gray-600">Invitez vos amies et gagnez ensemble</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{referral.referred_count}</div>
          <div className="text-sm text-gray-600">Amies invitées</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{referral.earnings}€</div>
          <div className="text-sm text-gray-600">Gains totaux</div>
        </div>
      </div>

      {/* Code de parrainage */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre code de parrainage
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={referral.referral_code}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-center font-mono text-lg"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copier le code"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Boutons de partage */}
      <div className="space-y-3">
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Partager mon code</span>
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous et votre amie recevez <span className="font-semibold text-green-600">5€ offerts</span> 💰
          </p>
        </div>
      </div>
    </div>
  )
}

// Récompenses disponibles
export function RewardsShop({ points }: { points: number }) {
  const rewards = [
    { id: 1, name: '5€ offerts', cost: 100, description: 'Réduction sur votre prochaine réservation', icon: '💰' },
    { id: 2, name: '10€ offerts', cost: 200, description: 'Réduction sur votre prochaine réservation', icon: '💸' },
    { id: 3, name: 'Manucure gratuite', cost: 500, description: 'Une manucure classique offerte', icon: '💅' },
    { id: 4, name: 'Soin premium', cost: 800, description: 'Accès aux soins premium exclusifs', icon: '✨' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <Gift className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Boutique Récompenses</h3>
          <p className="text-sm text-gray-600">Échangez vos points contre des avantages</p>
        </div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const canAfford = points >= reward.cost
          
          return (
            <div key={reward.id} className={`flex items-center justify-between p-4 rounded-lg border ${
              canAfford ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{reward.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{reward.name}</h4>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{reward.cost} pts</div>
                <button
                  disabled={!canAfford}
                  className={`text-sm px-3 py-1 rounded transition-colors ${
                    canAfford 
                      ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Échanger' : 'Insuffisant'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
