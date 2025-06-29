"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, RotateCcw, Trophy } from "lucide-react"
import Image from "next/image"

interface MemoryGameProps {
  language: "es" | "en" | "both"
  onReward: (coins: number) => void
}

interface GameCard {
  id: number
  image: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

const babyCards = [
  { image: "/images/bebe-abeja.png", name: "ABEJA" },
  { image: "/images/bebe-rana.png", name: "RANA" },
  { image: "/images/bebe-conejo.png", name: "CONEJO" },
  { image: "/images/bebe-elefante.png", name: "ELEFANTE" },
  { image: "/images/bebe-astronauta.png", name: "ASTRONAUTA" },
  { image: "/images/bebe-tiburon.png", name: "TIBURÓN" },
  { image: "/images/bebe-dinosaurio.png", name: "DINOSAURIO" },
  { image: "/images/bebe-raton.png", name: "RATÓN" },
  { image: "/images/bebe-pollo.png", name: "POLLO" },
]

export default function MemoryGame({ language, onReward }: MemoryGameProps) {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [level, setLevel] = useState(1)
  const [coinsEarned, setCoinsEarned] = useState(0)

  const initializeGame = () => {
    const pairsToUse = Math.min(4 + level, babyCards.length)
    const selectedBabies = babyCards.slice(0, pairsToUse)
    const gameCards: GameCard[] = []

    selectedBabies.forEach((baby, index) => {
      gameCards.push(
        {
          id: index * 2,
          image: baby.image,
          name: baby.name,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: index * 2 + 1,
          image: baby.image,
          name: baby.name,
          isFlipped: false,
          isMatched: false,
        },
      )
    })

    // Mezclar cartas
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameStarted(true)
    setGameCompleted(false)
    setCoinsEarned(0)
  }

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameCompleted) return
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    if (cards.find((card) => card.id === cardId)?.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Voltear la carta
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((card) => card.id === firstId)
      const secondCard = cards.find((card) => card.id === secondId)

      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        // ¡Pareja encontrada!
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card,
            ),
          )
          setMatchedPairs(matchedPairs + 1)
          setFlippedCards([])

          // Verificar si el juego está completo
          const totalPairs = Math.min(4 + level, babyCards.length)
          if (matchedPairs + 1 === totalPairs) {
            const reward = 10 + level * 5
            setCoinsEarned(reward)
            onReward(reward)
            setGameCompleted(true)

            if ("speechSynthesis" in window) {
              const utterance = new SpeechSynthesisUtterance(
                `¡BUAAA DE FELICIDAD! ¡COMPLETASTE EL NIVEL ${level} Y GANASTE ${reward} MONEDAS!`,
              )
              utterance.lang = "es-ES"
              utterance.rate = 0.8
              utterance.pitch = 1.3
              speechSynthesis.speak(utterance)
            }
          }
        }, 1000)
      } else {
        // No coinciden
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  const nextLevel = () => {
    setLevel(level + 1)
    initializeGame()
  }

  const resetGame = () => {
    setLevel(1)
    initializeGame()
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-br from-blue-100 to-purple-200 border-4 border-blue-300">
          <CardHeader>
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              🧠
            </div>
            <CardTitle className="text-3xl font-bold text-blue-600">JUEGO DE MEMORIA</CardTitle>
            <p className="text-xl text-purple-600">¡ENCUENTRA PAREJAS DE BEBÉS LLORONES!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-4">¿CÓMO JUGAR?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    👆
                  </div>
                  <p className="font-semibold">TOCA LAS CARTAS</p>
                  <p className="text-gray-600">Para voltearlas</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    👀
                  </div>
                  <p className="font-semibold">ENCUENTRA PAREJAS</p>
                  <p className="text-gray-600">Mismos bebés llorones</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🪙
                  </div>
                  <p className="font-semibold">GANA MONEDAS</p>
                  <p className="text-gray-600">10+ monedas por nivel</p>
                </div>
              </div>
            </div>

            <Button
              onClick={initializeGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg"
            >
              <Trophy className="w-6 h-6 mr-2" />
              ¡EMPEZAR NIVEL {level}!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">
          <span className="no-uppercase">🧠</span> JUEGO DE MEMORIA - NIVEL {level}
        </h2>
        <div className="flex justify-center items-center gap-4 mb-4">
          <Badge className="bg-blue-400 text-white text-lg px-4 py-2">MOVIMIENTOS: {moves}</Badge>
          <Badge className="bg-green-400 text-white text-lg px-4 py-2">
            PAREJAS: {matchedPairs}/{Math.min(4 + level, babyCards.length)}
          </Badge>
          {coinsEarned > 0 && (
            <Badge className="bg-yellow-400 text-white text-lg px-4 py-2">
              <Coins className="w-4 h-4 mr-1" />+{coinsEarned}
            </Badge>
          )}
        </div>
      </div>

      <div
        className={`grid gap-4 justify-center ${
          cards.length <= 8
            ? "grid-cols-4"
            : cards.length <= 12
              ? "grid-cols-4 md:grid-cols-6"
              : "grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
        }`}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-24 h-32 cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? "bg-gradient-to-br from-pink-200 to-purple-300 border-pink-400"
                : "bg-gradient-to-br from-gray-200 to-gray-400 border-gray-500 hover:scale-105"
            } border-4 shadow-lg`}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="p-2 h-full flex flex-col items-center justify-center">
              {card.isFlipped || card.isMatched ? (
                <>
                  <div className="relative w-12 h-12 mb-2">
                    <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-contain" />
                  </div>
                  <p className="text-xs font-bold text-purple-600 text-center">{card.name}</p>
                </>
              ) : (
                <div className="text-4xl no-uppercase" data-emoji="true">
                  ❓
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {gameCompleted && (
        <div className="text-center mt-8">
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-4 border-yellow-400 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                🎉
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">¡NIVEL COMPLETADO!</h3>
              <p className="text-lg text-yellow-700 mb-4">Completaste en {moves} movimientos</p>
              <Badge className="bg-yellow-500 text-white text-xl px-6 py-3 mb-6">
                <Coins className="w-5 h-5 mr-2" />+{coinsEarned} MONEDAS
              </Badge>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={nextLevel}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl"
                >
                  SIGUIENTE NIVEL
                </Button>
                <Button
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  REINICIAR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
