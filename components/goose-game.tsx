"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy } from "lucide-react"

interface GooseGameProps {
  language: "es" | "en" | "both"
  onReward: (coins: number) => void
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]

const boardSpaces = [
  { id: 0, type: "start", name: "INICIO", special: "¡EMPEZAMOS!" },
  { id: 1, type: "normal", name: "CASILLA 1", special: "" },
  { id: 2, type: "normal", name: "CASILLA 2", special: "" },
  { id: 3, type: "baby", name: "BEBÉ ABEJA", special: "¡AVANZA 2 CASILLAS!" },
  { id: 4, type: "normal", name: "CASILLA 4", special: "" },
  { id: 5, type: "trap", name: "PAÑAL SUCIO", special: "¡PIERDES 1 TURNO!" },
  { id: 6, type: "normal", name: "CASILLA 6", special: "" },
  { id: 7, type: "baby", name: "BEBÉ RANA", special: "¡SALTA 3 CASILLAS!" },
  { id: 8, type: "normal", name: "CASILLA 8", special: "" },
  { id: 9, type: "coin", name: "TESORO", special: "¡GANAS 5 MONEDAS!" },
  { id: 10, type: "normal", name: "CASILLA 10", special: "" },
  { id: 11, type: "baby", name: "BEBÉ CONEJO", special: "¡AVANZA 2 CASILLAS!" },
  { id: 12, type: "normal", name: "CASILLA 12", special: "" },
  { id: 13, type: "trap", name: "HORA DE DORMIR", special: "¡PIERDES 1 TURNO!" },
  { id: 14, type: "normal", name: "CASILLA 14", special: "" },
  { id: 15, type: "baby", name: "BEBÉ ASTRONAUTA", special: "¡VUELA 4 CASILLAS!" },
  { id: 16, type: "normal", name: "CASILLA 16", special: "" },
  { id: 17, type: "coin", name: "GRAN TESORO", special: "¡GANAS 10 MONEDAS!" },
  { id: 18, type: "normal", name: "CASILLA 18", special: "" },
  { id: 19, type: "baby", name: "BEBÉ TIBURÓN", special: "¡NADA 3 CASILLAS!" },
  { id: 20, type: "finish", name: "¡META!", special: "¡GANASTE!" },
]

export default function GooseGame({ language, onReward }: GooseGameProps) {
  const [playerPosition, setPlayerPosition] = useState(0)
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [skipTurn, setSkipTurn] = useState(false)
  const [totalCoins, setTotalCoins] = useState(0)
  const [message, setMessage] = useState("")
  const [moves, setMoves] = useState(0)

  const rollDice = () => {
    if (isRolling || gameCompleted) return
    if (skipTurn) {
      setSkipTurn(false)
      setMessage("¡YA PUEDES JUGAR DE NUEVO!")
      return
    }

    setIsRolling(true)
    setMoves(moves + 1)

    // Animación del dado
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rollCount++
      if (rollCount >= 10) {
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        movePlayer(finalValue)
        setIsRolling(false)
      }
    }, 100)
  }

  const movePlayer = (steps: number) => {
    const newPosition = Math.min(playerPosition + steps, boardSpaces.length - 1)
    setPlayerPosition(newPosition)

    const currentSpace = boardSpaces[newPosition]
    handleSpecialSpace(currentSpace)
  }

  const handleSpecialSpace = (space: (typeof boardSpaces)[0]) => {
    switch (space.type) {
      case "baby":
        if (space.name === "BEBÉ ABEJA" || space.name === "BEBÉ CONEJO") {
          const newPos = Math.min(playerPosition + 2, boardSpaces.length - 1)
          setTimeout(() => setPlayerPosition(newPos), 1000)
          setMessage(`¡${space.special}`)
        } else if (space.name === "BEBÉ RANA" || space.name === "BEBÉ TIBURÓN") {
          const newPos = Math.min(playerPosition + 3, boardSpaces.length - 1)
          setTimeout(() => setPlayerPosition(newPos), 1000)
          setMessage(`¡${space.special}`)
        } else if (space.name === "BEBÉ ASTRONAUTA") {
          const newPos = Math.min(playerPosition + 4, boardSpaces.length - 1)
          setTimeout(() => setPlayerPosition(newPos), 1000)
          setMessage(`¡${space.special}`)
        }
        break

      case "coin":
        const coins = space.name === "GRAN TESORO" ? 10 : 5
        setTotalCoins(totalCoins + coins)
        onReward(coins)
        setMessage(`¡${space.special}`)
        break

      case "trap":
        setSkipTurn(true)
        setMessage(`¡${space.special}`)
        break

      case "finish":
        const bonusCoins = Math.max(20 - moves, 5)
        setTotalCoins(totalCoins + bonusCoins)
        onReward(bonusCoins)
        setGameCompleted(true)
        setMessage(`¡COMPLETASTE EL JUEGO EN ${moves} MOVIMIENTOS! +${bonusCoins} MONEDAS BONUS`)

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(
            `¡BUAAA DE FELICIDAD! ¡LLEGASTE A LA META Y GANASTE ${totalCoins + bonusCoins} MONEDAS!`,
          )
          utterance.lang = "es-ES"
          utterance.rate = 0.8
          utterance.pitch = 1.3
          speechSynthesis.speak(utterance)
        }
        break

      default:
        setMessage(`Estás en ${space.name}`)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setPlayerPosition(0)
    setTotalCoins(0)
    setMoves(0)
    setGameCompleted(false)
    setSkipTurn(false)
    setMessage("¡EMPEZAMOS A JUGAR!")
  }

  const resetGame = () => {
    setGameStarted(false)
    setPlayerPosition(0)
    setTotalCoins(0)
    setMoves(0)
    setGameCompleted(false)
    setSkipTurn(false)
    setMessage("")
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-br from-green-100 to-teal-200 border-4 border-green-300">
          <CardHeader>
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              🪿
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">JUEGO DE LA OCA</CardTitle>
            <p className="text-xl text-teal-600">¡TABLERO MÁGICO CON BEBÉS LLORONES!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-600 mb-4">¿CÓMO JUGAR?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🎲
                  </div>
                  <p className="font-semibold">LANZA EL DADO</p>
                  <p className="text-gray-600">Y avanza casillas</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    👶
                  </div>
                  <p className="font-semibold">BEBÉS ESPECIALES</p>
                  <p className="text-gray-600">Te ayudan a avanzar</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🪙
                  </div>
                  <p className="font-semibold">GANA MONEDAS</p>
                  <p className="text-gray-600">En casillas especiales</p>
                </div>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg"
            >
              <Trophy className="w-6 h-6 mr-2" />
              ¡EMPEZAR JUEGO!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const DiceIcon = diceIcons[diceValue - 1]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          <span className="no-uppercase">🪿</span> JUEGO DE LA OCA
        </h2>
        <div className="flex justify-center items-center gap-4 mb-4">
          <Badge className="bg-green-400 text-white text-lg px-4 py-2">POSICIÓN: {playerPosition}/20</Badge>
          <Badge className="bg-blue-400 text-white text-lg px-4 py-2">MOVIMIENTOS: {moves}</Badge>
          <Badge className="bg-yellow-400 text-white text-lg px-4 py-2">
            <Coins className="w-4 h-4 mr-1" />
            {totalCoins} MONEDAS
          </Badge>
        </div>
        {message && (
          <div className="bg-white/80 rounded-xl p-3 border-2 border-green-300 max-w-md mx-auto">
            <p className="font-bold text-green-700">{message}</p>
          </div>
        )}
      </div>

      {/* Tablero */}
      <div className="grid grid-cols-5 md:grid-cols-7 gap-2 mb-6">
        {boardSpaces.map((space, index) => {
          const isPlayerHere = playerPosition === index
          let bgColor = "bg-gray-100"

          if (space.type === "start") bgColor = "bg-green-200"
          else if (space.type === "finish") bgColor = "bg-gold-200"
          else if (space.type === "baby") bgColor = "bg-pink-200"
          else if (space.type === "coin") bgColor = "bg-yellow-200"
          else if (space.type === "trap") bgColor = "bg-red-200"

          return (
            <Card
              key={space.id}
              className={`${bgColor} border-2 ${
                isPlayerHere ? "border-blue-500 shadow-lg scale-110" : "border-gray-300"
              } transition-all duration-300`}
            >
              <CardContent className="p-2 text-center">
                <div className="text-lg font-bold text-gray-700 mb-1">{space.id}</div>
                {space.type === "baby" && (
                  <div className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    👶
                  </div>
                )}
                {space.type === "coin" && (
                  <div className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    🪙
                  </div>
                )}
                {space.type === "trap" && (
                  <div className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    ⚠️
                  </div>
                )}
                {space.type === "start" && (
                  <div className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    🏁
                  </div>
                )}
                {space.type === "finish" && (
                  <div className="text-2xl mb-1 no-uppercase" data-emoji="true">
                    🏆
                  </div>
                )}
                <p className="text-xs font-semibold text-gray-600">{space.name}</p>
                {isPlayerHere && (
                  <div className="text-2xl animate-bounce no-uppercase" data-emoji="true">
                    🐾
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Controles */}
      <div className="text-center">
        <Card className="bg-gradient-to-br from-blue-100 to-purple-200 border-4 border-blue-300 max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="mb-4">
              <DiceIcon className={`w-16 h-16 mx-auto text-blue-600 ${isRolling ? "animate-spin" : ""}`} />
              <p className="text-2xl font-bold text-blue-600 mt-2">DADO: {diceValue}</p>
            </div>

            {!gameCompleted ? (
              <Button
                onClick={rollDice}
                disabled={isRolling}
                className={`${
                  skipTurn ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"
                } text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg w-full`}
              >
                {isRolling ? "LANZANDO..." : skipTurn ? "SALTAR TURNO" : "LANZAR DADO"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl no-uppercase" data-emoji="true">
                  🎉
                </div>
                <h3 className="text-2xl font-bold text-green-600">¡JUEGO COMPLETADO!</h3>
                <Badge className="bg-yellow-500 text-white text-xl px-6 py-3">
                  <Coins className="w-5 h-5 mr-2" />
                  TOTAL: {totalCoins} MONEDAS
                </Badge>
                <Button
                  onClick={resetGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl w-full"
                >
                  JUGAR DE NUEVO
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
