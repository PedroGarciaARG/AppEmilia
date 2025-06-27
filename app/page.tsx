"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Play, Trophy, Heart } from "lucide-react"
import LetterGame from "@/components/letter-game"
import WordGame from "@/components/word-game"
import StoryTime from "@/components/story-time"
import SongTime from "@/components/song-time"
import SettingsPanel from "@/components/settings-panel"
import RewardsPanel from "@/components/rewards-panel"
import Image from "next/image"
import OfflineIndicator from "@/components/offline-indicator"

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  level: number
}

export default function KidsLearningApp() {
  const [currentView, setCurrentView] = useState<
    "home" | "letters" | "words" | "stories" | "songs" | "settings" | "rewards"
  >("home")
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Mi Bebé Llorón",
    age: 6,
    language: "both",
    avatar: "💕",
    stars: 0,
    level: 1,
  })

  useEffect(() => {
    const saved = localStorage.getItem("kidsProfile")
    if (saved) {
      setUserProfile(JSON.parse(saved))
    }
  }, [])

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile)
    localStorage.setItem("kidsProfile", JSON.stringify(profile))
  }

  const addStars = (amount: number) => {
    const newProfile = { ...userProfile, stars: userProfile.stars + amount }
    if (newProfile.stars >= newProfile.level * 10) {
      newProfile.level += 1
    }
    saveProfile(newProfile)
  }

  const characters = [
    {
      name: "Bebé Abeja",
      image: "/images/bebe-abeja.png",
      color: "bg-gradient-to-br from-yellow-300 to-orange-400",
      activity: "letters",
      description: "¡Aprende las letras con Bebé Abeja! 🐝",
      cry: "¡Buaaa! ¡Las letras son divertidas!",
    },
    {
      name: "Bebé Rana",
      image: "/images/bebe-rana.png",
      color: "bg-gradient-to-br from-green-300 to-green-500",
      activity: "words",
      description: "Bebé Rana te ayuda a formar palabras 🐸",
      cry: "¡Croac croac! ¡Vamos a jugar!",
    },
    {
      name: "Bebé Conejo",
      image: "/images/bebe-conejo.png",
      color: "bg-gradient-to-br from-pink-300 to-pink-500",
      activity: "stories",
      description: "Escucha cuentos mágicos con Bebé Conejo 🐰",
      cry: "¡Snif snif! ¡Me encantan los cuentos!",
    },
    {
      name: "Bebé Astronauta",
      image: "/images/bebe-astronauta.png",
      color: "bg-gradient-to-br from-blue-400 to-purple-500",
      activity: "songs",
      description: "¡Canta canciones espaciales! 🚀",
      cry: "¡Uaaa! ¡Vamos al espacio musical!",
    },
  ]

  if (currentView !== "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <OfflineIndicator />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => setCurrentView("home")}
              className="bg-white/90 text-pink-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-pink-300"
            >
              🏠 Volver a Casa
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="font-bold text-pink-600">{userProfile.stars}</span>
            </div>
          </div>

          {currentView === "letters" && <LetterGame language={userProfile.language} onReward={addStars} />}
          {currentView === "words" && <WordGame language={userProfile.language} onReward={addStars} />}
          {currentView === "stories" && <StoryTime language={userProfile.language} onReward={addStars} />}
          {currentView === "songs" && <SongTime language={userProfile.language} onReward={addStars} />}
          {currentView === "settings" && <SettingsPanel profile={userProfile} onSave={saveProfile} />}
          {currentView === "rewards" && <RewardsPanel profile={userProfile} />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <OfflineIndicator />
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">💕 ¡Hola {userProfile.name}! 💕</h1>
          <p className="text-xl text-purple-600 mb-4">¡Bienvenido al mundo de los Bebés Llorones!</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <Badge className="bg-pink-400 text-white text-lg px-4 py-2 border-2 border-pink-500">
              <Heart className="w-4 h-4 mr-1 fill-white" />
              {userProfile.stars} corazones
            </Badge>
            <Badge className="bg-purple-400 text-white text-lg px-4 py-2 border-2 border-purple-500">
              <Trophy className="w-4 h-4 mr-1" />
              Nivel {userProfile.level}
            </Badge>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {characters.map((character, index) => (
            <Card
              key={index}
              className={`${character.color} border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
              onClick={() => setCurrentView(character.activity as any)}
            >
              <CardContent className="p-6 text-center relative">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={character.image || "/placeholder.svg"}
                    alt={character.name}
                    fill
                    className="object-contain animate-bounce"
                  />
                </div>
                <h3 className="text-white font-bold text-lg mb-2 drop-shadow-lg">{character.name}</h3>
                <p className="text-white/90 text-sm mb-3 drop-shadow">{character.description}</p>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold">
                  <Play className="w-4 h-4 mr-2" />
                  ¡Jugar!
                </Button>
                <div className="absolute top-2 right-2">
                  <div className="animate-pulse text-2xl">💕</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Babies Preview */}
        <div className="bg-white/80 rounded-3xl p-6 mb-8 border-4 border-pink-200">
          <h3 className="text-2xl font-bold text-pink-600 text-center mb-4">¡Más Bebés Llorones!</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              "/images/bebe-raton.png",
              "/images/bebe-elefante.png",
              "/images/bebe-dalmata.png",
              "/images/bebe-tiburon.png",
              "/images/bebe-dinosaurio.png",
              "/images/bebe-pollo.png",
            ].map((image, index) => (
              <div key={index} className="relative w-16 h-16 opacity-70 hover:opacity-100 transition-opacity">
                <Image src={image || "/placeholder.svg"} alt={`Bebé ${index}`} fill className="object-contain" />
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-2">¡Próximamente más aventuras!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => setCurrentView("rewards")}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-6 rounded-2xl shadow-lg border-2 border-white"
          >
            <Trophy className="w-6 h-6 mr-2" />
            Mis Tesoros
          </Button>
          <Button
            onClick={() => setCurrentView("settings")}
            className="bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-6 rounded-2xl shadow-lg border-2 border-white"
          >
            <Settings className="w-6 h-6 mr-2" />
            Mi Perfil
          </Button>
        </div>

        {/* Fun Animation */}
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-2">🍼</div>
          <p className="text-pink-600 font-bold text-xl">¡Elige tu bebé favorito para empezar!</p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="animate-pulse text-2xl">💕</span>
            <span className="animate-pulse text-2xl" style={{ animationDelay: "0.5s" }}>
              💕
            </span>
            <span className="animate-pulse text-2xl" style={{ animationDelay: "1s" }}>
              💕
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
