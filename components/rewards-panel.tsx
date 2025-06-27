"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Trophy, Medal, Star, Zap } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  level: number
}

interface RewardsPanelProps {
  profile: UserProfile
}

export default function RewardsPanel({ profile }: RewardsPanelProps) {
  const achievements = [
    {
      id: 1,
      name: "Primer Llanto",
      description: "Completaste tu primera actividad",
      icon: "👶",
      unlocked: profile.stars >= 1,
      requirement: 1,
    },
    {
      id: 2,
      name: "Amigo de Bebé Abeja",
      description: "Aprendiste 5 letras con Bebé Abeja",
      icon: "🐝",
      unlocked: profile.stars >= 10,
      requirement: 10,
    },
    {
      id: 3,
      name: "Compañero de Bebé Rana",
      description: "Formaste 10 palabras con Bebé Rana",
      icon: "🐸",
      unlocked: profile.stars >= 25,
      requirement: 25,
    },
    {
      id: 4,
      name: "Cuidador de Bebé Conejo",
      description: "Escuchaste 5 cuentos con Bebé Conejo",
      icon: "🐰",
      unlocked: profile.stars >= 40,
      requirement: 40,
    },
    {
      id: 5,
      name: "Explorador Espacial",
      description: "Cantaste 3 canciones con Bebé Astronauta",
      icon: "🚀",
      unlocked: profile.stars >= 30,
      requirement: 30,
    },
    {
      id: 6,
      name: "Bebé Súper Estrella",
      description: "Alcanzaste el nivel 5",
      icon: "⭐",
      unlocked: profile.level >= 5,
      requirement: 50,
    },
    {
      id: 7,
      name: "Bebé Bilingüe",
      description: "Aprendiste en ambos idiomas",
      icon: "🌍",
      unlocked: profile.language === "both" && profile.stars >= 20,
      requirement: 20,
    },
    {
      id: 8,
      name: "Corazón de Oro",
      description: "Conseguiste 100 corazones",
      icon: "💛",
      unlocked: profile.stars >= 100,
      requirement: 100,
    },
  ]

  const stickers = [
    "💕",
    "👶",
    "🍼",
    "🌟",
    "🎈",
    "🦄",
    "🌈",
    "⭐",
    "💖",
    "🎀",
    "🐝",
    "🐸",
    "🐰",
    "🚀",
    "🌙",
    "☀️",
    "🌸",
    "🦋",
    "🎵",
    "🎉",
  ]

  const unlockedStickers = stickers.slice(0, Math.min(profile.level * 3, stickers.length))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center gap-2 mb-4">
          <div className="relative w-16 h-16">
            <Image src="/images/bebe-abeja.png" alt="Bebé Abeja" fill className="object-contain animate-bounce" />
          </div>
          <div className="relative w-16 h-16">
            <Image
              src="/images/bebe-rana.png"
              alt="Bebé Rana"
              fill
              className="object-contain animate-bounce"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <div className="relative w-16 h-16">
            <Image
              src="/images/bebe-conejo.png"
              alt="Bebé Conejo"
              fill
              className="object-contain animate-bounce"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-pink-600 mb-2">🏆 Tesoros de los Bebés Llorones</h2>
        <p className="text-xl text-gray-600">¡Mira todos los corazones que has conseguido!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-pink-400 to-red-400 text-white border-4 border-white shadow-xl">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 fill-white" />
            <div className="text-3xl font-bold">{profile.stars}</div>
            <div className="text-sm opacity-90">Corazones</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-pink-400 text-white border-4 border-white shadow-xl">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{profile.level}</div>
            <div className="text-sm opacity-90">Nivel</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white border-4 border-white shadow-xl">
          <CardContent className="p-6 text-center">
            <Medal className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{achievements.filter((a) => a.unlocked).length}</div>
            <div className="text-sm opacity-90">Logros</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-teal-400 text-white border-4 border-white shadow-xl">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 fill-white" />
            <div className="text-3xl font-bold">{unlockedStickers.length}</div>
            <div className="text-sm opacity-90">Stickers</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl border-4 border-pink-300 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-600 text-2xl">
            <Trophy className="w-6 h-6" />
            Logros de los Bebés Llorones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-300 shadow-md"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${achievement.unlocked ? "" : "grayscale"}`}>{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${achievement.unlocked ? "text-green-700" : "text-gray-500"}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${achievement.unlocked ? "text-gray-700" : "text-gray-400"}`}>
                      {achievement.description}
                    </p>
                    <div className="mt-2">
                      {achievement.unlocked ? (
                        <Badge className="bg-green-500 text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          ¡Desbloqueado!
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          {achievement.requirement} corazones necesarios
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sticker Collection */}
      <Card className="bg-gradient-to-br from-yellow-50 to-pink-50 shadow-xl border-4 border-yellow-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-600 text-2xl">
            <Heart className="w-6 h-6 fill-pink-600" />
            Colección de Stickers de Bebés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {stickers.map((sticker, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center text-3xl transition-all duration-300 ${
                  unlockedStickers.includes(sticker)
                    ? "bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300 shadow-md hover:scale-110"
                    : "bg-gray-100 border-gray-200 grayscale opacity-40"
                }`}
              >
                {sticker}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              ¡Sigue jugando para desbloquear más stickers!
              <span className="font-bold text-pink-600">
                {" "}
                {unlockedStickers.length}/{stickers.length} desbloqueados
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <div className="text-center mt-8 p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-4 border-pink-200">
        <div className="text-4xl mb-3">{profile.avatar}</div>
        <h3 className="text-2xl font-bold text-pink-600 mb-2">¡Sigue así, {profile.name}!</h3>
        <p className="text-lg text-gray-700 mb-4">
          Los Bebés Llorones están súper orgullosos de ti. ¡Cada corazón muestra cuánto has aprendido!
        </p>
        <div className="flex justify-center gap-2 mb-4">
          <div className="relative w-12 h-12">
            <Image src="/images/bebe-abeja.png" alt="Bebé Abeja" fill className="object-contain" />
          </div>
          <div className="relative w-12 h-12">
            <Image src="/images/bebe-rana.png" alt="Bebé Rana" fill className="object-contain" />
          </div>
          <div className="relative w-12 h-12">
            <Image src="/images/bebe-conejo.png" alt="Bebé Conejo" fill className="object-contain" />
          </div>
          <div className="relative w-12 h-12">
            <Image src="/images/bebe-astronauta.png" alt="Bebé Astronauta" fill className="object-contain" />
          </div>
        </div>
        {profile.level < 10 && (
          <div className="mt-4">
            <div className="bg-white/80 rounded-full h-4 mb-2 border-2 border-pink-300">
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${((profile.stars % 10) / 10) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{10 - (profile.stars % 10)} corazones más para el siguiente nivel</p>
          </div>
        )}
      </div>
    </div>
  )
}
