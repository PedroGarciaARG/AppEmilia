"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Play, Trophy, Heart, ShoppingCart } from "lucide-react"
import LetterGame from "@/components/letter-game"
import SyllableGame from "@/components/syllable-game"
import WordGame from "@/components/word-game"
import StoryTime from "@/components/story-time"
import SongTime from "@/components/song-time"
import FarmLettersGame from "@/components/farm-letters-game"
import SyllableTrainGame from "@/components/syllable-train-game"
import SoundForestGame from "@/components/sound-forest-game"
import StoryCreatorGame from "@/components/story-creator-game"
import SettingsPanel from "@/components/settings-panel"
import RewardsPanel from "@/components/rewards-panel"
import AvatarStore from "@/components/avatar-store"
import LevelSystem from "@/components/level-system"
import Image from "next/image"
import OfflineIndicator from "@/components/offline-indicator"

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  level: number
  ownedAvatars: string[]
  gameLevels: {
    letters: number
    syllables: number
    words: number
    stories: number
    songs: number
    farmLetters: number
    syllableTrain: number
    soundForest: number
    storyCreator: number
  }
}

export default function KidsLearningApp() {
  const [currentView, setCurrentView] = useState<
    | "home"
    | "letters"
    | "syllables"
    | "words"
    | "stories"
    | "songs"
    | "farmLetters"
    | "syllableTrain"
    | "soundForest"
    | "storyCreator"
    | "settings"
    | "rewards"
    | "store"
  >("home")
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "MI BEBÉ LLORÓN",
    age: 6,
    language: "both",
    avatar: "/images/bebe-abeja.png",
    stars: 0,
    level: 1,
    ownedAvatars: ["bebe-abeja", "bebe-rana", "bebe-conejo", "bebe-astronauta"],
    gameLevels: {
      letters: 1,
      syllables: 1,
      words: 1,
      stories: 1,
      songs: 1,
      farmLetters: 1,
      syllableTrain: 1,
      soundForest: 1,
      storyCreator: 1,
    },
  })

  useEffect(() => {
    const saved = localStorage.getItem("kidsProfile")
    if (saved) {
      const parsedProfile = JSON.parse(saved)
      // Asegurar que tiene las nuevas propiedades
      setUserProfile({
        ...parsedProfile,
        ownedAvatars: parsedProfile.ownedAvatars || ["bebe-abeja", "bebe-rana", "bebe-conejo", "bebe-astronauta"],
        gameLevels: parsedProfile.gameLevels || {
          letters: 1,
          syllables: 1,
          words: 1,
          stories: 1,
          songs: 1,
          farmLetters: 1,
          syllableTrain: 1,
          soundForest: 1,
          storyCreator: 1,
        },
      })
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

  const handleLevelComplete = (gameType: keyof UserProfile["gameLevels"], newLevel: number, reward: number) => {
    const newProfile = {
      ...userProfile,
      gameLevels: {
        ...userProfile.gameLevels,
        [gameType]: newLevel,
      },
      stars: userProfile.stars + reward,
    }
    if (newProfile.stars >= newProfile.level * 10) {
      newProfile.level += 1
    }
    saveProfile(newProfile)
  }

  const handleAvatarPurchase = (avatarId: string, cost: number) => {
    if (userProfile.stars >= cost && !userProfile.ownedAvatars.includes(avatarId)) {
      const newProfile = {
        ...userProfile,
        stars: userProfile.stars - cost,
        ownedAvatars: [...userProfile.ownedAvatars, avatarId],
      }
      saveProfile(newProfile)

      // Mostrar mensaje de compra exitosa
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡BUAAA DE FELICIDAD! ¡NUEVO BEBÉ LLORÓN DESBLOQUEADO!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handleAvatarSelect = (avatarId: string) => {
    if (userProfile.ownedAvatars.includes(avatarId)) {
      // Buscar la imagen del avatar
      const avatarImage = avatarId.includes("bebe-")
        ? avatarId.startsWith("bebe-abeja") ||
          avatarId.startsWith("bebe-rana") ||
          avatarId.startsWith("bebe-conejo") ||
          avatarId.startsWith("bebe-astronauta")
          ? `/images/${avatarId}.png`
          : `/images/avatars/${avatarId}.png`
        : `/images/avatars/${avatarId}.png`

      const newProfile = {
        ...userProfile,
        avatar: avatarImage,
      }
      saveProfile(newProfile)
    }
  }

  const characters = [
    {
      name: "BEBÉ ABEJA",
      image: "/images/bebe-abeja.png",
      color: "bg-gradient-to-br from-yellow-300 to-orange-400",
      activity: "letters",
      description: "¡APRENDE LAS LETRAS CON BEBÉ ABEJA!",
      level: userProfile.gameLevels.letters,
      emoji: "🐝",
    },
    {
      name: "BEBÉ ELEFANTE",
      image: "/images/bebe-elefante.png",
      color: "bg-gradient-to-br from-gray-400 to-blue-500",
      activity: "syllables",
      description: "¡UNE SÍLABAS CON BEBÉ ELEFANTE!",
      level: userProfile.gameLevels.syllables,
      emoji: "🐘",
    },
    {
      name: "BEBÉ RANA",
      image: "/images/bebe-rana.png",
      color: "bg-gradient-to-br from-green-300 to-green-500",
      activity: "words",
      description: "BEBÉ RANA TE AYUDA A FORMAR PALABRAS",
      level: userProfile.gameLevels.words,
      emoji: "🐸",
    },
    {
      name: "BEBÉ CONEJO",
      image: "/images/bebe-conejo.png",
      color: "bg-gradient-to-br from-pink-300 to-pink-500",
      activity: "stories",
      description: "ESCUCHA CUENTOS MÁGICOS CON BEBÉ CONEJO",
      level: userProfile.gameLevels.stories,
      emoji: "🐰",
    },
    {
      name: "BEBÉ ASTRONAUTA",
      image: "/images/bebe-astronauta.png",
      color: "bg-gradient-to-br from-blue-400 to-purple-500",
      activity: "songs",
      description: "¡CANTA CANCIONES ESPACIALES!",
      level: userProfile.gameLevels.songs,
      emoji: "🚀",
    },
    {
      name: "BEBÉ RATÓN",
      image: "/images/bebe-raton.png",
      color: "bg-gradient-to-br from-orange-300 to-yellow-400",
      activity: "farmLetters",
      description: "¡GRANJA DE LETRAS CON BEBÉ RATÓN!",
      level: userProfile.gameLevels.farmLetters,
      emoji: "🐭",
    },
    {
      name: "BEBÉ TIBURÓN",
      image: "/images/bebe-tiburon.png",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500",
      activity: "syllableTrain",
      description: "¡CIUDAD DE SÍLABAS CON BEBÉ TIBURÓN!",
      level: userProfile.gameLevels.syllableTrain,
      emoji: "🦈",
    },
    {
      name: "BEBÉ DINOSAURIO",
      image: "/images/bebe-dinosaurio.png",
      color: "bg-gradient-to-br from-green-400 to-emerald-500",
      activity: "soundForest",
      description: "¡BOSQUE DE SONIDOS CON BEBÉ DINOSAURIO!",
      level: userProfile.gameLevels.soundForest,
      emoji: "🦕",
    },
    {
      name: "BEBÉ POLLO",
      image: "/images/bebe-pollo.png",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      activity: "storyCreator",
      description: "¡CASA DE CUENTOS CON BEBÉ POLLO!",
      level: userProfile.gameLevels.storyCreator,
      emoji: "🐥",
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
              <span className="no-uppercase">🏠</span> VOLVER A CASA
            </Button>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="font-bold text-pink-600">{userProfile.stars}</span>
            </div>
          </div>

          {currentView === "letters" && (
            <>
              <LevelSystem
                gameType="letters"
                currentLevel={userProfile.gameLevels.letters}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("letters", newLevel, reward)}
              />
              <LetterGame language={userProfile.language} onReward={addStars} />
            </>
          )}
          {currentView === "syllables" && (
            <>
              <LevelSystem
                gameType="syllables"
                currentLevel={userProfile.gameLevels.syllables}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("syllables", newLevel, reward)}
              />
              <SyllableGame
                language={userProfile.language}
                level={userProfile.gameLevels.syllables}
                onReward={addStars}
              />
            </>
          )}
          {currentView === "words" && (
            <>
              <LevelSystem
                gameType="words"
                currentLevel={userProfile.gameLevels.words}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("words", newLevel, reward)}
              />
              <WordGame language={userProfile.language} onReward={addStars} />
            </>
          )}
          {currentView === "stories" && (
            <>
              <LevelSystem
                gameType="stories"
                currentLevel={userProfile.gameLevels.stories}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("stories", newLevel, reward)}
              />
              <StoryTime language={userProfile.language} onReward={addStars} />
            </>
          )}
          {currentView === "songs" && (
            <>
              <LevelSystem
                gameType="songs"
                currentLevel={userProfile.gameLevels.songs}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("songs", newLevel, reward)}
              />
              <SongTime language={userProfile.language} onReward={addStars} />
            </>
          )}
          {currentView === "farmLetters" && (
            <>
              <LevelSystem
                gameType="farmLetters"
                currentLevel={userProfile.gameLevels.farmLetters}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("farmLetters", newLevel, reward)}
              />
              <FarmLettersGame
                language={userProfile.language}
                level={userProfile.gameLevels.farmLetters}
                onReward={addStars}
              />
            </>
          )}
          {currentView === "syllableTrain" && (
            <>
              <LevelSystem
                gameType="syllableTrain"
                currentLevel={userProfile.gameLevels.syllableTrain}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("syllableTrain", newLevel, reward)}
              />
              <SyllableTrainGame
                language={userProfile.language}
                level={userProfile.gameLevels.syllableTrain}
                onReward={addStars}
              />
            </>
          )}
          {currentView === "soundForest" && (
            <>
              <LevelSystem
                gameType="soundForest"
                currentLevel={userProfile.gameLevels.soundForest}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("soundForest", newLevel, reward)}
              />
              <SoundForestGame
                language={userProfile.language}
                level={userProfile.gameLevels.soundForest}
                onReward={addStars}
              />
            </>
          )}
          {currentView === "storyCreator" && (
            <>
              <LevelSystem
                gameType="storyCreator"
                currentLevel={userProfile.gameLevels.storyCreator}
                onLevelComplete={(newLevel, reward) => handleLevelComplete("storyCreator", newLevel, reward)}
              />
              <StoryCreatorGame
                language={userProfile.language}
                level={userProfile.gameLevels.storyCreator}
                onReward={addStars}
              />
            </>
          )}
          {currentView === "settings" && <SettingsPanel profile={userProfile} onSave={saveProfile} />}
          {currentView === "rewards" && <RewardsPanel profile={userProfile} />}
          {currentView === "store" && (
            <AvatarStore profile={userProfile} onPurchase={handleAvatarPurchase} onSelectAvatar={handleAvatarSelect} />
          )}
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
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src={userProfile.avatar || "/placeholder.svg"}
              alt="MI AVATAR"
              fill
              className="object-contain animate-bounce rounded-full border-4 border-pink-300"
            />
          </div>
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            <span className="no-uppercase">💕</span> ¡HOLA {userProfile.name}! <span className="no-uppercase">💕</span>
          </h1>
          <p className="text-xl text-purple-600 mb-4">¡BIENVENIDO AL MUNDO DE LOS BEBÉS LLORONES!</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <Badge className="bg-pink-400 text-white text-lg px-4 py-2 border-2 border-pink-500">
              <Heart className="w-4 h-4 mr-1 fill-white" />
              {userProfile.stars} CORAZONES
            </Badge>
            <Badge className="bg-purple-400 text-white text-lg px-4 py-2 border-2 border-purple-500">
              <Trophy className="w-4 h-4 mr-1" />
              NIVEL {userProfile.level}
            </Badge>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {characters.map((character, index) => (
            <Card
              key={index}
              className={`${character.color} border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
              onClick={() => setCurrentView(character.activity as any)}
            >
              <CardContent className="p-4 text-center relative">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src={character.image || "/placeholder.svg"}
                    alt={character.name}
                    fill
                    className="object-contain animate-bounce"
                  />
                </div>
                <h3 className="text-white font-bold text-sm mb-2 drop-shadow-lg">{character.name}</h3>
                <p className="text-white/90 text-xs mb-2 drop-shadow">{character.description}</p>
                <Badge className="bg-white/20 text-white border border-white/30 mb-2 text-xs">
                  NIVEL {character.level}
                </Badge>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-xs py-1 px-3">
                  <Play className="w-3 h-3 mr-1" />
                  ¡JUGAR!
                </Button>
                <div className="absolute top-1 right-1">
                  <div className="animate-pulse text-lg no-uppercase" data-emoji="true">
                    💕
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => setCurrentView("store")}
            className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-6 rounded-2xl shadow-lg border-2 border-white"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            TIENDA
          </Button>
          <Button
            onClick={() => setCurrentView("rewards")}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-6 rounded-2xl shadow-lg border-2 border-white"
          >
            <Trophy className="w-6 h-6 mr-2" />
            TESOROS
          </Button>
          <Button
            onClick={() => setCurrentView("settings")}
            className="bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-6 rounded-2xl shadow-lg border-2 border-white"
          >
            <Settings className="w-6 h-6 mr-2" />
            PERFIL
          </Button>
          <Button
            onClick={() => {
              const totalLevel = Object.values(userProfile.gameLevels).reduce((a, b) => a + b, 0)
              if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(
                  `¡TIENES ${userProfile.stars} CORAZONES Y ESTÁS EN EL NIVEL ${userProfile.level}! ¡AHORA HAY 9 JUEGOS DIFERENTES PARA APRENDER!`,
                )
                utterance.lang = "es-ES"
                utterance.rate = 0.8
                utterance.pitch = 1.3
                speechSynthesis.speak(utterance)
              }
            }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-6 rounded-2xl shadow-lg border-2 border-white"
          >
            <span className="no-uppercase">🔊</span> PROGRESO
          </Button>
        </div>

        {/* Fun Animation */}
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-2 no-uppercase" data-emoji="true">
            🍼
          </div>
          <p className="text-pink-600 font-bold text-xl">¡ELIGE TU BEBÉ FAVORITO PARA EMPEZAR!</p>
          <p className="text-purple-600 font-semibold text-lg mt-2">¡AHORA CON 9 JUEGOS Y 450 NIVELES!</p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="animate-pulse text-2xl no-uppercase" data-emoji="true">
              💕
            </span>
            <span className="animate-pulse text-2xl no-uppercase" data-emoji="true" style={{ animationDelay: "0.5s" }}>
              💕
            </span>
            <span className="animate-pulse text-2xl no-uppercase" data-emoji="true" style={{ animationDelay: "1s" }}>
              💕
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
