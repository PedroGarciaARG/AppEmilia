"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface LevelSystemProps {
  gameType:
    | "letters"
    | "syllables"
    | "words"
    | "stories"
    | "songs"
    | "farmLetters"
    | "syllableTrain"
    | "soundForest"
    | "storyCreator"
  currentLevel: number
  onLevelComplete: (newLevel: number, reward: number) => void
}

const levelData = {
  letters: {
    name: "MAESTRO DE LETRAS",
    icon: "🔤",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10 ? "LETRAS BÁSICAS" : i < 25 ? "LETRAS AVANZADAS" : i < 40 ? "PALABRAS COMPLEJAS" : "MAESTRO EXPERTO",
      requirement: Math.min(5 + Math.floor(i / 5), 20),
      reward: Math.min(2 + Math.floor(i / 10), 10),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  syllables: {
    name: "MAESTRO DE SÍLABAS",
    icon: "🔤",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10
          ? "SÍLABAS BÁSICAS (CV)"
          : i < 25
            ? "DIFERENTES VOCALES"
            : i < 40
              ? "SÍLABAS COMPLEJAS"
              : "SÍLABAS EXPERTAS",
      requirement: Math.min(4 + Math.floor(i / 6), 12),
      reward: Math.min(3 + Math.floor(i / 8), 8),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  words: {
    name: "CONSTRUCTOR DE PALABRAS",
    icon: "📝",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description: i < 10 ? "PALABRAS SIMPLES" : i < 25 ? "PALABRAS LARGAS" : i < 40 ? "ORACIONES" : "POETA EXPERTO",
      requirement: Math.min(3 + Math.floor(i / 8), 15),
      reward: Math.min(3 + Math.floor(i / 8), 12),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  stories: {
    name: "NARRADOR MÁGICO",
    icon: "📚",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10 ? "CUENTOS CORTOS" : i < 25 ? "HISTORIAS LARGAS" : i < 40 ? "AVENTURAS ÉPICAS" : "MAESTRO CUENTACUENTOS",
      requirement: Math.min(2 + Math.floor(i / 10), 8),
      reward: Math.min(5 + Math.floor(i / 5), 20),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  songs: {
    name: "CANTANTE ESTRELLA",
    icon: "🎵",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10 ? "CANCIONES SIMPLES" : i < 25 ? "MELODÍAS COMPLEJAS" : i < 40 ? "ÓPERAS INFANTILES" : "SUPERESTRELLA",
      requirement: Math.min(2 + Math.floor(i / 8), 10),
      reward: Math.min(4 + Math.floor(i / 6), 15),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  farmLetters: {
    name: "GRANJERO DE LETRAS",
    icon: "🚜",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10
          ? "PALABRAS DE 3 LETRAS"
          : i < 25
            ? "PALABRAS DE 4 LETRAS"
            : i < 40
              ? "PALABRAS DE 5+ LETRAS"
              : "GRANJERO EXPERTO",
      requirement: Math.min(3 + Math.floor(i / 7), 10),
      reward: Math.min(4 + Math.floor(i / 8), 12),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  syllableTrain: {
    name: "CONDUCTOR DE SÍLABAS",
    icon: "🚂",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10
          ? "PALABRAS DE 2 SÍLABAS"
          : i < 25
            ? "PALABRAS DE 3 SÍLABAS"
            : i < 40
              ? "PALABRAS DE 4+ SÍLABAS"
              : "CONDUCTOR EXPERTO",
      requirement: Math.min(2 + Math.floor(i / 6), 8),
      reward: Math.min(5 + Math.floor(i / 7), 15),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  soundForest: {
    name: "EXPLORADOR DE SONIDOS",
    icon: "🌲",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10 ? "SONIDOS INICIALES" : i < 25 ? "SONIDOS MEDIOS" : i < 40 ? "SONIDOS FINALES" : "EXPLORADOR EXPERTO",
      requirement: Math.min(4 + Math.floor(i / 8), 12),
      reward: Math.min(3 + Math.floor(i / 9), 8),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
  storyCreator: {
    name: "CREADOR DE CUENTOS",
    icon: "📖",
    levels: Array.from({ length: 50 }, (_, i) => ({
      level: i + 1,
      title: `NIVEL ${i + 1}`,
      description:
        i < 10 ? "CUENTOS SIMPLES" : i < 25 ? "CUENTOS ELABORADOS" : i < 40 ? "CUENTOS COMPLEJOS" : "AUTOR EXPERTO",
      requirement: Math.min(2 + Math.floor(i / 10), 6),
      reward: Math.min(6 + Math.floor(i / 5), 20),
      difficulty: i < 10 ? "FÁCIL" : i < 25 ? "MEDIO" : i < 40 ? "DIFÍCIL" : "EXPERTO",
    })),
  },
}

const difficultyColors = {
  FÁCIL: "bg-green-400",
  MEDIO: "bg-yellow-400",
  DIFÍCIL: "bg-orange-400",
  EXPERTO: "bg-red-400",
}

export default function LevelSystem({ gameType, currentLevel, onLevelComplete }: LevelSystemProps) {
  const [progress, setProgress] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)

  const gameData = levelData[gameType]
  const currentLevelData = gameData.levels[currentLevel - 1] || gameData.levels[0]
  const nextLevelData = gameData.levels[currentLevel] || null

  useEffect(() => {
    const progressPercentage = (completedTasks / currentLevelData.requirement) * 100
    setProgress(Math.min(progressPercentage, 100))

    if (completedTasks >= currentLevelData.requirement && nextLevelData) {
      setTimeout(() => {
        onLevelComplete(currentLevel + 1, currentLevelData.reward)
        setCompletedTasks(0)
        setProgress(0)
      }, 1000)
    }
  }, [
    completedTasks,
    currentLevelData.requirement,
    currentLevel,
    nextLevelData,
    onLevelComplete,
    currentLevelData.reward,
  ])

  const addProgress = () => {
    setCompletedTasks((prev) => prev + 1)
  }

  // Exponer función para que los juegos puedan llamarla
  useEffect(() => {
    ;(window as any).addLevelProgress = addProgress
  }, [])

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2 no-uppercase">{gameData.icon}</div>
            <h3 className="text-2xl font-bold text\
