const cacheName = "js13kPWA-v1"
const appShellFiles = []
const contentToCache = appShellFiles
self.addEventListener('install', (e) => {
  console.log('[Service Worker] install')
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      console.log("[Service Worker] Caching all: app shell and content")
      await cache.addAll(contentToCache)
    })(),
  )
})
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] activate')
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return
          }
          return caches.delete(key)
        }),
      )
    }),
  )
})
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] fetch', e.request.url)
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request)
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
      if (r) {
        return r
      }
      const response = await fetch(e.request)
      const cache = await caches.open(cacheName)
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
      cache.put(e.request, response.clone())
      return response
    })(),
  )
})
self.addEventListener('push', (e) => {
  console.log('[Service Worker] push')
  const payload = e.data?.text() ?? 'no payload'
  e.waitUntil(
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: payload,
    }),
  )
})
