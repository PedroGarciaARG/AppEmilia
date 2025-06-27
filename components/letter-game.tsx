"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, Mic, Heart } from "lucide-react"
import Image from "next/image"

interface LetterGameProps {
  language: "es" | "en" | "both"
  onReward: (stars: number) => void
}

const lettersData = {
  es: [
    { letter: "A", word: "Abeja", image: "🐝", sound: "ah" },
    { letter: "B", word: "Bebé", image: "👶", sound: "beh" },
    { letter: "C", word: "Corazón", image: "💕", sound: "seh" },
    { letter: "D", word: "Dulce", image: "🍭", sound: "deh" },
    { letter: "E", word: "Estrella", image: "⭐", sound: "eh" },
    { letter: "F", word: "Flor", image: "🌸", sound: "efeh" },
    { letter: "L", word: "Llorar", image: "😢", sound: "eleh" },
    { letter: "M", word: "Mamá", image: "👩", sound: "emeh" },
  ],
  en: [
    { letter: "A", word: "Angel", image: "👼", sound: "ay" },
    { letter: "B", word: "Baby", image: "👶", sound: "bee" },
    { letter: "C", word: "Cry", image: "😢", sound: "see" },
    { letter: "D", word: "Dream", image: "💭", sound: "dee" },
    { letter: "E", word: "Eyes", image: "👀", sound: "ee" },
    { letter: "F", word: "Friend", image: "👫", sound: "ef" },
    { letter: "L", word: "Love", image: "💕", sound: "el" },
    { letter: "H", word: "Hug", image: "🤗", sound: "aych" },
  ],
}

export default function LetterGame({ language, onReward }: LetterGameProps) {
  const [currentLetter, setCurrentLetter] = useState(0)
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const currentData =
    language === "both" ? [...lettersData.es, ...lettersData.en] : lettersData[language] || lettersData.es

  const letter = currentData[currentLetter]

  const playSound = (text: string, lang = "es") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "es" ? "es-ES" : "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1.3
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = language === "en" ? "en-US" : "es-ES"
      recognition.continuous = false
      recognition.interimResults = false

      setIsListening(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        const targetWord = letter.word.toLowerCase()

        if (transcript.includes(targetWord) || transcript.includes(letter.letter.toLowerCase())) {
          handleCorrectAnswer()
        } else {
          playSound("¡Buaaa! ¡Inténtalo de nuevo, mi bebé!", language === "en" ? "en" : "es")
        }
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        playSound("¡Snif snif! No pude escucharte, ¡inténtalo otra vez!", language === "en" ? "en" : "es")
      }

      recognition.start()
    }
  }

  const handleCorrectAnswer = () => {
    setScore(score + 1)
    setShowSuccess(true)
    onReward(2)
    playSound(
      "¡Muy bien mi bebé! ¡Bebé Abeja está muy orgullosa de ti! ¡Buaaa de felicidad!",
      language === "en" ? "en" : "es",
    )

    setTimeout(() => {
      setShowSuccess(false)
      setCurrentLetter((prev) => (prev + 1) % currentData.length)
    }, 2500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-abeja.png" alt="Bebé Abeja" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-yellow-600 mb-2">🐝 Bebé Abeja te enseña las letras</h2>
        <p className="text-lg text-yellow-700 italic">"¡Buaaa! ¡Las letras son súper divertidas!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">Corazones: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl border-4 border-yellow-300 mb-6">
        <CardContent className="p-8 text-center">
          <div className="text-8xl mb-4 animate-pulse">{letter.image}</div>
          <div className="text-6xl font-bold text-yellow-600 mb-4 drop-shadow-lg">{letter.letter}</div>
          <div className="text-2xl font-semibold text-gray-700 mb-6 bg-white/80 rounded-full py-2 px-4">
            {letter.word}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => playSound(`${letter.letter}. ${letter.word}`, language === "en" ? "en" : "es")}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              <Volume2 className="w-6 h-6 mr-2" />
              Escuchar
            </Button>

            <Button
              onClick={startListening}
              disabled={isListening}
              className={`${
                isListening
                  ? "bg-gradient-to-r from-red-400 to-red-600 animate-pulse"
                  : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
              } text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg border-2 border-white`}
            >
              <Mic className="w-6 h-6 mr-2" />
              {isListening ? "¡Te escucho!" : "Repetir"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-pink-400 to-purple-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image src="/images/bebe-abeja.png" alt="Bebé Abeja" fill className="object-contain animate-bounce" />
              </div>
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡Excelente!</h3>
              <p className="text-xl text-white mb-2">¡Bebé Abeja está súper feliz!</p>
              <p className="text-lg text-white/90">+2 corazones</p>
              <div className="flex justify-center mt-4">
                <Heart className="w-8 h-8 text-pink-200 fill-pink-200 animate-pulse" />
                <Heart className="w-8 h-8 text-pink-200 fill-pink-200 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={() => setCurrentLetter((prev) => (prev + 1) % currentData.length)}
          className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg border-2 border-white"
        >
          Siguiente Letra →
        </Button>
      </div>
    </div>
  )
}
