// Service Worker pour Bookinails PWA
const CACHE_NAME = 'bookinails-v1.0.0'
const STATIC_CACHE = 'bookinails-static-v1'
const DYNAMIC_CACHE = 'bookinails-dynamic-v1'

// Files à mettre en cache immédiatement
const STATIC_FILES = [
  '/',
  '/login',
  '/register',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// URLs à mettre en cache dynamiquement
const CACHE_STRATEGIES = {
  images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  api: /\/api\//,
  fonts: /\.(woff|woff2|ttf|otf)$/i
}

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('[SW] Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Activation complete')
        return self.clients.claim()
      })
  )
})

// Intercepter les requêtes réseau
self.addEventListener('fetch', event => {
  const { request } = event
  const { url, method } = request
  
  // Ignorer les requêtes non-GET
  if (method !== 'GET') return
  
  // Stratégie Cache First pour les fichiers statiques
  if (CACHE_STRATEGIES.images.test(url) || CACHE_STRATEGIES.fonts.test(url)) {
    event.respondWith(cacheFirst(request))
    return
  }
  
  // Stratégie Network First pour l'API
  if (CACHE_STRATEGIES.api.test(url)) {
    event.respondWith(networkFirst(request))
    return
  }
  
  // Stratégie Stale While Revalidate pour les pages
  event.respondWith(staleWhileRevalidate(request))
})

// Stratégie Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Cache first failed:', error)
    return new Response('Network error', { status: 408 })
  }
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Network first failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response(JSON.stringify({ 
      error: 'Network unavailable', 
      offline: true 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    })
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  const networkResponsePromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => {
      // En cas d'erreur réseau, servir la page offline pour les pages HTML
      if (request.headers.get('accept')?.includes('text/html')) {
        return caches.match('/offline.html')
      }
      throw new Error('Network error')
    })
  
  return cachedResponse || networkResponsePromise
}

// Push Notifications
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event)
  
  const options = {
    body: 'Vous avez une nouvelle notification !',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/xmark.png'
      }
    ]
  }
  
  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.title = data.title || 'Bookinails'
    options.icon = data.icon || options.icon
    options.data = { ...options.data, ...data }
  }
  
  event.waitUntil(
    self.registration.showNotification('Bookinails', options)
  )
})

// Clic sur notification
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click:', event)
  
  event.notification.close()
  
  const { action, notification } = event
  
  if (action === 'close') {
    return
  }
  
  const urlToOpen = action === 'explore' 
    ? '/dashboard/client'
    : '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Si l'app est déjà ouverte, la focus
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus()
          }
        }
        // Sinon ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background Sync
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'background-sync-reservations') {
    event.waitUntil(syncReservations())
  }
})

// Synchroniser les réservations en arrière-plan
async function syncReservations() {
  try {
    // Récupérer les données en attente de sync depuis IndexedDB
    const pendingData = await getStoredData('pending-reservations')
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        try {
          await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          
          // Supprimer de la file d'attente si succès
          await removeStoredData('pending-reservations', data.id)
        } catch (error) {
          console.log('[SW] Sync failed for reservation:', data.id)
        }
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error)
  }
}

// Helpers pour IndexedDB
async function getStoredData(storeName) {
  // Implémentation simplifiée - dans une vraie app, utiliser IndexedDB
  return []
}

async function removeStoredData(storeName, id) {
  // Implémentation simplifiée
  return true
}
