"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Music, Heart } from "lucide-react"
import Image from "next/image"

interface SongTimeProps {
  language: "es" | "en" | "both"
  onReward: (stars: number) => void
}

const songs = {
  es: [
    {
      title: "La Canción de los Bebés Llorones",
      lyrics: [
        { line: "Buaaa, buaaa, los bebés lloran", highlight: "bebés", emoji: "👶" },
        { line: "Pero sus lágrimas son de amor", highlight: "amor", emoji: "💕" },
        { line: "Snif, snif, no hay que temer", highlight: "temer", emoji: "🤗" },
        { line: "Llorar es natural, hay que entender", highlight: "natural", emoji: "🌈" },
        { line: "¡Todos los bebés son especiales!", highlight: "especiales", emoji: "⭐" },
        { line: "¡Con sus lágrimas mágicas!", highlight: "mágicas", emoji: "✨" },
      ],
    },
    {
      title: "El ABC de los Bebés Espaciales",
      lyrics: [
        { line: "A de Astronauta bebé llorón", highlight: "Astronauta", emoji: "🚀" },
        { line: "B de Buaaa en el espacio", highlight: "Buaaa", emoji: "👶" },
        { line: "C de Cohete que va volando", highlight: "Cohete", emoji: "🚀" },
        { line: "D de Dulces sueños estelares", highlight: "Dulces", emoji: "🌟" },
        { line: "¡Bebé Astronauta nos lleva al cielo!", highlight: "cielo", emoji: "🌌" },
        { line: "¡Con lágrimas de estrella!", highlight: "estrella", emoji: "⭐" },
      ],
    },
    {
      title: "Los Animalitos Bebés",
      lyrics: [
        { line: "Bebé Rana dice croac, croac", highlight: "Rana", emoji: "🐸" },
        { line: "Bebé Abeja hace bzz, bzz", highlight: "Abeja", emoji: "🐝" },
        { line: "Bebé Conejo salta hop, hop", highlight: "Conejo", emoji: "🐰" },
        { line: "Bebé Dálmata ladra guau, guau", highlight: "Dálmata", emoji: "🐶" },
        { line: "¡Todos juntos cantamos!", highlight: "cantamos", emoji: "🎵" },
        { line: "¡Buaaa, buaaa de alegría!", highlight: "alegría", emoji: "🎉" },
      ],
    },
  ],
  en: [
    {
      title: "The Crying Babies Song",
      lyrics: [
        { line: "Waaah, waaah, babies cry", highlight: "cry", emoji: "👶" },
        { line: "But their tears are full of love", highlight: "love", emoji: "💕" },
        { line: "Sniff, sniff, don't be afraid", highlight: "afraid", emoji: "🤗" },
        { line: "Crying is okay, it's how we're made", highlight: "okay", emoji: "🌈" },
        { line: "All babies are special and bright!", highlight: "special", emoji: "⭐" },
        { line: "With their magical tears of light!", highlight: "magical", emoji: "✨" },
      ],
    },
  ],
}

export default function SongTime({ language, onReward }: SongTimeProps) {
  const [currentSong, setCurrentSong] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const [isSinging, setIsSinging] = useState(false)
  const [highlightedWord, setHighlightedWord] = useState("")

  const currentData = language === "both" ? [...songs.es, ...songs.en] : songs[language] || songs.es

  const song = currentData[currentSong]

  const singLine = (lineIndex: number) => {
    if ("speechSynthesis" in window) {
      const line = song.lyrics[lineIndex]
      setHighlightedWord(line.highlight)

      const utterance = new SpeechSynthesisUtterance(line.line)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.6
      utterance.pitch = 1.4

      utterance.onend = () => {
        setHighlightedWord("")
        setTimeout(() => {
          if (lineIndex < song.lyrics.length - 1) {
            setCurrentLine(lineIndex + 1)
            singLine(lineIndex + 1)
          } else {
            setIsSinging(false)
            onReward(4)
            setTimeout(() => {
              setCurrentSong((prev) => (prev + 1) % currentData.length)
              setCurrentLine(0)
            }, 2000)
          }
        }, 800)
      }

      speechSynthesis.speak(utterance)
    }
  }

  const startSong = () => {
    setIsSinging(true)
    setCurrentLine(0)
    singLine(0)
  }

  const stopSong = () => {
    speechSynthesis.cancel()
    setIsSinging(false)
    setHighlightedWord("")
  }

  const renderLineWithHighlight = (line: string, highlight: string) => {
    if (!highlight || !highlightedWord) return line

    const parts = line.split(new RegExp(`(${highlight})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 px-2 py-1 rounded-lg font-bold animate-pulse text-lg">
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
          <Image
            src="/images/bebe-astronauta.png"
            alt="Bebé Astronauta"
            fill
            className="object-contain animate-bounce"
          />
        </div>
        <h2 className="text-3xl font-bold text-blue-600 mb-2">🚀 Bebé Astronauta canta en el espacio</h2>
        <p className="text-lg text-blue-700 italic">"¡Uaaa! ¡Vamos a cantar entre las estrellas!"</p>
        <h3 className="text-xl font-semibold text-purple-500 mt-4">{song.title}</h3>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl border-4 border-blue-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl animate-bounce">🎤</div>
          </div>

          <div className="space-y-4 mb-8">
            {song.lyrics.map((lyric, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 ${
                  index === currentLine && isSinging
                    ? "bg-gradient-to-r from-yellow-200 to-orange-200 scale-105 shadow-lg border-yellow-400"
                    : index <= currentLine
                      ? "bg-white/80 border-blue-200"
                      : "bg-gray-100/50 border-gray-200"
                }`}
              >
                <div className="text-3xl">{lyric.emoji}</div>
                <div className="flex-1">
                  <p
                    className={`text-lg ${
                      index === currentLine && isSinging ? "font-bold text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {index === currentLine && isSinging
                      ? renderLineWithHighlight(lyric.line, lyric.highlight)
                      : lyric.line}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={isSinging ? stopSong : startSong}
              className={`${
                isSinging
                  ? "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700"
                  : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
              } text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg border-2 border-white`}
            >
              {isSinging ? (
                <>
                  <Pause className="w-6 h-6 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-2" />
                  Cantar
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setCurrentSong((prev) => (prev + 1) % currentData.length)
                setCurrentLine(0)
                stopSong()
              }}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg border-2 border-white"
            >
              <Music className="w-6 h-6 mr-2" />
              Nueva Canción
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {song.lyrics.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index <= currentLine ? "bg-blue-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {currentLine === song.lyrics.length - 1 && !isSinging && (
        <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-blue-300">
          <div className="animate-bounce text-4xl mb-2">🎊</div>
          <p className="text-lg font-semibold text-blue-600">¡Canción completada! +4 corazones</p>
          <div className="flex justify-center mt-2 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Heart key={i} className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
