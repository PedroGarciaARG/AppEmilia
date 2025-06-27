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
      title: "El Bebé Conejo y la Luna Mágica",
      pages: [
        { text: "Había una vez un bebé conejo muy tierno que no podía dormir.", highlight: "bebé", image: "🐰" },
        { text: "Todas las noches lloraba porque tenía miedo a la oscuridad.", highlight: "lloraba", image: "😢" },
        { text: "Su mamá le cantaba canciones de cuna muy dulces.", highlight: "mamá", image: "👩" },
        { text: "Una noche, la luna bajó del cielo para consolarlo.", highlight: "luna", image: "🌙" },
        { text: "La luna le dijo: 'Llorar está bien, pequeño bebé'.", highlight: "llorar", image: "💫" },
        { text: "Desde entonces, el bebé conejo duerme tranquilo.", highlight: "tranquilo", image: "😴" },
      ],
    },
    {
      title: "Los Bebés Llorones y el Arcoíris",
      pages: [
        { text: "Todos los bebés llorones estaban muy tristes un día.", highlight: "bebés", image: "👶" },
        { text: "Sus lágrimas caían como gotas de lluvia.", highlight: "lágrimas", image: "💧" },
        { text: "Pero algo mágico pasó cuando lloraron juntos.", highlight: "mágico", image: "✨" },
        { text: "Sus lágrimas se convirtieron en colores brillantes.", highlight: "colores", image: "🌈" },
        { text: "Formaron el arcoíris más hermoso del mundo.", highlight: "arcoíris", image: "🌈" },
        { text: "Aprendieron que llorar puede crear cosas bellas.", highlight: "bellas", image: "💕" },
      ],
    },
    {
      title: "El Bebé Dálmata y sus Manchitas",
      pages: [
        { text: "Un bebé dálmata lloraba porque era diferente.", highlight: "diferente", image: "🐶" },
        { text: "Sus manchitas lo hacían único y especial.", highlight: "manchitas", image: "⚫" },
        { text: "Los otros bebés lo consolaron con abrazos.", highlight: "abrazos", image: "🤗" },
        { text: "Le dijeron que ser diferente es hermoso.", highlight: "hermoso", image: "💖" },
        { text: "El bebé dálmata sonrió por primera vez.", highlight: "sonrió", image: "😊" },
        { text: "Ahora está orgulloso de sus manchitas.", highlight: "orgulloso", image: "🌟" },
      ],
    },
  ],
  en: [
    {
      title: "The Crying Baby and the Magic Star",
      pages: [
        { text: "Once upon a time, there was a baby who cried every night.", highlight: "baby", image: "👶" },
        { text: "A magic star came down to comfort the little one.", highlight: "star", image: "⭐" },
        { text: "The star said crying is okay and natural.", highlight: "crying", image: "😢" },
        { text: "It taught the baby that tears can heal.", highlight: "tears", image: "💧" },
        { text: "From that night, the baby felt loved and safe.", highlight: "loved", image: "💕" },
        { text: "And they lived happily ever after.", highlight: "happily", image: "😊" },
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
      utterance.rate = 0.7
      utterance.pitch = 1.2

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
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-pink-300 px-2 py-1 rounded-lg font-bold animate-pulse text-lg">
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
          <Image src="/images/bebe-conejo.png" alt="Bebé Conejo" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">🐰 Bebé Conejo cuenta historias mágicas</h2>
        <p className="text-lg text-pink-700 italic">"¡Snif snif! ¡Me encantan los cuentos bonitos!"</p>
        <h3 className="text-xl font-semibold text-pink-500 mt-4">{story.title}</h3>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-sm text-gray-600 bg-white/80 rounded-full px-3 py-1">
            Página {currentPage + 1} de {story.pages.length}
          </span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 shadow-2xl border-4 border-pink-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 animate-bounce">{page.image}</div>
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
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Leer
                </>
              )}
            </Button>

            <Button
              onClick={nextPage}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              {currentPage < story.pages.length - 1 ? "Siguiente" : "Nuevo Cuento"}
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
          <div className="animate-bounce text-4xl mb-2">🎉</div>
          <p className="text-lg font-semibold text-pink-600">¡Historia completada! +5 corazones</p>
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
