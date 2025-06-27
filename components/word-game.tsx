"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, RotateCcw, Heart } from "lucide-react"
import Image from "next/image"

interface WordGameProps {
  language: "es" | "en" | "both"
  onReward: (stars: number) => void
}

const wordsData = {
  es: [
    { word: "BEBÉ", syllables: ["BE", "BÉ"], image: "👶", meaning: "UN NIÑO MUY PEQUEÑITO" },
    { word: "MAMÁ", syllables: ["MA", "MÁ"], image: "👩", meaning: "LA PERSONA QUE MÁS TE AMA" },
    { word: "PAPÁ", syllables: ["PA", "PÁ"], image: "👨", meaning: "TU HÉROE FAVORITO" },
    { word: "AMOR", syllables: ["A", "MOR"], image: "💕", meaning: "EL SENTIMIENTO MÁS BONITO" },
    { word: "CASA", syllables: ["CA", "SA"], image: "🏠", meaning: "DONDE VIVE TU FAMILIA" },
    { word: "LUNA", syllables: ["LU", "NA"], image: "🌙", meaning: "BRILLA EN LA NOCHE" },
    { word: "SOL", syllables: ["SOL"], image: "☀️", meaning: "NOS DA LUZ Y CALOR" },
    { word: "AGUA", syllables: ["A", "GUA"], image: "💧", meaning: "LA BEBEMOS PARA VIVIR" },
  ],
  en: [
    { word: "BABY", syllables: ["BA", "BY"], image: "👶", meaning: "A VERY SMALL CHILD" },
    { word: "LOVE", syllables: ["LOVE"], image: "💕", meaning: "THE MOST BEAUTIFUL FEELING" },
    { word: "HUG", syllables: ["HUG"], image: "🤗", meaning: "A WARM EMBRACE" },
    { word: "MOON", syllables: ["MOON"], image: "🌙", meaning: "SHINES AT NIGHT" },
    { word: "STAR", syllables: ["STAR"], image: "⭐", meaning: "TWINKLES IN THE SKY" },
    { word: "SUN", syllables: ["SUN"], image: "☀️", meaning: "GIVES US LIGHT AND WARMTH" },
  ],
}

export default function WordGame({ language, onReward }: WordGameProps) {
  const [currentWord, setCurrentWord] = useState(0)
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([])
  const [availableSyllables, setAvailableSyllables] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const currentData = language === "both" ? [...wordsData.es, ...wordsData.en] : wordsData[language] || wordsData.es

  const word = currentData[currentWord]

  useEffect(() => {
    resetGame()
  }, [currentWord])

  const resetGame = () => {
    setSelectedSyllables([])
    const extraSyllables = ["MI", "TI", "SO", "RI", "NO", "LA", "PE", "DO", "SI", "FA"]
    const mixed = [...word.syllables, ...extraSyllables.slice(0, 4)]
    setAvailableSyllables(mixed.sort(() => Math.random() - 0.5))
  }

  const playSound = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text.toUpperCase())
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.7
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const selectSyllable = (syllable: string, index: number) => {
    setSelectedSyllables([...selectedSyllables, syllable])
    setAvailableSyllables(availableSyllables.filter((_, i) => i !== index))
  }

  const removeSyllable = (index: number) => {
    const syllable = selectedSyllables[index]
    setAvailableSyllables([...availableSyllables, syllable])
    setSelectedSyllables(selectedSyllables.filter((_, i) => i !== index))
  }

  const checkWord = () => {
    const formedWord = selectedSyllables.join("")
    if (formedWord === word.word) {
      setScore(score + 1)
      setShowSuccess(true)
      onReward(3)
      playSound(`¡CROAC CROAC! ¡PERFECTO MI BEBÉ! ${word.word}. ${word.meaning}. ¡BEBÉ RANA ESTÁ SÚPER ORGULLOSA!`)

      setTimeout(() => {
        setShowSuccess(false)
        setCurrentWord((prev) => (prev + 1) % currentData.length)
      }, 3000)
    } else {
      playSound("¡BUAAA! BEBÉ RANA DICE: ¡INTÉNTALO DE NUEVO, TÚ PUEDES!")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-rana.png" alt="BEBÉ RANA" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          <span className="no-uppercase">🐸</span> BEBÉ RANA FORMA PALABRAS CONTIGO
        </h2>
        <p className="text-lg text-green-700 italic">"¡CROAC CROAC! ¡LAS PALABRAS SON MÁGICAS!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl border-4 border-green-300 mb-6">
        <CardContent className="p-8 text-center">
          <div className="text-8xl mb-4 animate-bounce no-uppercase" data-emoji="true">
            {word.image}
          </div>
          <p className="text-lg text-gray-600 mb-4 bg-white/80 rounded-full py-2 px-4">{word.meaning}</p>

          {/* Selected syllables area */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-6 min-h-[80px] flex items-center justify-center border-4 border-blue-200">
            <div className="flex gap-2 flex-wrap">
              {selectedSyllables.map((syllable, index) => (
                <Button
                  key={index}
                  onClick={() => removeSyllable(index)}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-2xl px-6 py-3 rounded-xl shadow-lg border-2 border-white"
                >
                  {syllable}
                </Button>
              ))}
              {selectedSyllables.length === 0 && (
                <p className="text-gray-500 text-lg font-semibold">¡TOCA LAS SÍLABAS PARA FORMAR LA PALABRA!</p>
              )}
            </div>
          </div>

          {/* Available syllables */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {availableSyllables.map((syllable, index) => (
              <Button
                key={index}
                onClick={() => selectSyllable(syllable, index)}
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold text-2xl py-4 rounded-xl transform hover:scale-105 transition-transform shadow-lg border-2 border-white"
              >
                {syllable}
              </Button>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={checkWord}
              disabled={selectedSyllables.length === 0}
              className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              ✓ VERIFICAR
            </Button>

            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              REINICIAR
            </Button>

            <Button
              onClick={() => playSound(word.word)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              ESCUCHAR
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-green-400 to-blue-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image src="/images/bebe-rana.png" alt="BEBÉ RANA" fill className="object-contain animate-bounce" />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                🎊
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡FANTÁSTICO!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ RANA ESTÁ SALTANDO DE ALEGRÍA!</p>
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
    </div>
  )
}
