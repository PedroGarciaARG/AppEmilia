"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, RotateCcw, Heart } from "lucide-react"
import Image from "next/image"

interface FarmLettersGameProps {
  language: "es" | "en" | "both"
  level: number
  onReward: (stars: number) => void
}

const farmWordsData = {
  es: {
    // Niveles 1-10: Palabras de 3 letras
    basic: [
      { word: "SOL", letters: ["S", "O", "L"], image: "☀️", sound: "¡BRILLA EL SOL!", meaning: "DA LUZ Y CALOR" },
      { word: "MAR", letters: ["M", "A", "R"], image: "🌊", sound: "¡SPLASH DEL MAR!", meaning: "AGUA AZUL GRANDE" },
      { word: "PAN", letters: ["P", "A", "N"], image: "🍞", sound: "¡RICO PAN!", meaning: "COMIDA DELICIOSA" },
      { word: "OSO", letters: ["O", "S", "O"], image: "🐻", sound: "¡GRRR DEL OSO!", meaning: "ANIMAL PELUDO" },
      { word: "UVA", letters: ["U", "V", "A"], image: "🍇", sound: "¡DULCE UVA!", meaning: "FRUTA MORADA" },
      { word: "PIE", letters: ["P", "I", "E"], image: "🦶", sound: "¡CAMINA EL PIE!", meaning: "PARTE DEL CUERPO" },
      { word: "OJO", letters: ["O", "J", "O"], image: "👁️", sound: "¡MIRA EL OJO!", meaning: "PARA VER COSAS" },
      { word: "REY", letters: ["R", "E", "Y"], image: "👑", sound: "¡VIVA EL REY!", meaning: "LÍDER CON CORONA" },
      { word: "LUZ", letters: ["L", "U", "Z"], image: "💡", sound: "¡BRILLA LA LUZ!", meaning: "ILUMINA TODO" },
      { word: "VOZ", letters: ["V", "O", "Z"], image: "🗣️", sound: "¡SUENA LA VOZ!", meaning: "PARA HABLAR" },
    ],
    // Niveles 11-25: Palabras de 4 letras
    intermediate: [
      {
        word: "CASA",
        letters: ["C", "A", "S", "A"],
        image: "🏠",
        sound: "¡HOGAR DULCE CASA!",
        meaning: "DONDE VIVIMOS",
      },
      { word: "GATO", letters: ["G", "A", "T", "O"], image: "🐱", sound: "¡MIAU DEL GATO!", meaning: "MASCOTA PELUDA" },
      { word: "PATO", letters: ["P", "A", "T", "O"], image: "🦆", sound: "¡CUAC DEL PATO!", meaning: "AVE QUE NADA" },
      { word: "LUNA", letters: ["L", "U", "N", "A"], image: "🌙", sound: "¡BRILLA LA LUNA!", meaning: "LUZ DE NOCHE" },
      { word: "ROSA", letters: ["R", "O", "S", "A"], image: "🌹", sound: "¡HUELE LA ROSA!", meaning: "FLOR BONITA" },
      { word: "MESA", letters: ["M", "E", "S", "A"], image: "🪑", sound: "¡ÚTIL LA MESA!", meaning: "PARA COMER" },
      {
        word: "BOCA",
        letters: ["B", "O", "C", "A"],
        image: "👄",
        sound: "¡HABLA LA BOCA!",
        meaning: "PARA COMER Y HABLAR",
      },
      { word: "MANO", letters: ["M", "A", "N", "O"], image: "✋", sound: "¡SALUDA LA MANO!", meaning: "PARA TOCAR" },
      {
        word: "PELO",
        letters: ["P", "E", "L", "O"],
        image: "💇",
        sound: "¡SUAVE EL PELO!",
        meaning: "CRECE EN LA CABEZA",
      },
      { word: "AGUA", letters: ["A", "G", "U", "A"], image: "💧", sound: "¡FRESCA EL AGUA!", meaning: "PARA BEBER" },
    ],
    // Niveles 26-40: Palabras de 5 letras
    advanced: [
      { word: "FLOR", letters: ["F", "L", "O", "R"], image: "🌸", sound: "¡HERMOSA FLOR!", meaning: "PLANTA COLORIDA" },
      {
        word: "ÁRBOL",
        letters: ["Á", "R", "B", "O", "L"],
        image: "🌳",
        sound: "¡GRANDE ÁRBOL!",
        meaning: "PLANTA ALTA",
      },
      {
        word: "CIELO",
        letters: ["C", "I", "E", "L", "O"],
        image: "☁️",
        sound: "¡AZUL CIELO!",
        meaning: "ARRIBA DE TODO",
      },
      {
        word: "CAMPO",
        letters: ["C", "A", "M", "P", "O"],
        image: "🌾",
        sound: "¡VERDE CAMPO!",
        meaning: "LUGAR CON PLANTAS",
      },
      {
        word: "POLLO",
        letters: ["P", "O", "L", "L", "O"],
        image: "🐔",
        sound: "¡PÍO PÍO POLLO!",
        meaning: "AVE DE GRANJA",
      },
      {
        word: "CABRA",
        letters: ["C", "A", "B", "R", "A"],
        image: "🐐",
        sound: "¡BEE BEE CABRA!",
        meaning: "ANIMAL CON CUERNOS",
      },
      {
        word: "OVEJA",
        letters: ["O", "V", "E", "J", "A"],
        image: "🐑",
        sound: "¡BAA BAA OVEJA!",
        meaning: "ANIMAL LANUDO",
      },
      { word: "VACA", letters: ["V", "A", "C", "A"], image: "🐄", sound: "¡MUU MUU VACA!", meaning: "DA LECHE RICA" },
      {
        word: "CERDO",
        letters: ["C", "E", "R", "D", "O"],
        image: "🐷",
        sound: "¡OINK OINK CERDO!",
        meaning: "ANIMAL ROSADO",
      },
      {
        word: "CABALLO",
        letters: ["C", "A", "B", "A", "L", "L", "O"],
        image: "🐴",
        sound: "¡GALOPA CABALLO!",
        meaning: "ANIMAL QUE CORRE",
      },
    ],
    // Niveles 41-50: Palabras complejas
    expert: [
      {
        word: "GRANJA",
        letters: ["G", "R", "A", "N", "J", "A"],
        image: "🚜",
        sound: "¡TRABAJAR EN GRANJA!",
        meaning: "LUGAR DE ANIMALES",
      },
      {
        word: "TRACTOR",
        letters: ["T", "R", "A", "C", "T", "O", "R"],
        image: "🚜",
        sound: "¡RUUM RUUM TRACTOR!",
        meaning: "MÁQUINA DE CAMPO",
      },
      {
        word: "COSECHA",
        letters: ["C", "O", "S", "E", "C", "H", "A"],
        image: "🌾",
        sound: "¡RICA COSECHA!",
        meaning: "RECOGER PLANTAS",
      },
      {
        word: "GRANERO",
        letters: ["G", "R", "A", "N", "E", "R", "O"],
        image: "🏚️",
        sound: "¡LLENO GRANERO!",
        meaning: "CASA DE GRANOS",
      },
      {
        word: "ESTABLO",
        letters: ["E", "S", "T", "A", "B", "L", "O"],
        image: "🏠",
        sound: "¡CÁLIDO ESTABLO!",
        meaning: "CASA DE ANIMALES",
      },
    ],
  },
  en: [
    { word: "SUN", letters: ["S", "U", "N"], image: "☀️", sound: "BRIGHT SUN!", meaning: "GIVES LIGHT AND WARMTH" },
    { word: "CAT", letters: ["C", "A", "T"], image: "🐱", sound: "MEOW CAT!", meaning: "FURRY PET" },
    { word: "DOG", letters: ["D", "O", "G"], image: "🐶", sound: "WOOF DOG!", meaning: "LOYAL FRIEND" },
    { word: "COW", letters: ["C", "O", "W"], image: "🐄", sound: "MOO COW!", meaning: "GIVES MILK" },
    { word: "PIG", letters: ["P", "I", "G"], image: "🐷", sound: "OINK PIG!", meaning: "PINK ANIMAL" },
  ],
}

export default function FarmLettersGame({ language, level, onReward }: FarmLettersGameProps) {
  const [currentWord, setCurrentWord] = useState<any>(null)
  const [draggedLetters, setDraggedLetters] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [draggedPositions, setDraggedPositions] = useState<{ [key: number]: string }>({})

  const currentData = language === "both" ? farmWordsData.es : farmWordsData[language] || farmWordsData.es

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

    // Generar letras disponibles (correctas + distractoras)
    const extraLetters = ["B", "F", "H", "J", "K", "Q", "W", "X", "Y", "Z"].slice(0, 4)
    const allLetters = [...word.letters, ...extraLetters].sort(() => Math.random() - 0.5)
    setAvailableLetters(allLetters)

    resetGame()
  }

  const resetGame = () => {
    setDraggedLetters([])
    setDraggedPositions({})
  }

  const playWordSound = (word: any) => {
    if ("speechSynthesis" in window) {
      // Primero deletrear
      const spelling = word.letters.join(" - ")
      const utterance1 = new SpeechSynthesisUtterance(`${spelling}... ¡${word.word}!`)
      utterance1.lang = language === "en" ? "en-US" : "es-ES"
      utterance1.rate = 0.6
      utterance1.pitch = 1.2

      utterance1.onend = () => {
        // Luego el sonido especial
        const utterance2 = new SpeechSynthesisUtterance(word.sound)
        utterance2.lang = language === "en" ? "en-US" : "es-ES"
        utterance2.rate = 0.8
        utterance2.pitch = 1.4
        speechSynthesis.speak(utterance2)
      }

      speechSynthesis.speak(utterance1)
    }
  }

  const handleLetterDrop = (letter: string, position: number) => {
    const newPositions = { ...draggedPositions }
    newPositions[position] = letter
    setDraggedPositions(newPositions)

    // Remover letra de disponibles
    setAvailableLetters(availableLetters.filter((l, i) => l !== letter || i !== availableLetters.indexOf(letter)))
  }

  const handleLetterRemove = (position: number) => {
    const letter = draggedPositions[position]
    if (letter) {
      setAvailableLetters([...availableLetters, letter])
      const newPositions = { ...draggedPositions }
      delete newPositions[position]
      setDraggedPositions(newPositions)
    }
  }

  const checkWord = () => {
    const formedWord = currentWord.letters.map((_, index) => draggedPositions[index] || "").join("")

    if (formedWord === currentWord.word) {
      setScore(score + 1)
      setShowSuccess(true)
      onReward(4)

      // Agregar progreso al sistema de niveles
      if ((window as any).addLevelProgress) {
        ;(window as any).addLevelProgress()
      }

      playWordSound(currentWord)

      setTimeout(() => {
        setShowSuccess(false)
        generateChallenge()
      }, 4000)
    } else {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡BUAAA! BEBÉ RATÓN DICE: ¡INTÉNTALO DE NUEVO!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  const isWordComplete = () => {
    return currentWord && currentWord.letters.every((_, index) => draggedPositions[index])
  }

  if (!currentWord) return <div>Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-raton.png" alt="BEBÉ RATÓN" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-orange-600 mb-2">
          <span className="no-uppercase">🐭</span> GRANJA DE LETRAS CON BEBÉ RATÓN
        </h2>
        <p className="text-lg text-orange-700 italic">"¡SQUEAK SQUEAK! ¡VAMOS A FORMAR PALABRAS EN LA GRANJA!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 shadow-2xl border-4 border-orange-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 animate-bounce no-uppercase" data-emoji="true">
              {currentWord.image}
            </div>
            <p className="text-lg text-gray-600 bg-white/80 rounded-full py-2 px-4 mb-4">{currentWord.meaning}</p>
            <h3 className="text-2xl font-bold text-orange-700">FORMA LA PALABRA:</h3>
          </div>

          {/* Área de construcción de palabra */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-6 border-4 border-green-300">
            <div className="flex justify-center gap-2 mb-4">
              {currentWord.letters.map((letter: string, index: number) => (
                <div
                  key={index}
                  onClick={() => handleLetterRemove(index)}
                  className={`w-16 h-16 rounded-xl border-4 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all ${
                    draggedPositions[index]
                      ? "bg-green-400 text-white border-green-500 scale-110"
                      : "bg-white border-gray-300 border-dashed"
                  }`}
                >
                  {draggedPositions[index] || "?"}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">¡ARRASTRA LAS LETRAS AQUÍ!</p>
          </div>

          {/* Letras disponibles */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-orange-600 mb-3 text-center">LETRAS DISPONIBLES:</h4>
            <div className="grid grid-cols-4 gap-3">
              {availableLetters.map((letter, index) => (
                <Button
                  key={`${letter}-${index}`}
                  onClick={() => {
                    // Encontrar la primera posición vacía
                    const emptyPosition = currentWord.letters.findIndex((_: any, i: number) => !draggedPositions[i])
                    if (emptyPosition !== -1) {
                      handleLetterDrop(letter, emptyPosition)
                    }
                  }}
                  className="bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold text-2xl py-4 rounded-xl transition-all border-2 border-orange-400 hover:scale-105"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={checkWord}
              disabled={!isWordComplete()}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              ✓ VERIFICAR
            </Button>

            <Button
              onClick={() => playWordSound(currentWord)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              ESCUCHAR
            </Button>

            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              LIMPIAR
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-green-400 to-yellow-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image src="/images/bebe-raton.png" alt="BEBÉ RATÓN" fill className="object-contain animate-bounce" />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                🎉
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡EXCELENTE!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ RATÓN ESTÁ SÚPER FELIZ EN LA GRANJA!</p>
              <p className="text-lg text-white/90">+4 CORAZONES</p>
              <div className="flex justify-center mt-4 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Heart key={i} className="w-6 h-6 text-pink-200 fill-pink-200 animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información del nivel */}
      <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-orange-300">
        <h4 className="text-lg font-bold text-orange-700 mb-2">NIVEL {level} - GRANJA DE LETRAS</h4>
        <p className="text-sm text-gray-600">
          {level <= 10
            ? "PALABRAS DE 3 LETRAS"
            : level <= 25
              ? "PALABRAS DE 4 LETRAS"
              : level <= 40
                ? "PALABRAS DE 5+ LETRAS"
                : "PALABRAS COMPLEJAS DE GRANJA"}
        </p>
      </div>
    </div>
  )
}
