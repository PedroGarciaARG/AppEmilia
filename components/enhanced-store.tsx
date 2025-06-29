"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Coins, ShoppingCart } from "lucide-react"
import AvatarStore from "@/components/avatar-store"
import VirtualPetStore from "@/components/virtual-pet-store"
import ItemStore from "@/components/item-store"

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

interface EnhancedStoreProps {
  profile: UserProfile
  onPurchaseAvatar: (avatarId: string, cost: number) => void
  onSelectAvatar: (avatarId: string) => void
  onPurchasePet: (petId: string, cost: number) => void
  onPurchaseItem: (itemId: string, cost: number, quantity: number) => void
}

export default function EnhancedStore({
  profile,
  onPurchaseAvatar,
  onSelectAvatar,
  onPurchasePet,
  onPurchaseItem,
}: EnhancedStoreProps) {
  const [currentTab, setCurrentTab] = useState<"avatars" | "pets" | "items">("avatars")

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-purple-600 mb-2">
          <span className="no-uppercase">🛍️</span> TIENDA DE BEBÉS LLORONES
        </h2>
        <p className="text-xl text-pink-600 mb-4">¡TODO LO QUE NECESITAS PARA TU AVENTURA!</p>

        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 border-2 border-pink-300">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold text-pink-600">{profile.stars} CORAZONES</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 border-2 border-yellow-300">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-xl font-bold text-yellow-600">{profile.coins} MONEDAS</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-8">
        <Button
          onClick={() => setCurrentTab("avatars")}
          className={`${
            currentTab === "avatars" ? "bg-pink-500 text-white" : "bg-white/80 text-gray-700 hover:bg-pink-100"
          } font-bold px-6 py-3 rounded-full border-2 border-pink-300`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          AVATARES
        </Button>
        <Button
          onClick={() => setCurrentTab("pets")}
          className={`${
            currentTab === "pets" ? "bg-purple-500 text-white" : "bg-white/80 text-gray-700 hover:bg-purple-100"
          } font-bold px-6 py-3 rounded-full border-2 border-purple-300`}
        >
          <span className="no-uppercase mr-2">🐾</span>
          MASCOTAS
        </Button>
        <Button
          onClick={() => setCurrentTab("items")}
          className={`${
            currentTab === "items" ? "bg-blue-500 text-white" : "bg-white/80 text-gray-700 hover:bg-blue-100"
          } font-bold px-6 py-3 rounded-full border-2 border-blue-300`}
        >
          <span className="no-uppercase mr-2">🛒</span>
          CUIDADOS
        </Button>
      </div>

      {/* Tab Content */}
      {currentTab === "avatars" && (
        <AvatarStore profile={profile} onPurchase={onPurchaseAvatar} onSelectAvatar={onSelectAvatar} />
      )}

      {currentTab === "pets" && <VirtualPetStore profile={profile} onPurchasePet={onPurchasePet} />}

      {currentTab === "items" && <ItemStore profile={profile} onPurchaseItem={onPurchaseItem} />}
    </div>
  )
}
