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
    farmLetters: number
    syllableTrain: number
    soundForest: number
    storyCreator: number
    stories: number
    songs: number
  }
}

export default function KidsLearningApp() {
  const [currentView, setCurrentView] = useState<
    | "home"
    | "letters"
    | "syllables"
    | "words"
    | "farmLetters"
    | "syllableTrain"
    | "soundForest"
    | "storyCreator"
    | "stories"
    | "songs"
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
      farmLetters: 1,
      syllableTrain: 1,
      soundForest: 1,
      storyCreator: 1,
      stories: 1,
      songs: 1,
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
          farmLetters: 1,
          syllableTrain: 1,
          soundForest: 1,
          storyCreator: 1,
          stories: 1,
          songs: 1,
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

  // PERSONAJES CON TAMAÑOS CONTROLADOS
  const characters = [
    {
      image: "/images/bebe-abeja.png",
      color: "bg-gradient-to-br from-yellow-300 to-orange-400",
      activity: "letters",
      description: "¡APRENDE LAS LETRAS!",
      level: userProfile.gameLevels.letters,
      order: 1,
    },
    {
      image: "/images/bebe-elefante.png",
      color: "bg-gradient-to-br from-gray-400 to-blue-500",
      activity: "syllables",
      description: "¡UNE SÍLABAS!",
      level: userProfile.gameLevels.syllables,
      order: 2,
    },
    {
      image: "/images/bebe-rana.png",
      color: "bg-gradient-to-br from-green-300 to-green-500",
      activity: "words",
      description: "¡FORMA PALABRAS!",
      level: userProfile.gameLevels.words,
      order: 3,
    },
    {
      image: "/images/bebe-raton.png",
      color: "bg-gradient-to-br from-orange-300 to-yellow-400",
      activity: "farmLetters",
      description: "¡GRANJA DE LETRAS!",
      level: userProfile.gameLevels.farmLetters,
      order: 4,
    },
    {
      image: "/images/bebe-tiburon.png",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500",
      activity: "syllableTrain",
      description: "¡CIUDAD DE SÍLABAS!",
      level: userProfile.gameLevels.syllableTrain,
      order: 5,
    },
    {
      image: "/images/bebe-dinosaurio.png",
      color: "bg-gradient-to-br from-green-400 to-emerald-500",
      activity: "soundForest",
      description: "¡BOSQUE DE SONIDOS!",
      level: userProfile.gameLevels.soundForest,
      order: 6,
    },
    {
      image: "/images/bebe-pollo.png",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      activity: "storyCreator",
      description: "¡CASA DE CUENTOS!",
      level: userProfile.gameLevels.storyCreator,
      order: 7,
    },
    {
      image: "/images/bebe-conejo.png",
      color: "bg-gradient-to-br from-pink-300 to-pink-500",
      activity: "stories",
      description: "¡CUENTOS NARRADOS!",
      level: userProfile.gameLevels.stories,
      order: 8,
    },
    {
      image: "/images/bebe-astronauta.png",
      color: "bg-gradient-to-br from-blue-400 to-purple-500",
      activity: "songs",
      description: "¡CANCIONES ESPACIALES!",
      level: userProfile.gameLevels.songs,
      order: 9,
    },
  ]

  // Ordenar personajes según el nuevo orden
  const orderedCharacters = characters.sort((a, b) => a.order - b.order)

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
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header - MÁS COMPACTO */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src={userProfile.avatar || "/images/bebe-abeja.png"}
              alt="MI AVATAR"
              fill
              className="object-contain animate-bounce rounded-full border-4 border-pink-300"
            />
          </div>
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            <span className="no-uppercase">💕</span> ¡HOLA {userProfile.name}! <span className="no-uppercase">💕</span>
          </h1>
          <p className="text-lg text-purple-600 mb-3">¡BIENVENIDO AL MUNDO DE LOS BEBÉS LLORONES!</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <Badge className="bg-pink-400 text-white text-base px-3 py-1 border-2 border-pink-500">
              <Heart className="w-4 h-4 mr-1 fill-white" />
              {userProfile.stars} CORAZONES
            </Badge>
            <Badge className="bg-purple-400 text-white text-base px-3 py-1 border-2 border-purple-500">
              <Trophy className="w-4 h-4 mr-1" />
              NIVEL {userProfile.level}
            </Badge>
          </div>
        </div>

        {/* Characters Grid - TAMAÑO CONTROLADO */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
          {orderedCharacters.map((character, index) => (
            <Card
              key={index}
              className={`${character.color} border-3 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden relative h-48`}
              onClick={() => setCurrentView(character.activity as any)}
            >
              <CardContent className="p-3 text-center relative h-full flex flex-col justify-between">
                {/* Número de orden */}
                <div className="absolute top-1 left-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{character.order}</span>
                </div>

                {/* Imagen del Bebé Llorón - TAMAÑO FIJO */}
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <Image
                    src={character.image || "/placeholder.svg"}
                    alt={`Bebé Llorón ${character.order}`}
                    fill
                    className="object-contain animate-bounce"
                  />
                </div>

                {/* Descripción - MÁS PEQUEÑA */}
                <p className="text-white font-bold text-xs mb-2 drop-shadow-lg leading-tight">
                  {character.description}
                </p>

                <div className="mt-auto">
                  <Badge className="bg-white/20 text-white border border-white/30 mb-2 text-xs">
                    NIVEL {character.level}
                  </Badge>

                  <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-xs py-1 px-3 w-full">
                    <Play className="w-3 h-3 mr-1" />
                    ¡JUGAR!
                  </Button>
                </div>

                <div className="absolute top-1 right-1">
                  <div className="animate-pulse text-sm no-uppercase" data-emoji="true">
                    💕
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions - MÁS COMPACTO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Button
            onClick={() => setCurrentView("store")}
            className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg border-2 border-white"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            TIENDA
          </Button>
          <Button
            onClick={() => setCurrentView("rewards")}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg border-2 border-white"
          >
            <Trophy className="w-5 h-5 mr-2" />
            TESOROS
          </Button>
          <Button
            onClick={() => setCurrentView("settings")}
            className="bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg border-2 border-white"
          >
            <Settings className="w-5 h-5 mr-2" />
            PERFIL
          </Button>
          <Button
            onClick={() => {
              const totalLevel = Object.values(userProfile.gameLevels).reduce((a, b) => a + b, 0)
              if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(
                  `¡TIENES ${userProfile.stars} CORAZONES Y ESTÁS EN EL NIVEL ${userProfile.level}! ¡AHORA HAY 9 JUEGOS DIFERENTES PARA APRENDER EN EL ORDEN PERFECTO!`,
                )
                utterance.lang = "es-ES"
                utterance.rate = 0.8
                utterance.pitch = 1.3
                speechSynthesis.speak(utterance)
              }
            }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg border-2 border-white"
          >
            <span className="no-uppercase">🔊</span> PROGRESO
          </Button>
        </div>

        {/* Fun Animation - MÁS COMPACTO */}
        <div className="text-center">
          <div className="animate-bounce text-4xl mb-2 no-uppercase" data-emoji="true">
            🍼
          </div>
          <p className="text-pink-600 font-bold text-lg">¡SIGUE EL ORDEN PERFECTO DE APRENDIZAJE!</p>
          <p className="text-purple-600 font-semibold text-base mt-1">¡9 JUEGOS ORGANIZADOS PARA MÁXIMO APRENDIZAJE!</p>

          {/* Mostrar el orden de aprendizaje - MÁS COMPACTO */}
          <div className="mt-4 bg-white/80 rounded-xl p-3 border-2 border-pink-300">
            <h3 className="text-base font-bold text-pink-600 mb-2">🎯 ORDEN DE APRENDIZAJE:</h3>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <span className="no-uppercase">1️⃣</span> LETRAS
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">2️⃣</span> SÍLABAS
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">3️⃣</span> PALABRAS
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">4️⃣</span> GRANJA
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">5️⃣</span> CIUDAD
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">6️⃣</span> BOSQUE
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">7️⃣</span> CREAR
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">8️⃣</span> CUENTOS
              </div>
              <div className="flex items-center gap-1">
                <span className="no-uppercase">9️⃣</span> CANCIONES
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-3">
            <span className="animate-pulse text-xl no-uppercase" data-emoji="true">
              💕
            </span>
            <span className="animate-pulse text-xl no-uppercase" data-emoji="true" style={{ animationDelay: "0.5s" }}>
              💕
            </span>
            <span className="animate-pulse text-xl no-uppercase" data-emoji="true" style={{ animationDelay: "1s" }}>
              💕
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
