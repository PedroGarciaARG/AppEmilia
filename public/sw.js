const CACHE_NAME = "bebes-llorones-v1.0.0"
const BASE_PATH = "/bebes-llorones-app"

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/images/bebe-abeja.png`,
  `${BASE_PATH}/images/bebe-rana.png`,
  `${BASE_PATH}/images/bebe-conejo.png`,
  `${BASE_PATH}/images/bebe-astronauta.png`,
  `${BASE_PATH}/images/bebe-raton.png`,
  `${BASE_PATH}/images/bebe-elefante.png`,
  `${BASE_PATH}/images/bebe-dalmata.png`,
  `${BASE_PATH}/images/bebe-tiburon.png`,
  `${BASE_PATH}/images/bebe-dinosaurio.png`,
  `${BASE_PATH}/images/bebe-pollo.png`,
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
