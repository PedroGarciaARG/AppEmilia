"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, RotateCcw, Heart, Ear } from "lucide-react"
import Image from "next/image"

interface SoundForestGameProps {
  language: "es" | "en" | "both"
  level: number
  onReward: (stars: number) => void
}

const soundData = {
  es: {
    // Niveles 1-10: Sonidos iniciales simples
    basic: [
      {
        sound: "M",
        word: "MESA",
        options: ["🪑", "🐶", "☀️"],
        correct: 0,
        phoneme: "MMMM",
        description: "SONIDO CON LABIOS CERRADOS",
      },
      {
        sound: "S",
        word: "SOL",
        options: ["☀️", "🐱", "🌙"],
        correct: 0,
        phoneme: "SSSS",
        description: "SONIDO COMO SERPIENTE",
      },
      {
        sound: "P",
        word: "PATO",
        options: ["🦆", "🐸", "🐝"],
        correct: 0,
        phoneme: "P",
        description: "SONIDO QUE EXPLOTA",
      },
      {
        sound: "L",
        word: "LUNA",
        options: ["🌙", "⭐", "☀️"],
        correct: 0,
        phoneme: "LLLL",
        description: "SONIDO LÍQUIDO",
      },
      {
        sound: "T",
        word: "TAZA",
        options: ["☕", "🍽️", "🥛"],
        correct: 0,
        phoneme: "T",
        description: "SONIDO SECO Y RÁPIDO",
      },
      { sound: "N", word: "NUBE", options: ["☁️", "🌈", "⛈️"], correct: 0, phoneme: "NNNN", description: "SONIDO NASAL" },
      {
        sound: "R",
        word: "ROSA",
        options: ["🌹", "🌻", "🌷"],
        correct: 0,
        phoneme: "RRRR",
        description: "SONIDO QUE VIBRA",
      },
      { sound: "D", word: "DADO", options: ["🎲", "🎯", "🎪"], correct: 0, phoneme: "D", description: "SONIDO SUAVE" },
      { sound: "C", word: "CASA", options: ["🏠", "🏢", "🏰"], correct: 0, phoneme: "K", description: "SONIDO FUERTE" },
      {
        sound: "B",
        word: "BOCA",
        options: ["👄", "👁️", "👂"],
        correct: 0,
        phoneme: "B",
        description: "SONIDO CON LABIOS",
      },
    ],
    // Niveles 11-25: Sonidos medios
    intermediate: [
      {
        sound: "F",
        word: "FLOR",
        options: ["🌸", "🌿", "🌱"],
        correct: 0,
        phoneme: "FFFF",
        description: "SONIDO COMO VIENTO",
      },
      { sound: "G", word: "GATO", options: ["🐱", "🐶", "🐭"], correct: 0, phoneme: "G", description: "SONIDO GRAVE" },
      {
        sound: "J",
        word: "JIRAFA",
        options: ["🦒", "🐘", "🦏"],
        correct: 0,
        phoneme: "J",
        description: "SONIDO RASPOSO",
      },
      {
        sound: "V",
        word: "VACA",
        options: ["🐄", "🐷", "🐑"],
        correct: 0,
        phoneme: "V",
        description: "SONIDO VIBRANTE",
      },
      {
        sound: "Z",
        word: "ZAPATO",
        options: ["👟", "👠", "🥾"],
        correct: 0,
        phoneme: "Z",
        description: "SONIDO ZUMBANTE",
      },
      {
        sound: "CH",
        word: "CHOCOLATE",
        options: ["🍫", "🍪", "🧁"],
        correct: 0,
        phoneme: "CH",
        description: "SONIDO COMO TREN",
      },
      {
        sound: "LL",
        word: "LLUVIA",
        options: ["🌧️", "☔", "⛈️"],
        correct: 0,
        phoneme: "Y",
        description: "SONIDO DOBLE L",
      },
      {
        sound: "Ñ",
        word: "NIÑO",
        options: ["👶", "👧", "👦"],
        correct: 0,
        phoneme: "NY",
        description: "SONIDO ESPECIAL ESPAÑOL",
      },
      {
        sound: "RR",
        word: "PERRO",
        options: ["🐶", "🐱", "🐭"],
        correct: 0,
        phoneme: "RRR",
        description: "SONIDO QUE RUEDA",
      },
      {
        sound: "Y",
        word: "YOYO",
        options: ["🪀", "🎯", "🎲"],
        correct: 0,
        phoneme: "Y",
        description: "SONIDO COMO LL",
      },
    ],
    // Niveles 26-40: Sonidos finales
    advanced: [
      {
        sound: "final S",
        word: "FLORES",
        options: ["🌸", "🌿", "🌱"],
        correct: 0,
        phoneme: "S",
        description: "SONIDO AL FINAL",
      },
      {
        sound: "final R",
        word: "AMOR",
        options: ["💕", "💖", "💗"],
        correct: 0,
        phoneme: "R",
        description: "SONIDO FINAL VIBRANTE",
      },
      {
        sound: "final N",
        word: "CORAZÓN",
        options: ["💖", "💝", "💘"],
        correct: 0,
        phoneme: "N",
        description: "SONIDO FINAL NASAL",
      },
      {
        sound: "final L",
        word: "ANIMAL",
        options: ["🐾", "🦁", "🐯"],
        correct: 0,
        phoneme: "L",
        description: "SONIDO FINAL LÍQUIDO",
      },
      {
        sound: "final D",
        word: "CIUDAD",
        options: ["🏙️", "🌆", "🏘️"],
        correct: 0,
        phoneme: "D",
        description: "SONIDO FINAL SUAVE",
      },
      {
        sound: "final Z",
        word: "FELIZ",
        options: ["😊", "😄", "😁"],
        correct: 0,
        phoneme: "Z",
        description: "SONIDO FINAL ZUMBANTE",
      },
      {
        sound: "final X",
        word: "RELAX",
        options: ["😌", "🧘", "😴"],
        correct: 0,
        phoneme: "KS",
        description: "SONIDO FINAL DOBLE",
      },
      {
        sound: "final Y",
        word: "HOY",
        options: ["📅", "⏰", "🗓️"],
        correct: 0,
        phoneme: "I",
        description: "SONIDO FINAL COMO I",
      },
      {
        sound: "final T",
        word: "ROBOT",
        options: ["🤖", "🦾", "⚙️"],
        correct: 0,
        phoneme: "T",
        description: "SONIDO FINAL SECO",
      },
      {
        sound: "final P",
        word: "STOP",
        options: ["🛑", "⛔", "🚫"],
        correct: 0,
        phoneme: "P",
        description: "SONIDO FINAL EXPLOSIVO",
      },
    ],
    // Niveles 41-50: Sonidos complejos
    expert: [
      {
        sound: "BR",
        word: "BRAZO",
        options: ["💪", "🦾", "✋"],
        correct: 0,
        phoneme: "BR",
        description: "SONIDO DOBLE FUERTE",
      },
      {
        sound: "TR",
        word: "TREN",
        options: ["🚂", "🚃", "🚄"],
        correct: 0,
        phoneme: "TR",
        description: "SONIDO DOBLE RÁPIDO",
      },
      {
        sound: "PL",
        word: "PLATO",
        options: ["🍽️", "🥄", "🍴"],
        correct: 0,
        phoneme: "PL",
        description: "SONIDO DOBLE LÍQUIDO",
      },
      {
        sound: "CL",
        word: "CLARO",
        options: ["💡", "🔆", "✨"],
        correct: 0,
        phoneme: "CL",
        description: "SONIDO DOBLE CLARO",
      },
      {
        sound: "FR",
        word: "FRUTA",
        options: ["🍎", "🍌", "🍇"],
        correct: 0,
        phoneme: "FR",
        description: "SONIDO DOBLE FRESCO",
      },
      {
        sound: "GR",
        word: "GRANDE",
        options: ["📏", "📐", "📊"],
        correct: 0,
        phoneme: "GR",
        description: "SONIDO DOBLE GRAVE",
      },
      {
        sound: "PR",
        word: "PRIMO",
        options: ["👨‍👩‍👧‍👦", "👫", "👬"],
        correct: 0,
        phoneme: "PR",
        description: "SONIDO DOBLE RÁPIDO",
      },
      {
        sound: "DR",
        word: "DRAGÓN",
        options: ["🐉", "🐲", "🦕"],
        correct: 0,
        phoneme: "DR",
        description: "SONIDO DOBLE DRAMÁTICO",
      },
      {
        sound: "FL",
        word: "FLOR",
        options: ["🌸", "🌺", "🌻"],
        correct: 0,
        phoneme: "FL",
        description: "SONIDO DOBLE FLUIDO",
      },
      {
        sound: "GL",
        word: "GLOBO",
        options: ["🎈", "🎪", "🎡"],
        correct: 0,
        phoneme: "GL",
        description: "SONIDO DOBLE LÍQUIDO GRAVE",
      },
    ],
  },
  en: [
    {
      sound: "M",
      word: "MOUSE",
      options: ["🐭", "🐱", "🐶"],
      correct: 0,
      phoneme: "MMM",
      description: "LIPS TOGETHER SOUND",
    },
    { sound: "S", word: "SUN", options: ["☀️", "🌙", "⭐"], correct: 0, phoneme: "SSS", description: "SNAKE SOUND" },
    { sound: "P", word: "PIG", options: ["🐷", "🐄", "🐑"], correct: 0, phoneme: "P", description: "POPPING SOUND" },
    { sound: "L", word: "LION", options: ["🦁", "🐯", "🐺"], correct: 0, phoneme: "LLL", description: "LIQUID SOUND" },
    { sound: "T", word: "TREE", options: ["🌳", "🌲", "🌴"], correct: 0, phoneme: "T", description: "QUICK DRY SOUND" },
  ],
}

export default function SoundForestGame({ language, level, onReward }: SoundForestGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const currentData = language === "both" ? soundData.es : soundData[language] || soundData.es

  useEffect(() => {
    generateChallenge()
  }, [level])

  const generateChallenge = () => {
    let challengePool: any[] = []

    if (level <= 10) {
      challengePool = currentData.basic
    } else if (level <= 25) {
      challengePool = [...currentData.basic, ...currentData.intermediate]
    } else if (level <= 40) {
      challengePool = [...currentData.intermediate, ...currentData.advanced]
    } else {
      challengePool = [...currentData.advanced, ...currentData.expert]
    }

    const challenge = challengePool[Math.floor(Math.random() * challengePool.length)]
    setCurrentChallenge(challenge)
    setSelectedOption(null)
    setShowHint(false)
  }

  const playPhoneme = (phoneme: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(phoneme)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.4
      utterance.pitch = 1.3
      speechSynthesis.speak(utterance)
    }
  }

  const playWord = (word: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.7
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)

    if (optionIndex === currentChallenge.correct) {
      setScore(score + 1)
      setShowSuccess(true)
      onReward(3)

      // Agregar progreso al sistema de niveles
      if ((window as any).addLevelProgress) {
        ;(window as any).addLevelProgress()
      }

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          `¡EXCELENTE! ${currentChallenge.phoneme} DE ${currentChallenge.word}. ¡BEBÉ DINOSAURIO ESTÁ RUGIENDO DE ALEGRÍA!`,
        )
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }

      setTimeout(() => {
        setShowSuccess(false)
        generateChallenge()
      }, 3000)
    } else {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡ROAAAR! BEBÉ DINOSAURIO DICE: ¡ESCUCHA BIEN EL SONIDO!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }

      setTimeout(() => {
        setSelectedOption(null)
      }, 1500)
    }
  }

  const showHintFunction = () => {
    setShowHint(true)
    playWord(currentChallenge.word)
  }

  if (!currentChallenge) return <div>Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src="/images/bebe-dinosaurio.png"
            alt="BEBÉ DINOSAURIO"
            fill
            className="object-contain animate-bounce"
          />
        </div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          <span className="no-uppercase">🦕</span> BOSQUE DE SONIDOS CON BEBÉ DINOSAURIO
        </h2>
        <p className="text-lg text-green-700 italic">"¡ROAAAR! ¡VAMOS A ESCUCHAR SONIDOS MÁGICOS!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl border-4 border-green-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              🌲
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-4">ESCUCHA EL SONIDO:</h3>
            <div className="bg-white/90 rounded-2xl p-4 border-2 border-green-200 mb-4">
              <p className="text-lg font-bold text-green-600 mb-2">{currentChallenge.sound}</p>
              <p className="text-sm text-gray-600">{currentChallenge.description}</p>
            </div>
          </div>

          {/* Botón para reproducir sonido */}
          <div className="text-center mb-6">
            <Button
              onClick={() => playPhoneme(currentChallenge.phoneme)}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg border-2 border-white"
            >
              <Ear className="w-6 h-6 mr-2" />
              ESCUCHAR SONIDO
            </Button>
          </div>

          {/* Opciones de imágenes */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {currentChallenge.options.map((option: string, index: number) => (
              <Button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`aspect-square text-6xl p-8 rounded-2xl border-4 transition-all ${
                  selectedOption === index
                    ? index === currentChallenge.correct
                      ? "bg-green-400 border-green-500 scale-110"
                      : "bg-red-400 border-red-500 scale-110"
                    : "bg-white border-gray-300 hover:border-green-300 hover:scale-105"
                }`}
              >
                <span className="no-uppercase" data-emoji="true">
                  {option}
                </span>
              </Button>
            ))}
          </div>

          {/* Botones de ayuda */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={showHintFunction}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              PISTA
            </Button>

            <Button
              onClick={generateChallenge}
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              NUEVO SONIDO
            </Button>
          </div>

          {/* Mostrar palabra si se pidió pista */}
          {showHint && (
            <div className="mt-6 bg-white/90 rounded-2xl p-4 border-2 border-yellow-300">
              <h5 className="text-lg font-bold text-yellow-700 mb-2 text-center">PALABRA COMPLETA:</h5>
              <p className="text-2xl font-bold text-center text-yellow-800">{currentChallenge.word}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-green-400 to-emerald-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/images/bebe-dinosaurio.png"
                  alt="BEBÉ DINOSAURIO"
                  fill
                  className="object-contain animate-bounce"
                />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                🎉
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡ROAAAR PERFECTO!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ DINOSAURIO ESTÁ RUGIENDO DE ALEGRÍA!</p>
              <p className="text-lg text-white/90">+3 CORAZONES</p>
              <div className="flex justify-center mt-4 gap-1">
                {[1, 2, 3].map((i) => (
                  <Heart key={i} className="w-6 h-6 text-pink-200 fill-pink-200 animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información del nivel */}
      <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-green-300">
        <h4 className="text-lg font-bold text-green-700 mb-2">NIVEL {level} - BOSQUE DE SONIDOS</h4>
        <p className="text-sm text-gray-600">
          {level <= 10
            ? "SONIDOS INICIALES SIMPLES"
            : level <= 25
              ? "SONIDOS MEDIOS"
              : level <= 40
                ? "SONIDOS FINALES"
                : "SONIDOS COMPLEJOS"}
        </p>
      </div>
    </div>
  )
}
