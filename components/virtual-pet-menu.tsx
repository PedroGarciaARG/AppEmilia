"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Coins, ShoppingCart, Gamepad2, Baby, Home } from "lucide-react"
import VirtualPetCare from "@/components/virtual-pet-care"
import EnhancedStore from "@/components/enhanced-store"
import MemoryGame from "@/components/memory-game"
import GooseGame from "@/components/goose-game"
import ShapeMatchingGame from "@/components/shape-matching-game"
import PenaltyKickGame from "@/components/penalty-kick-game"

interface PetNeeds {
  hunger: number
  hygiene: number
  sleep: number
  play: number
  affection: number
  bathroom: number
}

interface VirtualPet {
  id: string
  name: string
  image: string
  needs: PetNeeds
  mood: "FELIZ" | "NORMAL" | "TRISTE" | "ENFERMO"
  level: number
  experience: number
  lastCared: number
  age: number
}

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  coins: number
  level: number
  ownedAvatars: string[]
  ownedPets: string[]
  ownedItems: { [key: string]: number }
  virtualPets: { [key: string]: VirtualPet }
}

interface VirtualPetMenuProps {
  profile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
  onAddCoins: (amount: number) => void
  onBackToMain: () => void
}

export default function VirtualPetMenu({ profile, onUpdateProfile, onAddCoins, onBackToMain }: VirtualPetMenuProps) {
  const [currentView, setCurrentView] = useState<
    "menu" | "care" | "store" | "coin-games" | "memory" | "goose" | "shapes" | "penalty"
  >("menu")

  const handlePurchaseAvatar = (avatarId: string, cost: number) => {
    if (profile.stars >= cost && !profile.ownedAvatars.includes(avatarId)) {
      const newProfile = {
        ...profile,
        stars: profile.stars - cost,
        ownedAvatars: [...profile.ownedAvatars, avatarId],
      }
      onUpdateProfile(newProfile)

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡BUAAA DE FELICIDAD! ¡NUEVO AVATAR DESBLOQUEADO!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handleSelectAvatar = (avatarId: string) => {
    if (profile.ownedAvatars.includes(avatarId)) {
      const avatarImage = avatarId.includes("bebe-")
        ? avatarId.startsWith("bebe-abeja") ||
          avatarId.startsWith("bebe-rana") ||
          avatarId.startsWith("bebe-conejo") ||
          avatarId.startsWith("bebe-astronauta")
          ? `/images/${avatarId}.png`
          : `/images/avatars/${avatarId}.png`
        : `/images/avatars/${avatarId}.png`

      const newProfile = {
        ...profile,
        avatar: avatarImage,
      }
      onUpdateProfile(newProfile)
    }
  }

  const handlePurchasePet = (petId: string, cost: number) => {
    if (profile.stars >= cost && !profile.ownedPets.includes(petId)) {
      const newPet: VirtualPet = {
        id: petId,
        name: `MI ${petId.replace("bebe-", "").toUpperCase()}`,
        image: `/images/${petId}.png`,
        needs: {
          hunger: 100,
          hygiene: 100,
          sleep: 100,
          play: 100,
          affection: 100,
          bathroom: 0,
        },
        mood: "FELIZ",
        level: 1,
        experience: 0,
        lastCared: Date.now(),
        age: 1,
      }

      const newProfile = {
        ...profile,
        stars: profile.stars - cost,
        ownedPets: [...profile.ownedPets, petId],
        virtualPets: {
          ...profile.virtualPets,
          [petId]: newPet,
        },
      }
      onUpdateProfile(newProfile)

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡BUAAA DE FELICIDAD! ¡NUEVA MASCOTA ADOPTADA!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handlePurchaseItem = (itemId: string, cost: number, quantity: number) => {
    if (profile.coins >= cost) {
      const newProfile = {
        ...profile,
        coins: profile.coins - cost,
        ownedItems: {
          ...profile.ownedItems,
          [itemId]: (profile.ownedItems[itemId] || 0) + quantity,
        },
      }
      onUpdateProfile(newProfile)

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡COMPRA REALIZADA!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  if (currentView === "care") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("menu")}
              className="bg-white/90 text-purple-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-purple-300"
            >
              <span className="no-uppercase">🐾</span> MENÚ MASCOTAS
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-pink-300">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                <span className="font-bold text-pink-600">{profile.stars}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-600">{profile.coins}</span>
              </div>
            </div>
          </div>
          <VirtualPetCare profile={profile} onUpdateProfile={onUpdateProfile} />
        </div>
      </div>
    )
  }

  if (currentView === "store") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("menu")}
              className="bg-white/90 text-purple-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-purple-300"
            >
              <span className="no-uppercase">🐾</span> MENÚ MASCOTAS
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-pink-300">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                <span className="font-bold text-pink-600">{profile.stars}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-600">{profile.coins}</span>
              </div>
            </div>
          </div>
          <EnhancedStore
            profile={profile}
            onPurchaseAvatar={handlePurchaseAvatar}
            onSelectAvatar={handleSelectAvatar}
            onPurchasePet={handlePurchasePet}
            onPurchaseItem={handlePurchaseItem}
          />
        </div>
      </div>
    )
  }

  if (currentView === "coin-games") {
    const coinGames = [
      {
        id: "memory",
        name: "MEMORIA",
        description: "¡ENCUENTRA PAREJAS DE BEBÉS LLORONES!",
        icon: "🧠",
        color: "bg-gradient-to-br from-blue-400 to-purple-500",
        reward: "10 MONEDAS/NIVEL",
      },
      {
        id: "goose",
        name: "JUEGO DE LA OCA",
        description: "¡TABLERO MÁGICO CON BEBÉS LLORONES!",
        icon: "🪿",
        color: "bg-gradient-to-br from-green-400 to-teal-500",
        reward: "15 MONEDAS/PARTIDA",
      },
      {
        id: "shapes",
        name: "ENCAJAR FORMAS",
        description: "¡ARRASTRA FORMAS A SUS SOMBRAS!",
        icon: "🔍",
        color: "bg-gradient-to-br from-orange-400 to-red-500",
        reward: "8 MONEDAS/FORMA",
      },
      {
        id: "penalty",
        name: "PATEAR PENALES",
        description: "¡MARCA GOLES CONTRA EL ARQUERO!",
        icon: "⚽",
        color: "bg-gradient-to-br from-yellow-400 to-orange-500",
        reward: "10-15 MONEDAS/GOL",
      },
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("menu")}
              className="bg-white/90 text-purple-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-purple-300"
            >
              <span className="no-uppercase">🐾</span> MENÚ MASCOTAS
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{profile.coins}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-2">
              <span className="no-uppercase">🎮</span> JUEGOS PARA GANAR MONEDAS
            </h2>
            <p className="text-xl text-pink-600">¡JUEGA Y GANA MONEDAS PARA CUIDAR A TUS MASCOTAS!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coinGames.map((game) => (
              <Card
                key={game.id}
                className={`${game.color} border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer`}
                onClick={() => setCurrentView(game.id as any)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                    {game.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{game.name}</h3>
                  <p className="text-lg text-white/90 mb-4 drop-shadow">{game.description}</p>
                  <Badge className="bg-white/20 text-white border border-white/30 mb-4 text-sm">{game.reward}</Badge>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-lg py-3 px-6 w-full">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    ¡JUGAR AHORA!
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="bg-white/80 rounded-xl p-6 border-2 border-yellow-300">
              <h3 className="text-xl font-bold text-yellow-600 mb-2">
                <span className="no-uppercase">💰</span> ¿PARA QUÉ SIRVEN LAS MONEDAS?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    🍼
                  </span>
                  <span className="font-semibold">COMIDA</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    🧼
                  </span>
                  <span className="font-semibold">HIGIENE</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    🧸
                  </span>
                  <span className="font-semibold">JUGUETES</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    💊
                  </span>
                  <span className="font-semibold">MEDICINA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "memory") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("coin-games")}
              className="bg-white/90 text-blue-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-blue-300"
            >
              <span className="no-uppercase">🎮</span> JUEGOS MONEDAS
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{profile.coins}</span>
            </div>
          </div>
          <MemoryGame language={profile.language} onReward={onAddCoins} />
        </div>
      </div>
    )
  }

  if (currentView === "goose") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("coin-games")}
              className="bg-white/90 text-green-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-green-300"
            >
              <span className="no-uppercase">🎮</span> JUEGOS MONEDAS
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{profile.coins}</span>
            </div>
          </div>
          <GooseGame language={profile.language} onReward={onAddCoins} />
        </div>
      </div>
    )
  }

  if (currentView === "shapes") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("coin-games")}
              className="bg-white/90 text-orange-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-orange-300"
            >
              <span className="no-uppercase">🎮</span> JUEGOS MONEDAS
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{profile.coins}</span>
            </div>
          </div>
          <ShapeMatchingGame language={profile.language} onReward={onAddCoins} />
        </div>
      </div>
    )
  }

  if (currentView === "penalty") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setCurrentView("coin-games")}
              className="bg-white/90 text-yellow-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-yellow-300"
            >
              <span className="no-uppercase">🎮</span> JUEGOS MONEDAS
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{profile.coins}</span>
            </div>
          </div>
          <PenaltyKickGame language={profile.language} onReward={onAddCoins} />
        </div>
      </div>
    )
  }

  // MENÚ PRINCIPAL DE MASCOTAS
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBackToMain}
            className="bg-white/90 text-blue-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-blue-300"
          >
            <Home className="w-5 h-5 mr-2" />
            MENÚ PRINCIPAL
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-pink-300">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="font-bold text-pink-600">{profile.stars}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600">{profile.coins}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
            🐾
          </div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">MUNDO DE MASCOTAS VIRTUALES</h1>
          <p className="text-xl text-pink-600 mb-4">¡ADOPTA, CUIDA Y JUEGA CON TUS BEBÉS LLORONES!</p>
          <div className="bg-white/80 rounded-xl p-4 border-2 border-purple-300">
            <p className="text-lg font-semibold text-purple-600">
              MASCOTAS ADOPTADAS: {Object.keys(profile.virtualPets).length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className="bg-gradient-to-br from-pink-400 to-purple-500 border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setCurrentView("care")}
          >
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                👶
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">CUIDAR MASCOTAS</h2>
              <p className="text-xl text-white/90 mb-6 drop-shadow">¡ALIMENTA, JUEGA Y CUIDA A TUS BEBÉS!</p>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-lg py-3 px-8">
                <Baby className="w-6 h-6 mr-2" />
                ¡CUIDAR AHORA!
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-blue-400 to-teal-500 border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setCurrentView("store")}
          >
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                🛍️
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">TIENDA COMPLETA</h2>
              <p className="text-xl text-white/90 mb-6 drop-shadow">¡ADOPTA MASCOTAS Y COMPRA CUIDADOS!</p>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-lg py-3 px-8">
                <ShoppingCart className="w-6 h-6 mr-2" />
                ¡IR DE COMPRAS!
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card
          className="bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => setCurrentView("coin-games")}
        >
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              🎮
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">JUEGOS PARA GANAR MONEDAS</h2>
            <p className="text-xl text-white/90 mb-6 drop-shadow">¡4 MINIJUEGOS DIVERTIDOS PARA GANAR MONEDAS!</p>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-3xl mb-1 no-uppercase" data-emoji="true">
                  🧠
                </div>
                <p className="text-white text-sm font-semibold">MEMORIA</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-3xl mb-1 no-uppercase" data-emoji="true">
                  🪿
                </div>
                <p className="text-white text-sm font-semibold">OCA</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-3xl mb-1 no-uppercase" data-emoji="true">
                  🔍
                </div>
                <p className="text-white text-sm font-semibold">FORMAS</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-3xl mb-1 no-uppercase" data-emoji="true">
                  ⚽
                </div>
                <p className="text-white text-sm font-semibold">PENALES</p>
              </div>
            </div>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-lg py-3 px-8">
              <Gamepad2 className="w-6 h-6 mr-2" />
              ¡JUGAR Y GANAR!
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <div className="animate-bounce text-4xl mb-4 no-uppercase" data-emoji="true">
            💕
          </div>
          <p className="text-pink-600 font-bold text-xl">¡CUIDA A TUS BEBÉS LLORONES CON AMOR!</p>
        </div>
      </div>
    </div>
  )
}
