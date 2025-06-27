"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Lock, Check } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  level: number
  ownedAvatars: string[]
}

interface AvatarStoreProps {
  profile: UserProfile
  onPurchase: (avatarId: string, cost: number) => void
  onSelectAvatar: (avatarId: string) => void
}

const avatars = [
  {
    id: "bebe-abeja",
    name: "BEBÉ ABEJA",
    image: "/images/bebe-abeja.png",
    cost: 0,
    description: "¡BZZZZ! DULCE COMO LA MIEL",
    rarity: "COMÚN",
    color: "bg-yellow-400",
  },
  {
    id: "bebe-rana",
    name: "BEBÉ RANA",
    image: "/images/bebe-rana.png",
    cost: 0,
    description: "¡CROAC! SALTARÍN Y DIVERTIDO",
    rarity: "COMÚN",
    color: "bg-green-400",
  },
  {
    id: "bebe-conejo",
    name: "BEBÉ CONEJO",
    image: "/images/bebe-conejo.png",
    cost: 0,
    description: "¡HOP HOP! TIERNO Y CARIÑOSO",
    rarity: "COMÚN",
    color: "bg-pink-400",
  },
  {
    id: "bebe-astronauta",
    name: "BEBÉ ASTRONAUTA",
    image: "/images/bebe-astronauta.png",
    cost: 0,
    description: "¡AL INFINITO Y MÁS ALLÁ!",
    rarity: "COMÚN",
    color: "bg-blue-400",
  },
  {
    id: "bebe-conejo-rosa",
    name: "BEBÉ CONEJO ROSA",
    image: "/images/avatars/bebe-conejo-rosa.png",
    cost: 25,
    description: "¡SÚPER FASHION CON OREJAS BRILLANTES!",
    rarity: "RARO",
    color: "bg-pink-500",
  },
  {
    id: "bebe-oveja",
    name: "BEBÉ OVEJA",
    image: "/images/avatars/bebe-oveja.png",
    cost: 30,
    description: "¡SUAVECITO COMO UNA NUBE!",
    rarity: "RARO",
    color: "bg-amber-400",
  },
  {
    id: "bebe-leopardo",
    name: "BEBÉ LEOPARDO",
    image: "/images/avatars/bebe-leopardo.png",
    cost: 40,
    description: "¡MANCHITAS SÚPER COOL!",
    rarity: "ÉPICO",
    color: "bg-orange-500",
  },
  {
    id: "bebe-gallo",
    name: "BEBÉ GALLO",
    image: "/images/avatars/bebe-gallo.png",
    cost: 35,
    description: "¡KIKIRIKI! DESPIERTA TEMPRANO",
    rarity: "RARO",
    color: "bg-red-500",
  },
  {
    id: "bebe-cactus",
    name: "BEBÉ CACTUS",
    image: "/images/avatars/bebe-cactus.png",
    cost: 45,
    description: "¡ESPINOSO PERO ADORABLE!",
    rarity: "ÉPICO",
    color: "bg-green-500",
  },
  {
    id: "bebe-fresa",
    name: "BEBÉ FRESA",
    image: "/images/avatars/bebe-fresa.png",
    cost: 50,
    description: "¡DULCE Y DELICIOSA!",
    rarity: "ÉPICO",
    color: "bg-red-400",
  },
  {
    id: "bebe-pinguino",
    name: "BEBÉ PINGÜINO",
    image: "/images/avatars/bebe-pinguino.png",
    cost: 60,
    description: "¡FRÍO PERO CON CORAZÓN CALIENTE!",
    rarity: "LEGENDARIO",
    color: "bg-blue-600",
  },
  {
    id: "bebe-unicornio",
    name: "BEBÉ UNICORNIO",
    image: "/images/avatars/bebe-unicornio.png",
    cost: 100,
    description: "¡MÁGICO Y BRILLANTE COMO UN ARCOÍRIS!",
    rarity: "LEGENDARIO",
    color: "bg-purple-500",
  },
  {
    id: "bebe-dragon",
    name: "BEBÉ DRAGÓN",
    image: "/images/avatars/bebe-dragon.png",
    cost: 150,
    description: "¡ESCAMAS DORADAS Y PODER MÁGICO!",
    rarity: "MÍTICO",
    color: "bg-yellow-600",
  },
  {
    id: "bebe-cabra",
    name: "BEBÉ CABRA",
    image: "/images/avatars/bebe-cabra.png",
    cost: 80,
    description: "¡CUERNITOS ADORABLES Y TRAVIESO!",
    rarity: "LEGENDARIO",
    color: "bg-purple-400",
  },
]

const rarityColors = {
  COMÚN: "bg-gray-400",
  RARO: "bg-blue-500",
  ÉPICO: "bg-purple-500",
  LEGENDARIO: "bg-yellow-500",
  MÍTICO: "bg-red-500",
}

export default function AvatarStore({ profile, onPurchase, onSelectAvatar }: AvatarStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS")

  const categories = ["TODOS", "COMÚN", "RARO", "ÉPICO", "LEGENDARIO", "MÍTICO"]

  const filteredAvatars = avatars.filter((avatar) =>
    selectedCategory === "TODOS" ? true : avatar.rarity === selectedCategory,
  )

  const canAfford = (cost: number) => profile.stars >= cost
  const isOwned = (avatarId: string) => profile.ownedAvatars.includes(avatarId)
  const isSelected = (avatarId: string) => profile.avatar === avatarId

  const handlePurchase = (avatar: any) => {
    if (canAfford(avatar.cost) && !isOwned(avatar.id)) {
      onPurchase(avatar.id, avatar.cost)
    }
  }

  const handleSelect = (avatarId: string) => {
    if (isOwned(avatarId)) {
      onSelectAvatar(avatarId)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-pink-600 mb-2">
          <span className="no-uppercase">🛍️</span> TIENDA DE BEBÉS LLORONES
        </h2>
        <p className="text-xl text-purple-600 mb-4">¡COMPRA NUEVOS AVATARES CON TUS CORAZONES!</p>
        <div className="flex justify-center items-center gap-2 bg-white/80 rounded-full px-6 py-3 border-2 border-pink-300">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          <span className="text-2xl font-bold text-pink-600">{profile.stars} CORAZONES</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${
              selectedCategory === category ? "bg-pink-500 text-white" : "bg-white/80 text-gray-700 hover:bg-pink-100"
            } font-bold px-4 py-2 rounded-full border-2 border-pink-300`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Avatars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAvatars.map((avatar) => (
          <Card
            key={avatar.id}
            className={`${
              isSelected(avatar.id)
                ? "border-4 border-yellow-400 shadow-2xl scale-105"
                : "border-2 border-gray-200 hover:border-pink-300"
            } transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
          >
            <CardHeader className="p-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <Image
                  src={avatar.image || "/placeholder.svg"}
                  alt={avatar.name}
                  fill
                  className="object-contain animate-bounce"
                />
              </div>
              <CardTitle className="text-sm font-bold text-gray-800">{avatar.name}</CardTitle>
              <Badge className={`${rarityColors[avatar.rarity as keyof typeof rarityColors]} text-white text-xs`}>
                {avatar.rarity}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <p className="text-xs text-gray-600 text-center mb-3 min-h-[40px]">{avatar.description}</p>

              <div className="space-y-2">
                {isSelected(avatar.id) ? (
                  <div className="bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-xl text-center border-2 border-yellow-500">
                    <Check className="w-4 h-4 inline mr-1" />
                    SELECCIONADO
                  </div>
                ) : isOwned(avatar.id) ? (
                  <Button
                    onClick={() => handleSelect(avatar.id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl"
                  >
                    USAR AVATAR
                  </Button>
                ) : avatar.cost === 0 ? (
                  <Button
                    onClick={() => handleSelect(avatar.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl"
                  >
                    GRATIS
                  </Button>
                ) : canAfford(avatar.cost) ? (
                  <Button
                    onClick={() => handlePurchase(avatar)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-xl"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {avatar.cost} <Heart className="w-4 h-4 ml-1 fill-white" />
                  </Button>
                ) : (
                  <div className="w-full bg-gray-400 text-gray-600 font-bold py-2 px-4 rounded-xl text-center border-2 border-gray-300">
                    <Lock className="w-4 h-4 inline mr-1" />
                    {avatar.cost} <Heart className="w-4 h-4 inline ml-1" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-blue-300">
        <h3 className="text-xl font-bold text-blue-600 mb-3 text-center">
          <span className="no-uppercase">💡</span> CONSEJOS PARA GANAR MÁS CORAZONES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/80 rounded-xl p-3 border border-blue-200">
            <span className="no-uppercase">🔤</span> <strong>JUEGO DE LETRAS:</strong> +2 CORAZONES POR LETRA CORRECTA
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-blue-200">
            <span className="no-uppercase">📝</span> <strong>FORMAR PALABRAS:</strong> +3 CORAZONES POR PALABRA
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-blue-200">
            <span className="no-uppercase">📚</span> <strong>CUENTOS:</strong> +5 CORAZONES POR HISTORIA COMPLETA
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-blue-200">
            <span className="no-uppercase">🎵</span> <strong>CANCIONES:</strong> +4 CORAZONES POR CANCIÓN
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-blue-200">
            <span className="no-uppercase">🐘</span> <strong>UNIR SÍLABAS:</strong> +3 CORAZONES POR SÍLABA CORRECTA
          </div>
        </div>
      </div>
    </div>
  )
}
