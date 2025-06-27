"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Registrar Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registrado: ", registration)
          })
          .catch((registrationError) => {
            console.log("SW registro falló: ", registrationError)
          })
      })
    }

    // Detectar si ya está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Escuchar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("Usuario aceptó la instalación")
    } else {
      console.log("Usuario rechazó la instalación")
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Guardar en localStorage para no mostrar por un tiempo
    localStorage.setItem("installPromptDismissed", Date.now().toString())
  }

  // No mostrar si ya está instalado o si fue rechazado recientemente
  if (isInstalled || !showInstallPrompt) return null

  const dismissedTime = localStorage.getItem("installPromptDismissed")
  if (dismissedTime && Date.now() - Number.parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">¡Instala la App!</h3>
              <p className="text-sm text-white/90 mb-3">
                Instala Bebés Llorones en tu dispositivo para jugar sin conexión y acceso rápido.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  className="bg-white text-pink-600 hover:bg-white/90 font-bold text-sm px-4 py-2"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Instalar
                </Button>
                <Button onClick={handleDismiss} variant="ghost" className="text-white hover:bg-white/20 p-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-3xl">👶</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
