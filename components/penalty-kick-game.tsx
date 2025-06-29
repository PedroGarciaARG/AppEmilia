"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Target, RotateCcw, Trophy } from "lucide-react"

interface PenaltyKickGameProps {
  language: "es" | "en" | "both"
  onReward: (coins: number) => void
}

type GoalZone = "left" | "center" | "right" | "top-left" | "top-right"

export default function PenaltyKickGame({ language, onReward }: PenaltyKickGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentShot, setCurrentShot] = useState(0)
  const [goals, setGoals] = useState(0)
  const [totalCoins, setTotalCoins] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedZone, setSelectedZone] = useState<GoalZone | null>(null)
  const [goalkeeperZone, setGoalkeeperZone] = useState<GoalZone | null>(null)
  const [shotResult, setShotResult] = useState<"goal" | "save" | "miss" | null>(null)
  const [level, setLevel] = useState(1)
  const [shotsPerLevel] = useState(5)
  const [isKicking, setIsKicking] = useState(false)

  const goalZones: { id: GoalZone; name: string; position: string }[] = [
    { id: "top-left", name: "ARRIBA IZQUIERDA", position: "top-0 left-0" },
    { id: "top-right", name: "ARRIBA DERECHA", position: "top-0 right-0" },
    { id: "left", name: "IZQUIERDA", position: "top-1/2 left-0 -translate-y-1/2" },
    { id: "center", name: "CENTRO", position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { id: "right", name: "DERECHA", position: "top-1/2 right-0 -translate-y-1/2" },
  ]

  const startGame = () => {
    setGameStarted(true)
    setCurrentShot(0)
    setGoals(0)
    setTotalCoins(0)
    setGameCompleted(false)
    setShotResult(null)
    setSelectedZone(null)
    setGoalkeeperZone(null)
  }

  const selectZone = (zone: GoalZone) => {
    if (isKicking || shotResult) return
    setSelectedZone(zone)
  }

  const kickBall = () => {
    if (!selectedZone || isKicking) return

    setIsKicking(true)

    // El arquero elige una zona aleatoriamente (más difícil en niveles altos)
    const goalkeeperChance = Math.min(0.3 + (level - 1) * 0.1, 0.7)
    const willGoalkeeperSave = Math.random() < goalkeeperChance

    let goalkeeperChoice: GoalZone | null = null
    if (willGoalkeeperSave) {
      // El arquero tiene más probabilidad de ir a donde el jugador patea
      if (Math.random() < 0.6) {
        goalkeeperChoice = selectedZone
      } else {
        goalkeeperChoice = goalZones[Math.floor(Math.random() * goalZones.length)].id
      }
    } else {
      goalkeeperChoice = goalZones[Math.floor(Math.random() * goalZones.length)].id
    }

    setGoalkeeperZone(goalkeeperChoice)

    setTimeout(() => {
      let result: "goal" | "save" | "miss"
      let coinsEarned = 0

      // Probabilidad de fallar el tiro
      const missChance = Math.max(0.1 - (level - 1) * 0.02, 0.05)
      if (Math.random() < missChance) {
        result = "miss"
        coinsEarned = 2 // Consolación
      } else if (goalkeeperChoice === selectedZone) {
        result = "save"
        coinsEarned = 5 // Por intentarlo
      } else {
        result = "goal"
        coinsEarned = 10 + level * 2 // Más monedas en niveles altos
        setGoals(goals + 1)
      }

      setShotResult(result)
      setTotalCoins(totalCoins + coinsEarned)
      onReward(coinsEarned)

      if ("speechSynthesis" in window) {
        let message = ""
        if (result === "goal") message = "¡BUAAA DE FELICIDAD! ¡GOOOOOL!"
        else if (result === "save") message = "¡Buaaa! El arquero lo atajó"
        else message = "¡Buaaa! Falló el tiro"

        const utterance = new SpeechSynthesisUtterance(message)
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = result === "goal" ? 1.4 : 1.0
        speechSynthesis.speak(utterance)
      }

      setIsKicking(false)
    }, 2000)
  }

  const nextShot = () => {
    const nextShotNumber = currentShot + 1
    setCurrentShot(nextShotNumber)
    setShotResult(null)
    setSelectedZone(null)
    setGoalkeeperZone(null)

    if (nextShotNumber >= shotsPerLevel) {
      // Nivel completado
      const bonusCoins = goals * 5 + level * 10
      setTotalCoins(totalCoins + bonusCoins)
      onReward(bonusCoins)
      setGameCompleted(true)

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          `¡NIVEL ${level} COMPLETADO! ¡MARCASTE ${goals} GOLES Y GANASTE ${totalCoins + bonusCoins} MONEDAS!`,
        )
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.pitch = 1.3
        speechSynthesis.speak(utterance)
      }
    }
  }

  const nextLevel = () => {
    setLevel(level + 1)
    setCurrentShot(0)
    setGoals(0)
    setGameCompleted(false)
    setShotResult(null)
    setSelectedZone(null)
    setGoalkeeperZone(null)
  }

  const resetGame = () => {
    setLevel(1)
    setGameStarted(false)
    setCurrentShot(0)
    setGoals(0)
    setTotalCoins(0)
    setGameCompleted(false)
    setShotResult(null)
    setSelectedZone(null)
    setGoalkeeperZone(null)
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-4 border-yellow-300">
          <CardHeader>
            <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
              ⚽
            </div>
            <CardTitle className="text-3xl font-bold text-yellow-600">PATEAR PENALES</CardTitle>
            <p className="text-xl text-orange-600">¡MARCA GOLES CONTRA EL ARQUERO!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-600 mb-4">¿CÓMO JUGAR?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🎯
                  </div>
                  <p className="font-semibold">ELIGE ZONA</p>
                  <p className="text-gray-600">Donde patear</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    ⚽
                  </div>
                  <p className="font-semibold">PATEA FUERTE</p>
                  <p className="text-gray-600">¡Evita al arquero!</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
                    🪙
                  </div>
                  <p className="font-semibold">GANA MONEDAS</p>
                  <p className="text-gray-600">10-15 por gol</p>
                </div>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg"
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
        <h2 className="text-3xl font-bold text-yellow-600 mb-2">
          <span className="no-uppercase">⚽</span> PENALES - NIVEL {level}
        </h2>
        <div className="flex justify-center items-center gap-4 mb-4">
          <Badge className="bg-yellow-400 text-white text-lg px-4 py-2">
            TIRO: {currentShot + 1}/{shotsPerLevel}
          </Badge>
          <Badge className="bg-green-400 text-white text-lg px-4 py-2">GOLES: {goals}</Badge>
          <Badge className="bg-blue-400 text-white text-lg px-4 py-2">
            <Coins className="w-4 h-4 mr-1" />
            {totalCoins} MONEDAS
          </Badge>
        </div>
      </div>

      {/* Campo de fútbol */}
      <div className="bg-green-400 rounded-xl p-8 mb-6 relative">
        {/* Arco */}
        <div className="relative w-80 h-48 mx-auto bg-white border-4 border-gray-800 rounded-t-3xl">
          {/* Zonas del arco */}
          {goalZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => selectZone(zone.id)}
              disabled={isKicking || shotResult !== null}
              className={`absolute w-16 h-16 rounded-full border-2 transition-all duration-300 ${
                selectedZone === zone.id
                  ? "bg-red-500 border-red-700 scale-110"
                  : "bg-red-200 border-red-400 hover:bg-red-300"
              } ${zone.position}`}
            >
              <Target className="w-8 h-8 mx-auto text-white" />
            </button>
          ))}

          {/* Arquero */}
          {goalkeeperZone && (
            <div
              className={`absolute w-12 h-16 bg-blue-500 rounded-lg transition-all duration-1000 ${
                goalZones.find((z) => z.id === goalkeeperZone)?.position
              }`}
            >
              <div className="text-2xl text-center no-uppercase" data-emoji="true">
                🥅
              </div>
            </div>
          )}

          {/* Pelota */}
          {isKicking && selectedZone && (
            <div
              className={`absolute w-8 h-8 bg-white rounded-full border-2 border-black animate-bounce transition-all duration-2000 ${
                goalZones.find((z) => z.id === selectedZone)?.position
              }`}
            >
              <div className="text-lg text-center no-uppercase" data-emoji="true">
                ⚽
              </div>
            </div>
          )}
        </div>

        {/* Jugador */}
        <div className="text-center mt-8">
          <div className="text-6xl no-uppercase" data-emoji="true">
            🏃‍♂️
          </div>
          <p className="text-white font-bold">¡TÚ!</p>
        </div>
      </div>

      {/* Controles */}
      <div className="text-center">
        {!shotResult ? (
          <Card className="bg-gradient-to-br from-blue-100 to-purple-200 border-4 border-blue-300 max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-4">
                {selectedZone ? "¡ZONA SELECCIONADA!" : "ELIGE UNA ZONA"}
              </h3>
              {selectedZone && (
                <p className="text-lg text-purple-600 mb-4">
                  Patearás a: {goalZones.find((z) => z.id === selectedZone)?.name}
                </p>
              )}
              <Button
                onClick={kickBall}
                disabled={!selectedZone || isKicking}
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg w-full"
              >
                {isKicking ? "PATEANDO..." : "¡PATEAR!"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-4 border-yellow-400 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="text-6xl mb-4 no-uppercase" data-emoji="true">
                {shotResult === "goal" ? "🎉" : shotResult === "save" ? "🥅" : "😅"}
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">
                {shotResult === "goal" ? "¡GOOOOOL!" : shotResult === "save" ? "¡ATAJADA!" : "¡FALLÓ!"}
              </h3>
              <p className="text-lg text-yellow-700 mb-4">
                {shotResult === "goal"
                  ? "¡Perfecto! El arquero no llegó"
                  : shotResult === "save"
                    ? "El arquero adivinó tu jugada"
                    : "La pelota se fue afuera"}
              </p>

              {!gameCompleted ? (
                <Button
                  onClick={nextShot}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl w-full"
                >
                  SIGUIENTE TIRO
                </Button>
              ) : (
                <div className="space-y-4">
                  <Badge className="bg-yellow-500 text-white text-xl px-6 py-3">
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
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      REINICIAR
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
