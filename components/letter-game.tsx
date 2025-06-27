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
    { letter: "A", word: "ABEJA", image: "🐝", sound: "AH" },
    { letter: "B", word: "BEBÉ", image: "👶", sound: "BEH" },
    { letter: "C", word: "CORAZÓN", image: "💕", sound: "SEH" },
    { letter: "D", word: "DULCE", image: "🍭", sound: "DEH" },
    { letter: "E", word: "ESTRELLA", image: "⭐", sound: "EH" },
    { letter: "F", word: "FLOR", image: "🌸", sound: "EFEH" },
    { letter: "L", word: "LLORAR", image: "😢", sound: "ELEH" },
    { letter: "M", word: "MAMÁ", image: "👩", sound: "EMEH" },
    { letter: "P", word: "PAPÁ", image: "👨", sound: "PEH" },
    { letter: "S", word: "SOL", image: "☀️", sound: "ESEH" },
  ],
  en: [
    { letter: "A", word: "ANGEL", image: "👼", sound: "AY" },
    { letter: "B", word: "BABY", image: "👶", sound: "BEE" },
    { letter: "C", word: "CRY", image: "😢", sound: "SEE" },
    { letter: "D", word: "DREAM", image: "💭", sound: "DEE" },
    { letter: "E", word: "EYES", image: "👀", sound: "EE" },
    { letter: "F", word: "FRIEND", image: "👫", sound: "EF" },
    { letter: "L", word: "LOVE", image: "💕", sound: "EL" },
    { letter: "H", word: "HUG", image: "🤗", sound: "AYCH" },
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
      const utterance = new SpeechSynthesisUtterance(text.toUpperCase())
      utterance.lang = lang === "es" ? "es-ES" : "en-US"
      utterance.rate = 0.7
      utterance.pitch = 1.2
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
          playSound("¡BUAAA! ¡INTÉNTALO DE NUEVO, MI BEBÉ!", language === "en" ? "en" : "es")
        }
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        playSound("¡SNIF SNIF! NO PUDE ESCUCHARTE, ¡INTÉNTALO OTRA VEZ!", language === "en" ? "en" : "es")
      }

      recognition.start()
    }
  }

  const handleCorrectAnswer = () => {
    setScore(score + 1)
    setShowSuccess(true)
    onReward(2)
    playSound(
      "¡MUY BIEN MI BEBÉ! ¡BEBÉ ABEJA ESTÁ MUY ORGULLOSA DE TI! ¡BUAAA DE FELICIDAD!",
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
          <Image src="/images/bebe-abeja.png" alt="BEBÉ ABEJA" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-yellow-600 mb-2">
          <span className="no-uppercase">🐝</span> BEBÉ ABEJA TE ENSEÑA LAS LETRAS
        </h2>
        <p className="text-lg text-yellow-700 italic">"¡BUAAA! ¡LAS LETRAS SON SÚPER DIVERTIDAS!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl border-4 border-yellow-300 mb-6">
        <CardContent className="p-8 text-center">
          <div className="text-8xl mb-4 animate-pulse no-uppercase" data-emoji="true">
            {letter.image}
          </div>
          <div className="text-8xl font-bold text-yellow-600 mb-4 drop-shadow-lg">{letter.letter}</div>
          <div className="text-3xl font-semibold text-gray-700 mb-6 bg-white/80 rounded-full py-3 px-6">
            {letter.word}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => playSound(`${letter.letter}. ${letter.word}`, language === "en" ? "en" : "es")}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              <Volume2 className="w-6 h-6 mr-2" />
              ESCUCHAR
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
              {isListening ? "¡TE ESCUCHO!" : "REPETIR"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-pink-400 to-purple-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image src="/images/bebe-abeja.png" alt="BEBÉ ABEJA" fill className="object-contain animate-bounce" />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                🎉
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡EXCELENTE!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ ABEJA ESTÁ SÚPER FELIZ!</p>
              <p className="text-lg text-white/90">+2 CORAZONES</p>
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
          SIGUIENTE LETRA →
        </Button>
      </div>
    </div>
  )
}
