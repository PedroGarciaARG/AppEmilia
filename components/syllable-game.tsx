"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, RotateCcw, Heart, Lightbulb } from "lucide-react"
import Image from "next/image"

interface SyllableGameProps {
  language: "es" | "en" | "both"
  level: number
  onReward: (stars: number) => void
}

const consonants = [
  "B",
  "C",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]
const vowels = ["A", "E", "I", "O", "U"]

const syllableData = {
  es: {
    // Niveles 1-10: Sílabas simples CV (Consonante-Vocal)
    basic: [
      { consonant: "M", vowel: "A", syllable: "MA", words: ["MAMÁ", "MASA", "MAPA"], meaning: "SONIDO SUAVE Y DULCE" },
      { consonant: "P", vowel: "A", syllable: "PA", words: ["PAPÁ", "PATO", "PASO"], meaning: "SONIDO FUERTE Y CLARO" },
      { consonant: "S", vowel: "A", syllable: "SA", words: ["SALA", "SAPO", "SACO"], meaning: "SONIDO COMO SERPIENTE" },
      {
        consonant: "L",
        vowel: "A",
        syllable: "LA",
        words: ["LANA", "LAGO", "LATA"],
        meaning: "SONIDO LÍQUIDO Y SUAVE",
      },
      { consonant: "T", vowel: "A", syllable: "TA", words: ["TAZA", "TAPA", "TAXI"], meaning: "SONIDO SECO Y RÁPIDO" },
      { consonant: "N", vowel: "A", syllable: "NA", words: ["NANA", "NARIZ", "NADA"], meaning: "SONIDO NASAL SUAVE" },
      { consonant: "R", vowel: "A", syllable: "RA", words: ["RANA", "RATA", "RAMA"], meaning: "SONIDO VIBRANTE" },
      {
        consonant: "D",
        vowel: "A",
        syllable: "DA",
        words: ["DADO", "DAMA", "DANZA"],
        meaning: "SONIDO SUAVE CON LENGUA",
      },
      { consonant: "C", vowel: "A", syllable: "CA", words: ["CASA", "CARA", "CAMA"], meaning: "SONIDO FUERTE Y SECO" },
      { consonant: "B", vowel: "A", syllable: "BA", words: ["BABA", "BAÑO", "BALA"], meaning: "SONIDO CON LABIOS" },
    ],
    // Niveles 11-25: Diferentes vocales
    intermediate: [
      { consonant: "M", vowel: "E", syllable: "ME", words: ["MESA", "MIEL", "METRO"], meaning: "SONIDO MEDIO Y CLARO" },
      { consonant: "P", vowel: "I", syllable: "PI", words: ["PISO", "PIPA", "PIZZA"], meaning: "SONIDO AGUDO Y FINO" },
      { consonant: "S", vowel: "O", syllable: "SO", words: ["SOPA", "SOLO", "SOFÁ"], meaning: "SONIDO REDONDO" },
      { consonant: "L", vowel: "U", syllable: "LU", words: ["LUNA", "LUPA", "LUGAR"], meaning: "SONIDO PROFUNDO" },
      {
        consonant: "T",
        vowel: "E",
        syllable: "TE",
        words: ["TELA", "TECHO", "TELÉFONO"],
        meaning: "SONIDO CLARO Y MEDIO",
      },
      {
        consonant: "N",
        vowel: "I",
        syllable: "NI",
        words: ["NIÑO", "NIDO", "NIVEL"],
        meaning: "SONIDO PEQUEÑO Y AGUDO",
      },
      {
        consonant: "R",
        vowel: "O",
        syllable: "RO",
        words: ["ROSA", "ROPA", "ROBOT"],
        meaning: "SONIDO VIBRANTE REDONDO",
      },
      {
        consonant: "D",
        vowel: "U",
        syllable: "DU",
        words: ["DUDA", "DULCE", "DUCHA"],
        meaning: "SONIDO PROFUNDO Y SUAVE",
      },
      {
        consonant: "C",
        vowel: "E",
        syllable: "CE",
        words: ["CENA", "CERO", "CENTRO"],
        meaning: "SONIDO SUAVE COMO 'SE'",
      },
      {
        consonant: "B",
        vowel: "I",
        syllable: "BI",
        words: ["BICI", "BIGOTE", "BIBLIOTECA"],
        meaning: "SONIDO AGUDO CON LABIOS",
      },
    ],
    // Niveles 26-40: Sílabas complejas
    advanced: [
      {
        consonant: "BR",
        vowel: "A",
        syllable: "BRA",
        words: ["BRAZO", "BRAVO", "ABRAZO"],
        meaning: "SONIDO DOBLE FUERTE",
      },
      {
        consonant: "TR",
        vowel: "A",
        syllable: "TRA",
        words: ["TRABAJO", "TREN", "ESTRELLA"],
        meaning: "SONIDO RÁPIDO DOBLE",
      },
      {
        consonant: "PL",
        vowel: "A",
        syllable: "PLA",
        words: ["PLATO", "PLAYA", "PLANETA"],
        meaning: "SONIDO LÍQUIDO FUERTE",
      },
      {
        consonant: "CL",
        vowel: "A",
        syllable: "CLA",
        words: ["CLASE", "CLARO", "CLAVEL"],
        meaning: "SONIDO CLARO Y LÍQUIDO",
      },
      {
        consonant: "FR",
        vowel: "A",
        syllable: "FRA",
        words: ["FRASE", "FRUTA", "FRESCO"],
        meaning: "SONIDO COMO VIENTO",
      },
      {
        consonant: "GR",
        vowel: "A",
        syllable: "GRA",
        words: ["GRANDE", "GRANJA", "GRACIAS"],
        meaning: "SONIDO GRAVE Y FUERTE",
      },
      {
        consonant: "PR",
        vowel: "A",
        syllable: "PRA",
        words: ["PRADO", "PRECIO", "PRÁCTICA"],
        meaning: "SONIDO RÁPIDO Y CLARO",
      },
      {
        consonant: "DR",
        vowel: "A",
        syllable: "DRA",
        words: ["DRAGÓN", "DRAMA", "CUADRADO"],
        meaning: "SONIDO DRAMÁTICO",
      },
      {
        consonant: "FL",
        vowel: "A",
        syllable: "FLA",
        words: ["FLOR", "FLACO", "FLAUTA"],
        meaning: "SONIDO COMO SOPLO",
      },
      {
        consonant: "GL",
        vowel: "A",
        syllable: "GLA",
        words: ["GLOBO", "GLACIAR", "GLADIADOR"],
        meaning: "SONIDO LÍQUIDO GRAVE",
      },
    ],
    // Niveles 41-50: Sílabas expertas
    expert: [
      {
        consonant: "STR",
        vowel: "A",
        syllable: "STRA",
        words: ["ESTRATEGIA", "ASTRONAUTA", "ILUSTRAR"],
        meaning: "SONIDO TRIPLE COMPLEJO",
      },
      {
        consonant: "SPR",
        vowel: "A",
        syllable: "SPRA",
        words: ["SPRAY", "ESPRAY", "RESPLANDOR"],
        meaning: "SONIDO COMO ROCÍO",
      },
      {
        consonant: "SCR",
        vowel: "A",
        syllable: "SCRA",
        words: ["SCRATCH", "ESCRIBIR", "DESCRIBIR"],
        meaning: "SONIDO COMO RASGUÑO",
      },
      {
        consonant: "THR",
        vowel: "A",
        syllable: "THRA",
        words: ["EXTRA", "ABSTRACTO", "ILUSTRACIÓN"],
        meaning: "SONIDO EXPERTO",
      },
      {
        consonant: "CHR",
        vowel: "A",
        syllable: "CHRA",
        words: ["CHROME", "CRONÓMETRO", "CRÓNICA"],
        meaning: "SONIDO METÁLICO",
      },
    ],
  },
  en: {
    basic: [
      { consonant: "M", vowel: "A", syllable: "MA", words: ["MAMA", "MAP", "MAT"], meaning: "SOFT AND SWEET SOUND" },
      { consonant: "P", vowel: "A", syllable: "PA", words: ["PAPA", "PAT", "PAN"], meaning: "STRONG AND CLEAR SOUND" },
      { consonant: "S", vowel: "A", syllable: "SA", words: ["SAD", "SAT", "SAP"], meaning: "SNAKE-LIKE SOUND" },
      { consonant: "L", vowel: "A", syllable: "LA", words: ["LAP", "LAD", "LAMP"], meaning: "LIQUID AND SOFT SOUND" },
      { consonant: "T", vowel: "A", syllable: "TA", words: ["TAP", "TAG", "TAN"], meaning: "DRY AND QUICK SOUND" },
    ],
    intermediate: [
      { consonant: "M", vowel: "E", syllable: "ME", words: ["MET", "MEN", "MESS"], meaning: "MIDDLE AND CLEAR SOUND" },
      { consonant: "P", vowel: "I", syllable: "PI", words: ["PIG", "PIN", "PIT"], meaning: "HIGH AND THIN SOUND" },
      { consonant: "S", vowel: "O", syllable: "SO", words: ["SOB", "SOD", "SON"], meaning: "ROUND SOUND" },
      { consonant: "L", vowel: "U", syllable: "LU", words: ["LUG", "LUNCH", "LUCK"], meaning: "DEEP SOUND" },
    ],
    advanced: [
      {
        consonant: "BR",
        vowel: "A",
        syllable: "BRA",
        words: ["BRAVE", "BRAND", "BRANCH"],
        meaning: "DOUBLE STRONG SOUND",
      },
      {
        consonant: "TR",
        vowel: "A",
        syllable: "TRA",
        words: ["TRAIN", "TRACK", "TRAVEL"],
        meaning: "QUICK DOUBLE SOUND",
      },
      {
        consonant: "PL",
        vowel: "A",
        syllable: "PLA",
        words: ["PLAY", "PLAN", "PLANT"],
        meaning: "LIQUID STRONG SOUND",
      },
    ],
    expert: [
      {
        consonant: "STR",
        vowel: "A",
        syllable: "STRA",
        words: ["STRATEGY", "STRANGE", "STRAIGHT"],
        meaning: "TRIPLE COMPLEX SOUND",
      },
    ],
  },
}

export default function SyllableGame({ language, level, onReward }: SyllableGameProps) {
  const [selectedConsonant, setSelectedConsonant] = useState<string>("")
  const [selectedVowel, setSelectedVowel] = useState<string>("")
  const [formedSyllable, setFormedSyllable] = useState<string>("")
  const [currentChallenge, setCurrentChallenge] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [availableConsonants, setAvailableConsonants] = useState<string[]>([])
  const [availableVowels, setAvailableVowels] = useState<string[]>([])

  const currentData = language === "both" ? syllableData.es : syllableData[language] || syllableData.es

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

    // Generar consonantes y vocales disponibles
    const extraConsonants = consonants.filter((c) => c !== challenge.consonant).slice(0, 5)
    const extraVowels = vowels.filter((v) => v !== challenge.vowel).slice(0, 3)

    setAvailableConsonants([challenge.consonant, ...extraConsonants].sort(() => Math.random() - 0.5))
    setAvailableVowels([challenge.vowel, ...extraVowels].sort(() => Math.random() - 0.5))

    resetSelection()
  }

  const resetSelection = () => {
    setSelectedConsonant("")
    setSelectedVowel("")
    setFormedSyllable("")
    setShowHint(false)
  }

  const selectConsonant = (consonant: string) => {
    setSelectedConsonant(consonant)
    if (selectedVowel) {
      const syllable = consonant + selectedVowel
      setFormedSyllable(syllable)
      playSyllable(syllable)
    }
  }

  const selectVowel = (vowel: string) => {
    setSelectedVowel(vowel)
    if (selectedConsonant) {
      const syllable = selectedConsonant + vowel
      setFormedSyllable(syllable)
      playSyllable(syllable)
    }
  }

  const playSyllable = (syllable: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(syllable)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.5
      utterance.pitch = 1.3
      speechSynthesis.speak(utterance)
    }
  }

  const playMeaning = (meaning: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(meaning)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.7
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const checkAnswer = () => {
    if (formedSyllable === currentChallenge.syllable) {
      setScore(score + 1)
      setShowSuccess(true)
      onReward(3)

      // Agregar progreso al sistema de niveles
      if ((window as any).addLevelProgress) {
        ;(window as any).addLevelProgress()
      }

      playSyllable(`¡EXCELENTE! ${formedSyllable}. ${currentChallenge.meaning}`)

      setTimeout(() => {
        setShowSuccess(false)
        generateChallenge()
      }, 3000)
    } else {
      playSyllable("¡BUAAA! BEBÉ ELEFANTE DICE: ¡INTÉNTALO DE NUEVO!")
      setTimeout(() => {
        resetSelection()
      }, 1000)
    }
  }

  const showHintFunction = () => {
    setShowHint(true)
    playSyllable(
      `PISTA: NECESITAS ${currentChallenge.consonant} MÁS ${currentChallenge.vowel} PARA HACER ${currentChallenge.syllable}`,
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-elefante.png" alt="BEBÉ ELEFANTE" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-gray-600 mb-2">
          <span className="no-uppercase">🐘</span> BEBÉ ELEFANTE ENSEÑA SÍLABAS
        </h2>
        <p className="text-lg text-gray-700 italic">"¡PRRR! ¡VAMOS A UNIR SONIDOS MÁGICOS!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      {currentChallenge && (
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 shadow-2xl border-4 border-gray-300 mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">FORMA LA SÍLABA:</h3>
              <div className="text-6xl font-bold text-blue-600 mb-4">{currentChallenge.syllable}</div>
              <p className="text-lg text-gray-600 bg-white/80 rounded-full py-2 px-4">{currentChallenge.meaning}</p>
            </div>

            {/* Área de construcción */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 border-4 border-yellow-300">
              <h4 className="text-xl font-bold text-center text-orange-700 mb-4">CONSTRUYE TU SÍLABA:</h4>
              <div className="flex justify-center items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center text-3xl font-bold ${
                    selectedConsonant ? "bg-blue-400 text-white border-blue-500" : "bg-white border-gray-300"
                  }`}
                >
                  {selectedConsonant || "?"}
                </div>
                <div className="text-4xl font-bold text-orange-600">+</div>
                <div
                  className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center text-3xl font-bold ${
                    selectedVowel ? "bg-red-400 text-white border-red-500" : "bg-white border-gray-300"
                  }`}
                >
                  {selectedVowel || "?"}
                </div>
                <div className="text-4xl font-bold text-orange-600">=</div>
                <div
                  className={`w-24 h-20 rounded-xl border-4 flex items-center justify-center text-2xl font-bold ${
                    formedSyllable ? "bg-green-400 text-white border-green-500" : "bg-white border-gray-300"
                  }`}
                >
                  {formedSyllable || "??"}
                </div>
              </div>
            </div>

            {/* Consonantes */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-blue-600 mb-3 text-center">ELIGE UNA CONSONANTE:</h4>
              <div className="grid grid-cols-3 gap-3">
                {availableConsonants.map((consonant, index) => (
                  <Button
                    key={index}
                    onClick={() => selectConsonant(consonant)}
                    className={`${
                      selectedConsonant === consonant
                        ? "bg-blue-500 text-white scale-110"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    } font-bold text-2xl py-4 rounded-xl transition-all border-2 border-blue-300`}
                  >
                    {consonant}
                  </Button>
                ))}
              </div>
            </div>

            {/* Vocales */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-red-600 mb-3 text-center">ELIGE UNA VOCAL:</h4>
              <div className="grid grid-cols-5 gap-3">
                {availableVowels.map((vowel, index) => (
                  <Button
                    key={index}
                    onClick={() => selectVowel(vowel)}
                    className={`${
                      selectedVowel === vowel
                        ? "bg-red-500 text-white scale-110"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    } font-bold text-2xl py-4 rounded-xl transition-all border-2 border-red-300`}
                  >
                    {vowel}
                  </Button>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={checkAnswer}
                disabled={!formedSyllable}
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg border-2 border-white"
              >
                ✓ VERIFICAR
              </Button>

              <Button
                onClick={() => playSyllable(formedSyllable)}
                disabled={!formedSyllable}
                className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                ESCUCHAR
              </Button>

              <Button
                onClick={showHintFunction}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                PISTA
              </Button>

              <Button
                onClick={resetSelection}
                className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                LIMPIAR
              </Button>
            </div>

            {/* Palabras de ejemplo */}
            {showHint && (
              <div className="mt-6 bg-white/90 rounded-2xl p-4 border-2 border-yellow-300">
                <h5 className="text-lg font-bold text-yellow-700 mb-2 text-center">
                  PALABRAS CON {currentChallenge.syllable}:
                </h5>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentChallenge.words.map((word: string, index: number) => (
                    <Button
                      key={index}
                      onClick={() => playSyllable(word)}
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold px-4 py-2 rounded-xl border border-yellow-300"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-green-400 to-blue-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/images/bebe-elefante.png"
                  alt="BEBÉ ELEFANTE"
                  fill
                  className="object-contain animate-bounce"
                />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                🎊
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡PERFECTO!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ ELEFANTE ESTÁ TROMPETEANDO DE ALEGRÍA!</p>
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
      <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-gray-300">
        <h4 className="text-lg font-bold text-gray-700 mb-2">NIVEL {level} - SÍLABAS</h4>
        <p className="text-sm text-gray-600">
          {level <= 10
            ? "SÍLABAS BÁSICAS (CV)"
            : level <= 25
              ? "DIFERENTES VOCALES"
              : level <= 40
                ? "SÍLABAS COMPLEJAS"
                : "SÍLABAS EXPERTAS"}
        </p>
      </div>
    </div>
  )
}
