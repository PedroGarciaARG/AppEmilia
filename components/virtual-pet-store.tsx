"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Lock } from "lucide-react"
import Image from "next/image"

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

interface VirtualPetStoreProps {
  profile: UserProfile
  onPurchasePet: (petId: string, cost: number) => void
}

const availablePets = [
  {
    id: "bebe-abeja",
    name: "BEBÉ ABEJA",
    image: "/images/bebe-abeja.png",
    cost: 50,
    description: "¡ZUMBA DE FELICIDAD!",
    personality: "Trabajadora y dulce",
    speciality: "Le encanta la miel",
  },
  {
    id: "bebe-rana",
    name: "BEBÉ RANA",
    image: "/images/bebe-rana.png",
    cost: 60,
    description: "¡SALTA DE ALEGRÍA!",
    personality: "Juguetona y saltarina",
    speciality: "Ama los charcos",
  },
  {
    id: "bebe-conejo",
    name: "BEBÉ CONEJO",
    image: "/images/bebe-conejo.png",
    cost: 70,
    description: "¡SALTA Y JUEGA!",
    personality: "Tierna y cariñosa",
    speciality: "Le gustan las zanahorias",
  },
  {
    id: "bebe-elefante",
    name: "BEBÉ ELEFANTE",
    image: "/images/bebe-elefante.png",
    cost: 80,
    description: "¡NUNCA OLVIDA!",
    personality: "Inteligente y leal",
    speciality: "Memoria increíble",
  },
  {
    id: "bebe-astronauta",
    name: "BEBÉ ASTRONAUTA",
    image: "/images/bebe-astronauta.png",
    cost: 90,
    description: "¡EXPLORA EL ESPACIO!",
    personality: "Aventurero y curioso",
    speciality: "Sueña con las estrellas",
  },
  {
    id: "bebe-tiburon",
    name: "BEBÉ TIBURÓN",
    image: "/images/bebe-tiburon.png",
    cost: 100,
    description: "¡NADA CON ENERGÍA!",
    personality: "Valiente y protector",
    speciality: "Rey de los océanos",
  },
  {
    id: "bebe-dinosaurio",
    name: "BEBÉ DINOSAURIO",
    image: "/images/bebe-dinosaurio.png",
    cost: 110,
    description: "¡RUGIDO PREHISTÓRICO!",
    personality: "Fuerte y noble",
    speciality: "Guardián ancestral",
  },
  {
    id: "bebe-raton",
    name: "BEBÉ RATÓN",
    image: "/images/bebe-raton.png",
    cost: 40,
    description: "¡PEQUEÑO PERO VALIENTE!",
    personality: "Ágil y astuto",
    speciality: "Encuentra tesoros",
  },
  {
    id: "bebe-dalmata",
    name: "BEBÉ DÁLMATA",
    image: "/images/bebe-dalmata.png",
    cost: 85,
    description: "¡MANCHITAS DE AMOR!",
    personality: "Fiel y juguetón",
    speciality: "Mejor amigo",
  },
  {
    id: "bebe-pollo",
    name: "BEBÉ POLLO",
    image: "/images/bebe-pollo.png",
    cost: 45,
    description: "¡PÍO PÍO DE FELICIDAD!",
    personality: "Alegre y cantarín",
    speciality: "Despierta temprano",
  },
]

export default function VirtualPetStore({ profile, onPurchasePet }: VirtualPetStoreProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-purple-600 mb-2">
          <span className="no-uppercase">🐾</span> ADOPCIÓN DE MASCOTAS VIRTUALES
        </h2>
        <p className="text-xl text-pink-600 mb-4">¡ADOPTA UN BEBÉ LLORÓN PARA CUIDAR CON AMOR!</p>
        <div className="bg-white/80 rounded-xl p-4 border-2 border-purple-300">
          <p className="text-lg font-semibold text-purple-600">
            MASCOTAS ADOPTADAS: {profile.ownedPets.length} / {availablePets.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePets.map((pet) => {
          const isOwned = profile.ownedPets.includes(pet.id)
          const canAfford = profile.stars >= pet.cost

          return (
            <Card
              key={pet.id}
              className={`${
                isOwned
                  ? "bg-gradient-to-br from-green-100 to-emerald-200 border-green-400"
                  : "bg-gradient-to-br from-purple-100 to-pink-200 border-purple-400"
              } border-4 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                !isOwned && canAfford ? "hover:scale-105" : ""
              }`}
            >
              <CardHeader className="text-center pb-2">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={pet.image || "/placeholder.svg"}
                    alt={pet.name}
                    fill
                    className={`object-contain ${isOwned ? "" : "animate-bounce"}`}
                  />
                  {isOwned && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-lg no-uppercase" data-emoji="true">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-purple-600">{pet.name}</CardTitle>
                <p className="text-sm text-pink-600 font-semibold">{pet.description}</p>
              </CardHeader>

              <CardContent className="text-center space-y-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">PERSONALIDAD:</p>
                  <p className="text-sm text-purple-600">{pet.personality}</p>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">ESPECIALIDAD:</p>
                  <p className="text-sm text-pink-600">{pet.speciality}</p>
                </div>

                <div className="flex justify-center">
                  <Badge className="bg-yellow-400 text-white text-lg px-4 py-2">
                    <Heart className="w-4 h-4 mr-1 fill-white" />
                    {pet.cost} CORAZONES
                  </Badge>
                </div>

                {isOwned ? (
                  <Button
                    disabled
                    className="w-full bg-green-500 text-white font-bold py-3 rounded-xl cursor-not-allowed"
                  >
                    <span className="no-uppercase mr-2">✓</span>
                    ¡YA ADOPTADO!
                  </Button>
                ) : canAfford ? (
                  <Button
                    onClick={() => onPurchasePet(pet.id, pet.cost)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg border-2 border-white"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    ¡ADOPTAR AHORA!
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl cursor-not-allowed"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    NECESITAS MÁS CORAZONES
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 border-2 border-pink-300">
        <h3 className="text-2xl font-bold text-purple-600 text-center mb-4">
          <span className="no-uppercase">💡</span> ¿CÓMO CONSEGUIR MÁS CORAZONES?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              🎓
            </div>
            <h4 className="font-bold text-purple-600 mb-2">JUEGOS EDUCATIVOS</h4>
            <p className="text-sm text-gray-600">Completa niveles de letras, sílabas y palabras</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              📚
            </div>
            <h4 className="font-bold text-purple-600 mb-2">CUENTOS Y CANCIONES</h4>
            <p className="text-sm text-gray-600">Escucha historias y canta canciones</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <div className="text-3xl mb-2 no-uppercase" data-emoji="true">
              🏆
            </div>
            <h4 className="font-bold text-purple-600 mb-2">LOGROS ESPECIALES</h4>
            <p className="text-sm text-gray-600">Completa desafíos y gana recompensas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
