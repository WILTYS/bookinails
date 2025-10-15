import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Afficher le prompt après un délai (pour ne pas être intrusif)
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000) // Attendre 30 secondes
    }

    // Vérifier si l'app est déjà installée
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    // Écouter l'installation réussie
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    checkInstalled()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installation accepted')
      } else {
        console.log('PWA installation dismissed')
      }
    } catch (error) {
      console.error('PWA installation failed:', error)
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Ne pas afficher si déjà installé ou si l'utilisateur a déjà refusé récemment
  if (isInstalled || !deferredPrompt) return null

  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
    return null // Pas de re-prompt pendant 7 jours
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 animate-slide-up max-w-sm mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">💅</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Installer Bookinails
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Accédez rapidement à vos réservations depuis votre écran d'accueil !
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Installer</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Avantages */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1 text-gray-600">
            <Smartphone className="w-3 h-3" />
            <span>Accès rapide</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Monitor className="w-3 h-3" />
            <span>Hors ligne</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook pour gérer les notifications push
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied'

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const subscribe = async (): Promise<PushSubscription | null> => {
    if (!isSupported || permission !== 'granted') return null

    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true
      })

      setSubscription(sub)
      
      // Envoyer la subscription au serveur
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      })

      return sub
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  }

  const unsubscribe = async (): Promise<void> => {
    if (subscription) {
      await subscription.unsubscribe()
      setSubscription(null)
      
      // Notifier le serveur
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      })
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe
  }
}

// Helper pour convertir la clé VAPID
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Composant pour gérer les notifications
export function NotificationManager() {
  const { 
    isSupported, 
    permission, 
    subscribe, 
    requestPermission 
  } = usePushNotifications()

  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  useEffect(() => {
    // Proposer les notifications après quelques interactions
    const interactionCount = parseInt(localStorage.getItem('interaction-count') || '0')
    if (isSupported && permission === 'default' && interactionCount >= 3) {
      setTimeout(() => setShowNotificationPrompt(true), 2000)
    }
  }, [isSupported, permission])

  const handleEnableNotifications = async () => {
    const result = await requestPermission()
    if (result === 'granted') {
      await subscribe()
    }
    setShowNotificationPrompt(false)
  }

  if (!showNotificationPrompt || !isSupported) return null

  return (
    <div className="fixed top-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-sm">🔔</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Notifications activées ?
          </h4>
          <p className="text-xs text-blue-700 mb-2">
            Recevez des rappels pour vos rendez-vous
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleEnableNotifications}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Activer
            </button>
            <button
              onClick={() => setShowNotificationPrompt(false)}
              className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded text-xs transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowNotificationPrompt(false)}
          className="text-blue-400 hover:text-blue-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
