"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, RotateCcw, Heart, Train } from "lucide-react"
import Image from "next/image"

interface SyllableTrainGameProps {
  language: "es" | "en" | "both"
  level: number
  onReward: (stars: number) => void
}

const trainWordsData = {
  es: {
    // Niveles 1-10: Palabras de 2 sílabas
    basic: [
      { word: "CASA", syllables: ["CA", "SA"], image: "🏠", station: "ESTACIÓN HOGAR", sound: "¡CHOO CHOO A CASA!" },
      { word: "MESA", syllables: ["ME", "SA"], image: "🪑", station: "ESTACIÓN MUEBLES", sound: "¡TREN A LA MESA!" },
      { word: "GATO", syllables: ["GA", "TO"], image: "🐱", station: "ESTACIÓN MASCOTAS", sound: "¡MIAU EN EL TREN!" },
      { word: "PATO", syllables: ["PA", "TO"], image: "🦆", station: "ESTACIÓN GRANJA", sound: "¡CUAC EN VAGÓN!" },
      { word: "LUNA", syllables: ["LU", "NA"], image: "🌙", station: "ESTACIÓN CIELO", sound: "¡TREN NOCTURNO!" },
      { word: "ROSA", syllables: ["RO", "SA"], image: "🌹", station: "ESTACIÓN JARDÍN", sound: "¡FLORES EN TREN!" },
      { word: "BOCA", syllables: ["BO", "CA"], image: "👄", station: "ESTACIÓN CUERPO", sound: "¡HABLA EL TREN!" },
      { word: "MANO", syllables: ["MA", "NO"], image: "✋", station: "ESTACIÓN CUERPO", sound: "¡SALUDA EL TREN!" },
      { word: "PELO", syllables: ["PE", "LO"], image: "💇", station: "ESTACIÓN BELLEZA", sound: "¡TREN ELEGANTE!" },
      {
        word: "AGUA",
        syllables: ["A", "GUA"],
        image: "💧",
        station: "ESTACIÓN NATURALEZA",
        sound: "¡SPLASH DEL TREN!",
      },
    ],
    // Niveles 11-25: Palabras de 3 sílabas
    intermediate: [
      {
        word: "CABEZA",
        syllables: ["CA", "BE", "ZA"],
        image: "🧠",
        station: "ESTACIÓN CUERPO",
        sound: "¡TREN INTELIGENTE!",
      },
      {
        word: "PELOTA",
        syllables: ["PE", "LO", "TA"],
        image: "⚽",
        station: "ESTACIÓN DEPORTES",
        sound: "¡TREN DEPORTIVO!",
      },
      { word: "CAMISA", syllables: ["CA", "MI", "SA"], image: "👕", station: "ESTACIÓN ROPA", sound: "¡TREN DE MODA!" },
      {
        word: "BANANA",
        syllables: ["BA", "NA", "NA"],
        image: "🍌",
        station: "ESTACIÓN FRUTAS",
        sound: "¡TREN AMARILLO!",
      },
      {
        word: "VENTANA",
        syllables: ["VEN", "TA", "NA"],
        image: "🪟",
        station: "ESTACIÓN HOGAR",
        sound: "¡TREN CON VISTA!",
      },
      { word: "PALOMA", syllables: ["PA", "LO", "MA"], image: "🕊️", station: "ESTACIÓN AVES", sound: "¡TREN VOLADOR!" },
      {
        word: "COMIDA",
        syllables: ["CO", "MI", "DA"],
        image: "🍽️",
        station: "ESTACIÓN COCINA",
        sound: "¡TREN DELICIOSO!",
      },
      {
        word: "FAMILIA",
        syllables: ["FA", "MI", "LIA"],
        image: "👨‍👩‍👧‍👦",
        station: "ESTACIÓN AMOR",
        sound: "¡TREN FAMILIAR!",
      },
      { word: "MÚSICA", syllables: ["MÚ", "SI", "CA"], image: "🎵", station: "ESTACIÓN ARTE", sound: "¡TREN MUSICAL!" },
      {
        word: "ESCUELA",
        syllables: ["ES", "CUE", "LA"],
        image: "🏫",
        station: "ESTACIÓN EDUCACIÓN",
        sound: "¡TREN ESTUDIOSO!",
      },
    ],
    // Niveles 26-40: Palabras de 4+ sílabas
    advanced: [
      {
        word: "MARIPOSA",
        syllables: ["MA", "RI", "PO", "SA"],
        image: "🦋",
        station: "ESTACIÓN JARDÍN",
        sound: "¡TREN COLORIDO!",
      },
      {
        word: "ELEFANTE",
        syllables: ["E", "LE", "FAN", "TE"],
        image: "🐘",
        station: "ESTACIÓN ZOO",
        sound: "¡TREN GIGANTE!",
      },
      {
        word: "DINOSAURIO",
        syllables: ["DI", "NO", "SAU", "RIO"],
        image: "🦕",
        station: "ESTACIÓN PREHISTORIA",
        sound: "¡TREN JURÁSICO!",
      },
      {
        word: "COMPUTADORA",
        syllables: ["COM", "PU", "TA", "DO", "RA"],
        image: "💻",
        station: "ESTACIÓN TECNOLOGÍA",
        sound: "¡TREN DIGITAL!",
      },
      {
        word: "REFRIGERADOR",
        syllables: ["RE", "FRI", "GE", "RA", "DOR"],
        image: "🧊",
        station: "ESTACIÓN COCINA",
        sound: "¡TREN FRÍO!",
      },
      {
        word: "TELEVISIÓN",
        syllables: ["TE", "LE", "VI", "SIÓN"],
        image: "📺",
        station: "ESTACIÓN ENTRETENIMIENTO",
        sound: "¡TREN DE SHOWS!",
      },
      {
        word: "AUTOMÓVIL",
        syllables: ["AU", "TO", "MÓ", "VIL"],
        image: "🚗",
        station: "ESTACIÓN TRANSPORTE",
        sound: "¡TREN RÁPIDO!",
      },
      {
        word: "BIBLIOTECA",
        syllables: ["BI", "BLIO", "TE", "CA"],
        image: "📚",
        station: "ESTACIÓN LIBROS",
        sound: "¡TREN SABIO!",
      },
      {
        word: "SUPERMERCADO",
        syllables: ["SU", "PER", "MER", "CA", "DO"],
        image: "🛒",
        station: "ESTACIÓN COMPRAS",
        sound: "¡TREN DE COMPRAS!",
      },
      {
        word: "UNIVERSIDAD",
        syllables: ["U", "NI", "VER", "SI", "DAD"],
        image: "🎓",
        station: "ESTACIÓN EDUCACIÓN",
        sound: "¡TREN UNIVERSITARIO!",
      },
    ],
    // Niveles 41-50: Palabras muy complejas
    expert: [
      {
        word: "EXTRAORDINARIO",
        syllables: ["EX", "TRA", "OR", "DI", "NA", "RIO"],
        image: "⭐",
        station: "ESTACIÓN ESPECIAL",
        sound: "¡TREN EXTRAORDINARIO!",
      },
      {
        word: "RESPONSABILIDAD",
        syllables: ["RES", "PON", "SA", "BI", "LI", "DAD"],
        image: "🤝",
        station: "ESTACIÓN VALORES",
        sound: "¡TREN RESPONSABLE!",
      },
      {
        word: "TRANSFORMACIÓN",
        syllables: ["TRANS", "FOR", "MA", "CIÓN"],
        image: "🔄",
        station: "ESTACIÓN CAMBIO",
        sound: "¡TREN TRANSFORMADOR!",
      },
      {
        word: "INVESTIGACIÓN",
        syllables: ["IN", "VES", "TI", "GA", "CIÓN"],
        image: "🔍",
        station: "ESTACIÓN CIENCIA",
        sound: "¡TREN CIENTÍFICO!",
      },
      {
        word: "COMUNICACIÓN",
        syllables: ["CO", "MU", "NI", "CA", "CIÓN"],
        image: "📞",
        station: "ESTACIÓN COMUNICACIÓN",
        sound: "¡TREN COMUNICATIVO!",
      },
    ],
  },
  en: [
    { word: "HAPPY", syllables: ["HAP", "PY"], image: "😊", station: "EMOTION STATION", sound: "HAPPY TRAIN!" },
    {
      word: "FAMILY",
      syllables: ["FA", "MI", "LY"],
      image: "👨‍👩‍👧‍👦",
      station: "LOVE STATION",
      sound: "FAMILY TRAIN!",
    },
    { word: "ELEPHANT", syllables: ["E", "LE", "PHANT"], image: "🐘", station: "ZOO STATION", sound: "BIG TRAIN!" },
  ],
}

export default function SyllableTrainGame({ language, level, onReward }: SyllableTrainGameProps) {
  const [currentWord, setCurrentWord] = useState<any>(null)
  const [trainCars, setTrainCars] = useState<string[]>([])
  const [availableSyllables, setAvailableSyllables] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isTrainMoving, setIsTrainMoving] = useState(false)

  const currentData = language === "both" ? trainWordsData.es : trainWordsData[language] || trainWordsData.es

  useEffect(() => {
    generateChallenge()
  }, [level])

  const generateChallenge = () => {
    let wordPool: any[] = []

    if (level <= 10) {
      wordPool = currentData.basic
    } else if (level <= 25) {
      wordPool = [...currentData.basic, ...currentData.intermediate]
    } else if (level <= 40) {
      wordPool = [...currentData.intermediate, ...currentData.advanced]
    } else {
      wordPool = [...currentData.advanced, ...currentData.expert]
    }

    const word = wordPool[Math.floor(Math.random() * wordPool.length)]
    setCurrentWord(word)

    // Generar sílabas disponibles (correctas + distractoras)
    const extraSyllables = ["TI", "SO", "RI", "NO", "LA", "PE", "DO", "SI", "FA", "MI"].slice(0, 4)
    const allSyllables = [...word.syllables, ...extraSyllables].sort(() => Math.random() - 0.5)
    setAvailableSyllables(allSyllables)

    resetTrain()
  }

  const resetTrain = () => {
    setTrainCars([])
    setIsTrainMoving(false)
  }

  const playTrainSound = (word: any) => {
    if ("speechSynthesis" in window) {
      // Primero el sonido del tren
      const utterance1 = new SpeechSynthesisUtterance("¡CHOO CHOO!")
      utterance1.lang = "es-ES"
      utterance1.rate = 0.8
      utterance1.pitch = 1.5

      utterance1.onend = () => {
        // Luego deletrear las sílabas
        const syllableSpelling = word.syllables.join(" - ")
        const utterance2 = new SpeechSynthesisUtterance(`${syllableSpelling}... ¡${word.word}!`)
        utterance2.lang = language === "en" ? "en-US" : "es-ES"
        utterance2.rate = 0.6
        utterance2.pitch = 1.2

        utterance2.onend = () => {
          // Finalmente el sonido especial
          const utterance3 = new SpeechSynthesisUtterance(word.sound)
          utterance3.lang = language === "en" ? "en-US" : "es-ES"
          utterance3.rate = 0.8
          utterance3.pitch = 1.4
          speechSynthesis.speak(utterance3)
        }

        speechSynthesis.speak(utterance2)
      }

      speechSynthesis.speak(utterance1)
    }
  }

  const addSyllableToTrain = (syllable: string) => {
    if (trainCars.length < currentWord.syllables.length) {
      setTrainCars([...trainCars, syllable])
      setAvailableSyllables(
        availableSyllables.filter((s, i) => s !== syllable || i !== availableSyllables.indexOf(syllable)),
      )
    }
  }

  const removeSyllableFromTrain = (index: number) => {
    const syllable = trainCars[index]
    setAvailableSyllables([...availableSyllables, syllable])
    setTrainCars(trainCars.filter((_, i) => i !== index))
  }

  const checkTrain = () => {
    const formedWord = trainCars.join("")

    if (formedWord === currentWord.word) {
      setScore(score + 1)
      setIsTrainMoving(true)
      setShowSuccess(true)
      onReward(5)

      // Agregar progreso al sistema de niveles
      if ((window as any).addLevelProgress) {
        ;(window as any).addLevelProgress()
      }

      playTrainSound(currentWord)

      setTimeout(() => {
        setShowSuccess(false)
        setIsTrainMoving(false)
        generateChallenge()
      }, 5000)
    } else {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          "¡BUAAA! BEBÉ TIBURÓN DICE: ¡EL TREN NECESITA LAS SÍLABAS CORRECTAS!",
        )
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  const isTrainComplete = () => {
    return trainCars.length === currentWord.syllables.length
  }

  if (!currentWord) return <div>Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-tiburon.png" alt="BEBÉ TIBURÓN" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-blue-600 mb-2">
          <span className="no-uppercase">🦈</span> CIUDAD DE SÍLABAS CON BEBÉ TIBURÓN
        </h2>
        <p className="text-lg text-blue-700 italic">"¡CHOMP CHOMP! ¡VAMOS A LLEVAR PALABRAS EN TREN!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-2xl border-4 border-blue-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 animate-bounce no-uppercase" data-emoji="true">
              {currentWord.image}
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-2">¿DÓNDE ESTÁ {currentWord.word}?</h3>
            <p className="text-lg text-blue-600 bg-white/80 rounded-full py-2 px-4 mb-2">{currentWord.station}</p>
            <p className="text-sm text-gray-600">¡FORMA LA PALABRA CON VAGONES-SÍLABA!</p>
          </div>

          {/* Tren con vagones */}
          <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl p-6 mb-6 border-4 border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* Locomotora */}
              <div className={`text-4xl ${isTrainMoving ? "animate-bounce" : ""} no-uppercase`} data-emoji="true">
                🚂
              </div>

              {/* Vagones */}
              {Array.from({ length: currentWord.syllables.length }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-2xl no-uppercase" data-emoji="true">
                    🔗
                  </div>
                  <div
                    onClick={() => removeSyllableFromTrain(index)}
                    className={`w-20 h-16 rounded-xl border-4 flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${
                      trainCars[index]
                        ? "bg-blue-400 text-white border-blue-500 scale-110"
                        : "bg-white border-gray-300 border-dashed"
                    } ${isTrainMoving ? "animate-pulse" : ""}`}
                  >
                    {trainCars[index] || "?"}
                  </div>
                </div>
              ))}

              {/* Estación */}
              <div className="ml-4 text-2xl no-uppercase" data-emoji="true">
                🏢
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">¡ARRASTRA LAS SÍLABAS A LOS VAGONES!</p>
          </div>

          {/* Sílabas disponibles */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-blue-600 mb-3 text-center">SÍLABAS DISPONIBLES:</h4>
            <div className="grid grid-cols-3 gap-3">
              {availableSyllables.map((syllable, index) => (
                <Button
                  key={`${syllable}-${index}`}
                  onClick={() => addSyllableToTrain(syllable)}
                  disabled={trainCars.length >= currentWord.syllables.length}
                  className="bg-cyan-200 hover:bg-cyan-300 text-cyan-800 font-bold text-xl py-4 rounded-xl transition-all border-2 border-cyan-400 hover:scale-105"
                >
                  {syllable}
                </Button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={checkTrain}
              disabled={!isTrainComplete()}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              <Train className="w-5 h-5 mr-2" />
              ¡A LA ESTACIÓN!
            </Button>

            <Button
              onClick={() => playTrainSound(currentWord)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              ESCUCHAR
            </Button>

            <Button
              onClick={resetTrain}
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              REINICIAR
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-blue-400 to-cyan-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/images/bebe-tiburon.png"
                  alt="BEBÉ TIBURÓN"
                  fill
                  className="object-contain animate-bounce"
                />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                🚂
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡TREN LLEGÓ A DESTINO!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ TIBURÓN ESTÁ NADANDO DE ALEGRÍA!</p>
              <p className="text-lg text-white/90">+5 CORAZONES</p>
              <div className="flex justify-center mt-4 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Heart key={i} className="w-6 h-6 text-pink-200 fill-pink-200 animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información del nivel */}
      <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-blue-300">
        <h4 className="text-lg font-bold text-blue-700 mb-2">NIVEL {level} - CIUDAD DE SÍLABAS</h4>
        <p className="text-sm text-gray-600">
          {level <= 10
            ? "PALABRAS DE 2 SÍLABAS"
            : level <= 25
              ? "PALABRAS DE 3 SÍLABAS"
              : level <= 40
                ? "PALABRAS DE 4+ SÍLABAS"
                : "PALABRAS MUY COMPLEJAS"}
        </p>
      </div>
    </div>
  )
}
