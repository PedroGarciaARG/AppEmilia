"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, RotateCcw, Trophy } from "lucide-react"

interface ShapeMatchingGameProps {
  language: "es" | "en" | "both"
  onReward: (coins: number) => void
}

interface Shape {
  id: string
  type: "circle" | "square" | "triangle" | "star" | "heart"
  color: string
  size: number
  matched: boolean
}

const shapeTypes = ["circle", "square", "triangle", "star", "heart"]
const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]

export default function ShapeMatchingGame({ language, onReward }: ShapeMatchingGameProps) {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [shadows, setShadows] = useState<Shape[]>([])
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [totalCoins, setTotalCoins] = useState(0)

  const generateShapes = () => {
    const shapesToGenerate = Math.min(3 + level, 8)
    const newShapes: Shape[] = []
    const newShadows: Shape[] = []

    for (let i = 0; i < shapesToGenerate; i++) {
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 60 + Math.random() * 40

      const shape: Shape = {
        id: `shape-${i}`,
        type: shapeType as any,
        color,
        size,
        matched: false,
      }

      const shadow: Shape = {
        id: `shadow-${i}`,
        type: shapeType as any,
        color: "#E0E0E0",
        size,
        matched: false,
      }

      newShapes.push(shape)
      newShadows.push(shadow)
    }

    // Mezclar las formas
    const shuffledShapes = [...newShapes].sort(() => Math.random() - 0.5)
    const shuffledShadows = [...newShadows].sort(() => Math.random() - 0.5)

    setShapes(shuffledShapes)
    setShadows(shuffledShadows)
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTotalCoins(0)
    setGameCompleted(false)
    generateShapes()
  }

  const handleDragStart = (shape: Shape) => {
    if (shape.matched) return
    setDraggedShape(shape)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (shadow: Shape) => {
    if (!draggedShape || shadow.matched) return

    if (draggedShape.type === shadow.type && draggedShape.size === shadow.size) {
      // ¡Coincidencia!
      const newShapes = shapes.map((s) => (s.id === draggedShape.id ? { ...s, matched: true } : s))
      const newShadows = shadows.map((s) => (s.id === shadow.id ? { ...s, matched: true } : s))

      setShapes(newShapes)
      setShadows(newShadows)
      setScore(score + 1)

      const coins = 8
      setTotalCoins(totalCoins + coins)
      onReward(coins)

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("¡Buaaa de felicidad! ¡Forma correcta!")
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.4
        speechSynthesis.speak(utterance)
      }

      // Verificar si el nivel está completo
      if (newShapes.every((s) => s.matched)) {
        setTimeout(() => {
          const bonusCoins = level * 5
          setTotalCoins(totalCoins + coins + bonusCoins)
          onReward(bonusCoins)
          setGameCompleted(true)

          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
              `¡NIVEL ${level} COMPLETADO! ¡GANASTE ${totalCoins + coins + bonusCoins} MONEDAS!`,
            )
            utterance.lang = "es-ES"
            utterance.rate = 0.8
            utterance.pitch = 1.3
            speechSynthesis.speak(utterance)
          }
        }, 1000)
      }
    }

    setDraggedShape(null)
  }

  const nextLevel = () => {
    setLevel(level + 1)
    setScore(0)
    setGameCompleted(false)
    generateShapes()
  }

  const resetGame = () => {
    setLevel(1)
    setGameStarted(false)
    setScore(0)
    setTotalCoins(0)
    setGameCompleted(false)
  }

  const renderShape = (shape: Shape, isDraggable = false, isShadow = false) => {
    const style = {
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      backgroundColor: shape.color,
      opacity: shape.matched ? 0.3 : 1,
      cursor: isDraggable && !shape.matched ? "grab" : "default",
    }

    const shapeElement = (() => {
      switch (shape.type) {
        case "circle":
          return <div className="rounded-full" style={style} />
        case "square":
          return <div className="rounded-lg" style={style} />
        case "triangle":
          return (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
                opacity: shape.matched ? 0.3 : 1,
              }}
            />
          )
        case "star":
          return (
            <div
              className="relative"
              style={{
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                opacity: shape.matched ? 0.3 : 1,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  backgroundColor: shape.color,
                }}
              />
            </div>
          )
        case "heart":
          return (
            <div
              className="relative"
              style={{
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                opacity: shape.matched ? 0.3 : 1,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: shape.color,
                  transform: "rotate(-45deg)",
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                }}
              />
            </div>
          )
        default:
          return <div style={style} />
      }
    })()

    return (
      <div
        draggable={isDraggable && !shape.matched}
        onDragStart={() => isDraggable && handleDragStart(shape)}
        onDragOver={isShadow ? handleDragOver : undefined}
        onDrop={isShadow ? () => handleDrop(shape) : undefined}
        className={`flex items-center justify-center p-2 ${
          isShadow ? "border-2 border-dashed border-gray-400 rounded-lg" : ""
        } ${shape.matched ? "animate-pulse" : ""}`}
      >
        {shapeElement}
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-br from-orange-100 to-red-200 border-4 border-orange-300">
          <CardHeader>
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              🔍
            </div>
            <CardTitle className="text-3xl font-bold text-orange-600">ENCAJAR FORMAS</CardTitle>
            <p className="text-xl text-red-600">¡ARRASTRA FORMAS A SUS SOMBRAS!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange-600 mb-4">¿CÓMO JUGAR?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    👆
                  </div>
                  <p className="font-semibold">ARRASTRA FORMAS</p>
                  <p className="text-gray-600">Desde la parte superior</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🎯
                  </div>
                  <p className="font-semibold">ENCUENTRA LA SOMBRA</p>
                  <p className="text-gray-600">Misma forma y tamaño</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🪙
                  </div>
                  <p className="font-semibold">GANA MONEDAS</p>
                  <p className="text-gray-600">8 monedas por forma</p>
                </div>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg"
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
        <h2 className="text-3xl font-bold text-orange-600 mb-2">
          <span className="no-uppercase">🔍</span> ENCAJAR FORMAS - NIVEL {level}
        </h2>
        <div className="flex justify-center items-center gap-4 mb-4">
          <Badge className="bg-orange-400 text-white text-lg px-4 py-2">
            FORMAS: {score}/{shapes.length}
          </Badge>
          <Badge className="bg-yellow-400 text-white text-lg px-4 py-2">
            <Coins className="w-4 h-4 mr-1" />
            {totalCoins} MONEDAS
          </Badge>
        </div>
      </div>

      {/* Formas para arrastrar */}
      <Card className="mb-6 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-600 text-center">ARRASTRA ESTAS FORMAS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            {shapes.map((shape) => (
              <div key={shape.id} className={shape.matched ? "opacity-30" : ""}>
                {renderShape(shape, true)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sombras para soltar */}
      <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-600 text-center">
            SUELTA AQUÍ LAS FORMAS CORRECTAS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            {shadows.map((shadow) => (
              <div key={shadow.id}>{renderShape(shadow, false, true)}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      {gameCompleted && (
        <div className="text-center mt-8">
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-4 border-yellow-400 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                🎉
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">¡NIVEL COMPLETADO!</h3>
              <p className="text-lg text-yellow-700 mb-4">¡Todas las formas encajadas perfectamente!</p>
              <Badge className="bg-yellow-500 text-white text-xl px-6 py-3 mb-6">
                <Coins className="w-5 h-5 mr-2" />
                TOTAL: {totalCoins} MONEDAS
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
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl"
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
