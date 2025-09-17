// Service Worker for Smart Caching
const CACHE_NAME = 'wasitak-v1'
const STATIC_CACHE = 'wasitak-static-v1'
const DYNAMIC_CACHE = 'wasitak-dynamic-v1'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
]

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then(fetchResponse => {
            // Don't cache if not a valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse
            }
            
            // Clone the response
            const responseToCache = fetchResponse.clone()
            
            // Determine which cache to use
            const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE
            
            // Cache the response
            caches.open(cacheName)
              .then(cache => {
                cache.put(request, responseToCache)
              })
            
            return fetchResponse
          })
          .catch(error => {
            console.log('Fetch failed:', error)
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html')
            }
            
            // Return cached version if available
            return caches.match(request)
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'لديك إشعار جديد',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'عرض',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/favicon.ico'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('وسيطك', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset))
}

async function doBackgroundSync() {
  try {
    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests()
    
    for (const request of pendingRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        })
        
        // Remove from pending requests
        await removePendingRequest(request.id)
      } catch (error) {
        console.log('Background sync failed for request:', request.id, error)
      }
    }
  } catch (error) {
    console.log('Background sync error:', error)
  }
}

// IndexedDB helpers for offline storage
async function getPendingRequests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wasitak-offline', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pending-requests'], 'readonly')
      const store = transaction.objectStore('pending-requests')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

async function removePendingRequest(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wasitak-offline', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pending-requests'], 'readwrite')
      const store = transaction.objectStore('pending-requests')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}
