const CACHE_NAME = "bebes-llorones-v1.0.0"

const urlsToCache = [
  "/",
  "/manifest.json",
  "/images/bebe-abeja.png",
  "/images/bebe-rana.png",
  "/images/bebe-conejo.png",
  "/images/bebe-astronauta.png",
  "/images/bebe-raton.png",
  "/images/bebe-elefante.png",
  "/images/bebe-dalmata.png",
  "/images/bebe-tiburon.png",
  "/images/bebe-dinosaurio.png",
  "/images/bebe-pollo.png",
]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierto")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Interceptar requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver desde cache si existe
      if (response) {
        return response
      }

      // Si no está en cache, hacer fetch
      return fetch(event.request).then((response) => {
        // Verificar si es una respuesta válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clonar la respuesta
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

// Limpiar caches antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Eliminando cache antiguo:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
