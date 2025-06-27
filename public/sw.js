const CACHE_NAME = "bebes-llorones-v1.0.1"

const urlsToCache = ["/", "/manifest.json"]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierto")
      return cache.addAll(urlsToCache).catch((error) => {
        console.log("Error cacheando archivos:", error)
      })
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
      return fetch(event.request)
        .then((response) => {
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
        .catch(() => {
          // Si falla el fetch, devolver página offline básica
          return new Response(
            `<!DOCTYPE html>
          <html>
          <head>
            <title>Bebés Llorones - Sin conexión</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px;
                background: linear-gradient(135deg, #fce7f3, #e0e7ff);
              }
              .container {
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                max-width: 400px;
                margin: 0 auto;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>👶💕</h1>
              <h2>¡Buaaa!</h2>
              <p>No hay conexión a internet</p>
              <p>Los Bebés Llorones te esperan cuando vuelvas</p>
              <button onclick="window.location.reload()">Intentar de nuevo</button>
            </div>
          </body>
          </html>`,
            {
              headers: { "Content-Type": "text/html" },
            },
          )
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
