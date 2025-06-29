"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, ShoppingCart } from "lucide-react"

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  coins: number
  level: number
  ownedAvatars: string[]
  ownedPets: string[]
  ownedItems: { [key: string]: number }
  virtualPets: { [key: string]: any }
}

interface ItemStoreProps {
  profile: UserProfile
  onPurchaseItem: (itemId: string, cost: number, quantity: number) => void
}

const storeItems = {
  food: [
    {
      id: "milk-basic",
      name: "LECHE BÁSICA",
      icon: "🍼",
      cost: 5,
      quantity: 1,
      effect: "+20 Hambre",
      description: "Leche nutritiva para bebés",
    },
    {
      id: "milk-premium",
      name: "LECHE PREMIUM",
      icon: "🥛",
      cost: 12,
      quantity: 1,
      effect: "+40 Hambre",
      description: "Leche enriquecida con vitaminas",
    },
    {
      id: "baby-food",
      name: "PAPILLA ESPECIAL",
      icon: "🥄",
      cost: 20,
      quantity: 1,
      effect: "+60 Hambre",
      description: "Papilla deliciosa y nutritiva",
    },
    {
      id: "gourmet-meal",
      name: "COMIDA GOURMET",
      icon: "🍽️",
      cost: 35,
      quantity: 1,
      effect: "+100 Hambre",
      description: "Comida de lujo para bebés especiales",
    },
  ],
  hygiene: [
    {
      id: "diaper-basic",
      name: "PAÑAL BÁSICO",
      icon: "🧷",
      cost: 3,
      quantity: 1,
      effect: "+30 Higiene",
      description: "Pañal suave y absorbente",
    },
    {
      id: "diaper-premium",
      name: "PAÑAL PREMIUM",
      icon: "✨",
      cost: 8,
      quantity: 1,
      effect: "+50 Higiene",
      description: "Pañal ultra suave con protección",
    },
    {
      id: "soap-basic",
      name: "JABÓN SUAVE",
      icon: "🧼",
      cost: 10,
      quantity: 1,
      effect: "+40 Higiene",
      description: "Jabón especial para piel sensible",
    },
    {
      id: "shampoo-deluxe",
      name: "CHAMPÚ DELUXE",
      icon: "🧴",
      cost: 18,
      quantity: 1,
      effect: "+70 Higiene",
      description: "Champú con aroma a bebé",
    },
  ],
  toys: [
    {
      id: "bubbles",
      name: "BURBUJAS MÁGICAS",
      icon: "🫧",
      cost: 6,
      quantity: 1,
      effect: "+25 Juego",
      description: "Burbujas que brillan y flotan",
    },
    {
      id: "ball",
      name: "PELOTA SUAVE",
      icon: "⚽",
      cost: 12,
      quantity: 1,
      effect: "+35 Juego",
      description: "Pelota blandita para jugar",
    },
    {
      id: "teddy-bear",
      name: "OSITO DE PELUCHE",
      icon: "🧸",
      cost: 25,
      quantity: 1,
      effect: "+50 Afecto",
      description: "Osito suave para abrazar",
    },
    {
      id: "music-box",
      name: "CAJA MUSICAL",
      icon: "🎵",
      cost: 30,
      quantity: 1,
      effect: "+60 Sueño",
      description: "Melodías relajantes para dormir",
    },
  ],
  medicine: [
    {
      id: "vitamins",
      name: "VITAMINAS",
      icon: "💊",
      cost: 15,
      quantity: 1,
      effect: "+30 Todas las necesidades",
      description: "Vitaminas para crecer fuerte",
    },
    {
      id: "energy-potion",
      name: "POCIÓN DE ENERGÍA",
      icon: "⚡",
      cost: 25,
      quantity: 1,
      effect: "+50 Juego y Afecto",
      description: "Poción que da mucha energía",
    },
    {
      id: "happiness-elixir",
      name: "ELIXIR DE FELICIDAD",
      icon: "✨",
      cost: 40,
      quantity: 1,
      effect: "+80 Todas las necesidades",
      description: "Elixir mágico de pura felicidad",
    },
  ],
}

export default function ItemStore({ profile, onPurchaseItem }: ItemStoreProps) {
  const categories = [
    { id: "food", name: "COMIDA", icon: "🍼", color: "bg-orange-400" },
    { id: "hygiene", name: "HIGIENE", icon: "🧼", color: "bg-blue-400" },
    { id: "toys", name: "JUGUETES", icon: "🧸", color: "bg-green-400" },
    { id: "medicine", name: "MEDICINA", icon: "💊", color: "bg-purple-400" },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">
          <span className="no-uppercase">🛒</span> TIENDA DE CUIDADOS
        </h2>
        <p className="text-xl text-pink-600 mb-4">¡TODO LO QUE NECESITAS PARA CUIDAR A TUS MASCOTAS!</p>
        <div className="bg-white/80 rounded-xl p-4 border-2 border-blue-300">
          <p className="text-lg font-semibold text-blue-600">COMPRA CON MONEDAS GANADAS EN LOS MINIJUEGOS</p>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="mb-8">
          <div className={`${category.color} rounded-t-xl p-4 border-4 border-white`}>
            <h3 className="text-2xl font-bold text-white text-center">
              <span className="no-uppercase mr-2" data-emoji="true">
                {category.icon}
              </span>
              {category.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/80 p-4 rounded-b-xl border-4 border-t-0 border-white">
            {storeItems[category.id as keyof typeof storeItems].map((item) => {
              const canAfford = profile.coins >= item.cost
              const owned = profile.ownedItems[item.id] || 0

              return (
                <Card
                  key={item.id}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-4xl mb-2 no-uppercase" data-emoji="true">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-700">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardHeader>

                  <CardContent className="text-center space-y-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <p className="text-sm font-semibold text-blue-600">{item.effect}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge className="bg-yellow-400 text-white">
                        <Coins className="w-3 h-3 mr-1" />
                        {item.cost}
                      </Badge>
                      <Badge className="bg-gray-400 text-white">TIENES: {owned}</Badge>
                    </div>

                    <Button
                      onClick={() => onPurchaseItem(item.id, item.cost, item.quantity)}
                      disabled={!canAfford}
                      className={`w-full font-bold py-2 rounded-lg ${
                        canAfford
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {canAfford ? "COMPRAR" : "SIN MONEDAS"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 border-2 border-yellow-300">
        <h3 className="text-2xl font-bold text-orange-600 text-center mb-4">
          <span className="no-uppercase">💰</span> ¿CÓMO CONSEGUIR MÁS MONEDAS?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              🧠
            </div>
            <h4 className="font-bold text-orange-600 mb-2">MEMORIA</h4>
            <p className="text-sm text-gray-600">10 monedas por nivel</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              🪿
            </div>
            <h4 className="font-bold text-orange-600 mb-2">JUEGO DE LA OCA</h4>
            <p className="text-sm text-gray-600">15 monedas por partida</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              🔍
            </div>
            <h4 className="font-bold text-orange-600 mb-2">ENCAJAR FORMAS</h4>
            <p className="text-sm text-gray-600">8 monedas por forma</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              ⚽
            </div>
            <h4 className="font-bold text-orange-600 mb-2">PATEAR PENALES</h4>
            <p className="text-sm text-gray-600">10-15 monedas por gol</p>
          </div>
        </div>
      </div>
    </div>
  )
}
