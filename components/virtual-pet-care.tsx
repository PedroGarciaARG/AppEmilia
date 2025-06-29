"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Utensils, Droplets, Moon, Gamepad2, Baby, AlertTriangle, Clock } from "lucide-react"
import Image from "next/image"

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
  age: number // en días
}

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  coins: number
  level: number
  ownedPets: string[]
  ownedItems: { [key: string]: number }
  virtualPets: { [key: string]: VirtualPet }
}

interface VirtualPetCareProps {
  profile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
}

const moodEmojis = {
  FELIZ: "😊",
  NORMAL: "😐",
  TRISTE: "😢",
  ENFERMO: "🤒",
}

const moodColors = {
  FELIZ: "bg-green-400",
  NORMAL: "bg-yellow-400",
  TRISTE: "bg-orange-400",
  ENFERMO: "bg-red-400",
}

export default function VirtualPetCare({ profile, onUpdateProfile }: VirtualPetCareProps) {
  const [selectedPet, setSelectedPet] = useState<string>("")
  const [showAnimation, setShowAnimation] = useState<string>("")

  const pets = Object.values(profile.virtualPets || {})
  const currentPet = selectedPet ? profile.virtualPets[selectedPet] : pets[0]

  useEffect(() => {
    if (!selectedPet && pets.length > 0) {
      setSelectedPet(pets[0].id)
    }
  }, [pets, selectedPet])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPet) {
        degradeNeeds()
      }
    }, 60000) // 1 minuto

    return () => clearInterval(interval)
  }, [currentPet])

  const degradeNeeds = () => {
    if (!currentPet) return

    const now = Date.now()
    const timeDiff = now - currentPet.lastCared
    const minutesPassed = Math.floor(timeDiff / 60000)

    if (minutesPassed > 0) {
      const newNeeds = { ...currentPet.needs }

      newNeeds.hunger = Math.max(0, newNeeds.hunger - minutesPassed * 2)
      newNeeds.hygiene = Math.max(0, newNeeds.hygiene - minutesPassed * 1.5)
      newNeeds.sleep = Math.max(0, newNeeds.sleep - minutesPassed * 1)
      newNeeds.play = Math.max(0, newNeeds.play - minutesPassed * 1.5)
      newNeeds.affection = Math.max(0, newNeeds.affection - minutesPassed * 1)
      newNeeds.bathroom = Math.min(100, newNeeds.bathroom + minutesPassed * 3)

      const updatedPet = {
        ...currentPet,
        needs: newNeeds,
        lastCared: now,
        mood: calculateMood(newNeeds),
      }

      const newProfile = {
        ...profile,
        virtualPets: {
          ...profile.virtualPets,
          [currentPet.id]: updatedPet,
        },
      }

      onUpdateProfile(newProfile)
    }
  }

  const calculateMood = (needs: PetNeeds): "FELIZ" | "NORMAL" | "TRISTE" | "ENFERMO" => {
    const average = (needs.hunger + needs.hygiene + needs.sleep + needs.play + needs.affection) / 5
    const bathroomUrgency = needs.bathroom

    if (bathroomUrgency > 80 || average < 20) return "ENFERMO"
    if (average > 80) return "FELIZ"
    if (average > 50) return "NORMAL"
    return "TRISTE"
  }

  const useItem = (itemId: string, needType: keyof PetNeeds, amount: number) => {
    if (!currentPet || !profile.ownedItems[itemId] || profile.ownedItems[itemId] <= 0) return

    const newNeeds = { ...currentPet.needs }

    if (needType === "bathroom") {
      newNeeds[needType] = Math.max(0, newNeeds[needType] - amount)
    } else {
      newNeeds[needType] = Math.min(100, newNeeds[needType] + amount)
    }

    const updatedPet = {
      ...currentPet,
      needs: newNeeds,
      mood: calculateMood(newNeeds),
      experience: currentPet.experience + 10,
      lastCared: Date.now(),
    }

    const newProfile = {
      ...profile,
      ownedItems: {
        ...profile.ownedItems,
        [itemId]: profile.ownedItems[itemId] - 1,
      },
      virtualPets: {
        ...profile.virtualPets,
        [currentPet.id]: updatedPet,
      },
    }

    onUpdateProfile(newProfile)

    setShowAnimation(needType)
    setTimeout(() => setShowAnimation(""), 2000)

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("¡Buaaa de felicidad!")
      utterance.lang = "es-ES"
      utterance.rate = 0.8
      utterance.pitch = 1.4
      speechSynthesis.speak(utterance)
    }
  }

  const playWithPet = () => {
    if (!currentPet) return

    const newNeeds = { ...currentPet.needs }
    newNeeds.play = Math.min(100, newNeeds.play + 30)
    newNeeds.affection = Math.min(100, newNeeds.affection + 20)

    const updatedPet = {
      ...currentPet,
      needs: newNeeds,
      mood: calculateMood(newNeeds),
      experience: currentPet.experience + 15,
      lastCared: Date.now(),
    }

    const newProfile = {
      ...profile,
      virtualPets: {
        ...profile.virtualPets,
        [currentPet.id]: updatedPet,
      },
    }

    onUpdateProfile(newProfile)

    setShowAnimation("play")
    setTimeout(() => setShowAnimation(""), 2000)
  }

  if (pets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-300">
          <CardContent className="p-8">
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              🐾
            </div>
            <h2 className="text-2xl font-bold text-purple-600 mb-4">¡NO TIENES MASCOTAS VIRTUALES!</h2>
            <p className="text-lg text-gray-600 mb-6">VE A LA TIENDA Y ADOPTA UN BEBÉ LLORÓN VIRTUAL PARA CUIDAR</p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl">
              IR A LA TIENDA
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentPet) return <div>Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          <span className="no-uppercase">🐾</span> CUIDADO DE MASCOTAS
        </h2>
        <p className="text-lg text-pink-600">¡CUIDA A TUS BEBÉS LLORONES VIRTUALES!</p>
      </div>

      {pets.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {pets.map((pet) => (
            <Button
              key={pet.id}
              onClick={() => setSelectedPet(pet.id)}
              className={`${selectedPet === pet.id ? "bg-purple-500 text-white" : "bg-white/80 text-gray-700 hover:bg-purple-100"} font-bold px-4 py-2 rounded-full border-2 border-purple-300`}
            >
              {pet.name}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-pink-100 to-purple-100 border-4 border-pink-300">
          <CardHeader className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={currentPet.image || "/placeholder.svg"}
                alt={currentPet.name}
                fill
                className={`object-contain ${showAnimation ? "animate-bounce" : ""}`}
              />
              {showAnimation && (
                <div className="absolute -top-4 -right-4 text-2xl animate-ping no-uppercase" data-emoji="true">
                  💕
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-purple-600">{currentPet.name}</CardTitle>
            <div className="flex justify-center items-center gap-2">
              <Badge className={`${moodColors[currentPet.mood]} text-white`}>
                <span className="no-uppercase mr-1" data-emoji="true">
                  {moodEmojis[currentPet.mood]}
                </span>
                {currentPet.mood}
              </Badge>
              <Badge className="bg-blue-400 text-white">NIVEL {currentPet.level}</Badge>
              <Badge className="bg-green-400 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {currentPet.age} DÍAS
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-green-100 border-4 border-blue-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600 text-center">NECESIDADES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-orange-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">HAMBRE</span>
                    <span className="text-sm">{currentPet.needs.hunger}%</span>
                  </div>
                  <Progress value={currentPet.needs.hunger} className="h-3" />
                </div>
                {currentPet.needs.hunger < 30 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">HIGIENE</span>
                    <span className="text-sm">{currentPet.needs.hygiene}%</span>
                  </div>
                  <Progress value={currentPet.needs.hygiene} className="h-3" />
                </div>
                {currentPet.needs.hygiene < 30 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">SUEÑO</span>
                    <span className="text-sm">{currentPet.needs.sleep}%</span>
                  </div>
                  <Progress value={currentPet.needs.sleep} className="h-3" />
                </div>
                {currentPet.needs.sleep < 30 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">JUEGO</span>
                    <span className="text-sm">{currentPet.needs.play}%</span>
                  </div>
                  <Progress value={currentPet.needs.play} className="h-3" />
                </div>
                {currentPet.needs.play < 30 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">AFECTO</span>
                    <span className="text-sm">{currentPet.needs.affection}%</span>
                  </div>
                  <Progress value={currentPet.needs.affection} className="h-3" />
                </div>
                {currentPet.needs.affection < 30 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-yellow-500" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">BAÑO</span>
                    <span className="text-sm">{currentPet.needs.bathroom}%</span>
                  </div>
                  <Progress value={currentPet.needs.bathroom} className="h-3" />
                </div>
                {currentPet.needs.bathroom > 70 && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <Button
          onClick={() => useItem("milk-basic", "hunger", 20)}
          disabled={!profile.ownedItems["milk-basic"] || profile.ownedItems["milk-basic"] <= 0}
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 rounded-xl"
        >
          <Utensils className="w-5 h-5 mr-2" />
          ALIMENTAR
          <br />
          <span className="text-xs">({profile.ownedItems["milk-basic"] || 0})</span>
        </Button>

        <Button
          onClick={() => useItem("diaper-basic", "hygiene", 30)}
          disabled={!profile.ownedItems["diaper-basic"] || profile.ownedItems["diaper-basic"] <= 0}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 rounded-xl"
        >
          <Droplets className="w-5 h-5 mr-2" />
          LIMPIAR
          <br />
          <span className="text-xs">({profile.ownedItems["diaper-basic"] || 0})</span>
        </Button>

        <Button
          onClick={() => useItem("music-box", "sleep", 60)}
          disabled={!profile.ownedItems["music-box"] || profile.ownedItems["music-box"] <= 0}
          className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-4 rounded-xl"
        >
          <Moon className="w-5 h-5 mr-2" />
          DORMIR
          <br />
          <span className="text-xs">({profile.ownedItems["music-box"] || 0})</span>
        </Button>

        <Button onClick={playWithPet} className="bg-green-400 hover:bg-green-500 text-white font-bold py-4 rounded-xl">
          <Gamepad2 className="w-5 h-5 mr-2" />
          JUGAR
          <br />
          <span className="text-xs">(GRATIS)</span>
        </Button>
      </div>

      <Card className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-yellow-700">EXPERIENCIA</span>
            <span className="text-sm text-yellow-600">{currentPet.experience}/100</span>
          </div>
          <Progress value={currentPet.experience} className="h-4" />
          <p className="text-xs text-yellow-600 mt-2 text-center">
            ¡CUIDA BIEN A TU BEBÉ PARA GANAR EXPERIENCIA Y SUBIR DE NIVEL!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
