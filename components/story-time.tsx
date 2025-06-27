"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipForward, Heart } from "lucide-react"
import Image from "next/image"

interface StoryTimeProps {
  language: "es" | "en" | "both"
  onReward: (stars: number) => void
}

const stories = {
  es: [
    {
      title: "EL BEBÉ CONEJO Y LA LUNA MÁGICA",
      pages: [
        { text: "HABÍA UNA VEZ UN BEBÉ CONEJO MUY TIERNO QUE NO PODÍA DORMIR.", highlight: "BEBÉ", image: "🐰" },
        { text: "TODAS LAS NOCHES LLORABA PORQUE TENÍA MIEDO A LA OSCURIDAD.", highlight: "LLORABA", image: "😢" },
        { text: "SU MAMÁ LE CANTABA CANCIONES DE CUNA MUY DULCES.", highlight: "MAMÁ", image: "👩" },
        { text: "UNA NOCHE, LA LUNA BAJÓ DEL CIELO PARA CONSOLARLO.", highlight: "LUNA", image: "🌙" },
        { text: "LA LUNA LE DIJO: 'LLORAR ESTÁ BIEN, PEQUEÑO BEBÉ'.", highlight: "LLORAR", image: "💫" },
        { text: "DESDE ENTONCES, EL BEBÉ CONEJO DUERME TRANQUILO.", highlight: "TRANQUILO", image: "😴" },
      ],
    },
    {
      title: "LOS BEBÉS LLORONES Y EL ARCOÍRIS",
      pages: [
        { text: "TODOS LOS BEBÉS LLORONES ESTABAN MUY TRISTES UN DÍA.", highlight: "BEBÉS", image: "👶" },
        { text: "SUS LÁGRIMAS CAÍAN COMO GOTAS DE LLUVIA.", highlight: "LÁGRIMAS", image: "💧" },
        { text: "PERO ALGO MÁGICO PASÓ CUANDO LLORARON JUNTOS.", highlight: "MÁGICO", image: "✨" },
        { text: "SUS LÁGRIMAS SE CONVIRTIERON EN COLORES BRILLANTES.", highlight: "COLORES", image: "🌈" },
        { text: "FORMARON EL ARCOÍRIS MÁS HERMOSO DEL MUNDO.", highlight: "ARCOÍRIS", image: "🌈" },
        { text: "APRENDIERON QUE LLORAR PUEDE CREAR COSAS BELLAS.", highlight: "BELLAS", image: "💕" },
      ],
    },
  ],
  en: [
    {
      title: "THE CRYING BABY AND THE MAGIC STAR",
      pages: [
        { text: "ONCE UPON A TIME, THERE WAS A BABY WHO CRIED EVERY NIGHT.", highlight: "BABY", image: "👶" },
        { text: "A MAGIC STAR CAME DOWN TO COMFORT THE LITTLE ONE.", highlight: "STAR", image: "⭐" },
        { text: "THE STAR SAID CRYING IS OKAY AND NATURAL.", highlight: "CRYING", image: "😢" },
        { text: "IT TAUGHT THE BABY THAT TEARS CAN HEAL.", highlight: "TEARS", image: "💧" },
        { text: "FROM THAT NIGHT, THE BABY FELT LOVED AND SAFE.", highlight: "LOVED", image: "💕" },
        { text: "AND THEY LIVED HAPPILY EVER AFTER.", highlight: "HAPPILY", image: "😊" },
      ],
    },
  ],
}

export default function StoryTime({ language, onReward }: StoryTimeProps) {
  const [currentStory, setCurrentStory] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [highlightedWord, setHighlightedWord] = useState("")

  const currentData = language === "both" ? [...stories.es, ...stories.en] : stories[language] || stories.es

  const story = currentData[currentStory]
  const page = story.pages[currentPage]

  const readPage = () => {
    if ("speechSynthesis" in window) {
      setIsReading(true)
      setHighlightedWord(page.highlight)

      const utterance = new SpeechSynthesisUtterance(page.text)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.6
      utterance.pitch = 1.1

      utterance.onend = () => {
        setIsReading(false)
        setHighlightedWord("")

        setTimeout(() => {
          if (currentPage < story.pages.length - 1) {
            setCurrentPage(currentPage + 1)
          } else {
            onReward(5)
            setTimeout(() => {
              setCurrentStory((prev) => (prev + 1) % currentData.length)
              setCurrentPage(0)
            }, 2000)
          }
        }, 1000)
      }

      speechSynthesis.speak(utterance)
    }
  }

  const stopReading = () => {
    speechSynthesis.cancel()
    setIsReading(false)
    setHighlightedWord("")
  }

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      onReward(5)
      setCurrentStory((prev) => (prev + 1) % currentData.length)
      setCurrentPage(0)
    }
  }

  const renderTextWithHighlight = (text: string, highlight: string) => {
    if (!highlight || !highlightedWord) return text

    const parts = text.split(new RegExp(`(${highlight})`, "gi"))
    return parts.map((part, index) =>
      part.toUpperCase() === highlight.toUpperCase() ? (
        <span key={index} className="bg-pink-300 px-3 py-2 rounded-lg font-bold animate-pulse text-2xl">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-conejo.png" alt="BEBÉ CONEJO" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">
          <span className="no-uppercase">🐰</span> BEBÉ CONEJO CUENTA HISTORIAS MÁGICAS
        </h2>
        <p className="text-lg text-pink-700 italic">"¡SNIF SNIF! ¡ME ENCANTAN LOS CUENTOS BONITOS!"</p>
        <h3 className="text-xl font-semibold text-pink-500 mt-4">{story.title}</h3>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-sm text-gray-600 bg-white/80 rounded-full px-3 py-1">
            PÁGINA {currentPage + 1} DE {story.pages.length}
          </span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 shadow-2xl border-4 border-pink-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 animate-bounce no-uppercase" data-emoji="true">
              {page.image}
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl p-6 mb-6 border-2 border-pink-200">
            <p className="text-xl leading-relaxed text-gray-800 text-center font-medium">
              {renderTextWithHighlight(page.text, page.highlight)}
            </p>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={isReading ? stopReading : readPage}
              className={`${
                isReading
                  ? "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700"
                  : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
              } text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg border-2 border-white`}
            >
              {isReading ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  PAUSAR
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  LEER
                </>
              )}
            </Button>

            <Button
              onClick={nextPage}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              {currentPage < story.pages.length - 1 ? "SIGUIENTE" : "NUEVO CUENTO"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress bar */}
      <div className="bg-white/50 rounded-full h-4 mb-4 border-2 border-pink-200">
        <div
          className="bg-gradient-to-r from-pink-400 to-purple-400 h-4 rounded-full transition-all duration-500"
          style={{ width: `${((currentPage + 1) / story.pages.length) * 100}%` }}
        />
      </div>

      {currentPage === story.pages.length - 1 && (
        <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-pink-300">
          <div className="animate-bounce text-4xl mb-2 no-uppercase" data-emoji="true">
            🎉
          </div>
          <p className="text-lg font-semibold text-pink-600">¡HISTORIA COMPLETADA! +5 CORAZONES</p>
          <div className="flex justify-center mt-2 gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Heart key={i} className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
