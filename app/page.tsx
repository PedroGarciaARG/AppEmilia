"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Play, Trophy, Heart, Baby } from "lucide-react"
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
import LevelSystem from "@/components/level-system"
import VirtualPetMenu from "@/components/virtual-pet-menu"
import Image from "next/image"
import OfflineIndicator from "@/components/offline-indicator"

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
    | "main"
    | "educational-games"
    | "virtual-pets"
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
  >("main")

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "MI BEBÉ LLORÓN",
    age: 6,
    language: "both",
    avatar: "/images/bebe-abeja.png",
    stars: 100,
    coins: 50,
    level: 1,
    ownedAvatars: ["bebe-abeja", "bebe-rana", "bebe-conejo", "bebe-astronauta"],
    ownedPets: [],
    ownedItems: {
      "milk-basic": 5,
      "diaper-basic": 3,
      "music-box": 2,
    },
    virtualPets: {},
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
      try {
        const parsedProfile = JSON.parse(saved)
        setUserProfile({
          ...parsedProfile,
          coins: parsedProfile.coins || 50,
          ownedPets: parsedProfile.ownedPets || [],
          ownedItems: parsedProfile.ownedItems || {
            "milk-basic": 5,
            "diaper-basic": 3,
            "music-box": 2,
          },
          virtualPets: parsedProfile.virtualPets || {},
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
      } catch (error) {
        console.error("Error loading profile:", error)
      }
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

  const addCoins = (amount: number) => {
    const newProfile = { ...userProfile, coins: userProfile.coins + amount }
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

  // PANTALLA PRINCIPAL
  if (currentView === "main") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <OfflineIndicator />
        <div className="container mx-auto p-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src={userProfile.avatar || "/images/bebe-abeja.png"}
                alt="MI AVATAR"
                fill
                className="object-contain animate-bounce rounded-full border-4 border-pink-300"
              />
            </div>
            <h1 className="text-4xl font-bold text-pink-600 mb-2">
              <span className="no-uppercase">💕</span> ¡HOLA {userProfile.name}!{" "}
              <span className="no-uppercase">💕</span>
            </h1>
            <p className="text-xl text-purple-600 mb-4">¡BIENVENIDO AL MUNDO DE LOS BEBÉS LLORONES!</p>

            <div className="flex justify-center items-center gap-6 mb-6">
              <Badge className="bg-pink-400 text-white text-lg px-4 py-2 border-2 border-pink-500">
                <Heart className="w-5 h-5 mr-2 fill-white" />
                {userProfile.stars} CORAZONES
              </Badge>
              <Badge className="bg-yellow-400 text-white text-lg px-4 py-2 border-2 border-yellow-500">
                <span className="no-uppercase mr-2">🪙</span>
                {userProfile.coins} MONEDAS
              </Badge>
              <Badge className="bg-purple-400 text-white text-lg px-4 py-2 border-2 border-purple-500">
                <Trophy className="w-5 h-5 mr-2" />
                NIVEL {userProfile.level}
              </Badge>
            </div>
          </div>

          {/* Opciones principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card
              className="bg-gradient-to-br from-blue-300 to-purple-400 border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setCurrentView("educational-games")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                  🎓
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">JUEGOS EDUCATIVOS</h2>
                <p className="text-xl text-white/90 mb-6 drop-shadow">¡APRENDE Y GANA CORAZONES!</p>
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <p className="text-white font-bold text-lg">9 JUEGOS ORGANIZADOS</p>
                  <p className="text-white/90">LETRAS → SÍLABAS → PALABRAS</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-lg py-3 px-8">
                  <Play className="w-6 h-6 mr-2" />
                  ¡EMPEZAR A APRENDER!
                </Button>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-pink-300 to-red-400 border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setCurrentView("virtual-pets")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                  🐾
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">MASCOTAS VIRTUALES</h2>
                <p className="text-xl text-white/90 mb-6 drop-shadow">¡ADOPTA Y CUIDA BEBÉS LLORONES!</p>
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <p className="text-white font-bold text-lg">
                    {Object.keys(userProfile.virtualPets).length} MASCOTAS ADOPTADAS
                  </p>
                  <p className="text-white/90">ALIMENTA • JUEGA • CUIDA</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full font-bold text-lg py-3 px-8">
                  <Baby className="w-6 h-6 mr-2" />
                  ¡CUIDAR MASCOTAS!
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setCurrentView("settings")}
              className="bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-6 rounded-xl shadow-lg border-2 border-white"
            >
              <Settings className="w-6 h-6 mr-2" />
              PERFIL
            </Button>
            <Button
              onClick={() => setCurrentView("rewards")}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-6 rounded-xl shadow-lg border-2 border-white"
            >
              <Trophy className="w-6 h-6 mr-2" />
              TESOROS
            </Button>
            <Button
              onClick={() => {
                if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(
                    `¡TIENES ${userProfile.stars} CORAZONES Y ${userProfile.coins} MONEDAS! ¡ESTÁS EN EL NIVEL ${userProfile.level}!`,
                  )
                  utterance.lang = "es-ES"
                  utterance.rate = 0.8
                  utterance.pitch = 1.3
                  speechSynthesis.speak(utterance)
                }
              }}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-6 rounded-xl shadow-lg border-2 border-white"
            >
              <span className="no-uppercase">🔊</span> PROGRESO
            </Button>
            <Button
              onClick={() => {
                const totalPets = Object.keys(userProfile.virtualPets).length
                const totalGames = Object.values(userProfile.gameLevels).reduce((a, b) => a + b, 0)
                if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(
                    `¡BIENVENIDO AL MUNDO DE LOS BEBÉS LLORONES! TIENES ${totalPets} MASCOTAS Y HAS COMPLETADO ${totalGames} NIVELES DE JUEGOS!`,
                  )
                  utterance.lang = "es-ES"
                  utterance.rate = 0.8
                  utterance.pitch = 1.3
                  speechSynthesis.speak(utterance)
                }
              }}
              className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-6 rounded-xl shadow-lg border-2 border-white"
            >
              <span className="no-uppercase">🎉</span> AYUDA
            </Button>
          </div>

          {/* Animación divertida */}
          <div className="text-center mt-8">
            <div className="animate-bounce text-5xl mb-4 no-uppercase" data-emoji="true">
              🍼
            </div>
            <p className="text-pink-600 font-bold text-xl">¡ELIGE TU AVENTURA!</p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="animate-pulse text-2xl no-uppercase" data-emoji="true">
                💕
              </span>
              <span
                className="animate-pulse text-2xl no-uppercase"
                data-emoji="true"
                style={{ animationDelay: "0.5s" }}
              >
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

  // MENÚ DE MASCOTAS VIRTUALES
  if (currentView === "virtual-pets") {
    return (
      <VirtualPetMenu
        profile={userProfile}
        onUpdateProfile={saveProfile}
        onAddCoins={addCoins}
        onBackToMain={() => setCurrentView("main")}
      />
    )
  }

  // JUEGOS EDUCATIVOS
  if (currentView === "educational-games") {
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

    const orderedCharacters = characters.sort((a, b) => a.order - b.order)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <OfflineIndicator />
        <div className="container mx-auto p-4 max-w-6xl">
          {/* Header con navegación */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentView("main")}
                className="bg-white/90 text-pink-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-pink-300"
              >
                <span className="no-uppercase">🏠</span> MENÚ PRINCIPAL
              </Button>
              <Button
                onClick={() => setCurrentView("virtual-pets")}
                className="bg-white/90 text-purple-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-purple-300"
              >
                <span className="no-uppercase">🐾</span> MASCOTAS
              </Button>
            </div>
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 border-2 border-yellow-300">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="font-bold text-pink-600">{userProfile.stars}</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-pink-600 mb-2">
              <span className="no-uppercase">🎓</span> JUEGOS EDUCATIVOS
            </h1>
            <p className="text-lg text-purple-600 mb-3">¡APRENDE Y GANA CORAZONES PARA ADOPTAR MASCOTAS!</p>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
            {orderedCharacters.map((character, index) => (
              <Card
                key={index}
                className={`${character.color} border-3 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden relative h-48`}
                onClick={() => setCurrentView(character.activity as any)}
              >
                <CardContent className="p-3 text-center relative h-full flex flex-col justify-between">
                  <div className="absolute top-1 left-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{character.order}</span>
                  </div>

                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <Image
                      src={character.image || "/placeholder.svg"}
                      alt={`Bebé Llorón ${character.order}`}
                      fill
                      className="object-contain animate-bounce"
                    />
                  </div>

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

          {/* Orden de aprendizaje */}
          <div className="bg-white/80 rounded-xl p-4 border-2 border-pink-300 text-center">
            <h3 className="text-lg font-bold text-pink-600 mb-3">🎯 ORDEN PERFECTO DE APRENDIZAJE:</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
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
        </div>
      </div>
    )
  }

  // JUEGOS INDIVIDUALES
  if (currentView !== "main" && currentView !== "educational-games" && currentView !== "virtual-pets") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <OfflineIndicator />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentView("educational-games")}
                className="bg-white/90 text-pink-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-pink-300"
              >
                <span className="no-uppercase">🎓</span> JUEGOS
              </Button>
              <Button
                onClick={() => setCurrentView("main")}
                className="bg-white/90 text-blue-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-blue-300"
              >
                <span className="no-uppercase">🏠</span> INICIO
              </Button>
              <Button
                onClick={() => setCurrentView("virtual-pets")}
                className="bg-white/90 text-purple-600 hover:bg-white rounded-full px-6 py-3 text-lg font-bold shadow-lg border-2 border-purple-300"
              >
                <span className="no-uppercase">🐾</span> MASCOTAS
              </Button>
            </div>
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
        </div>
      </div>
    )
  }

  return null
}
