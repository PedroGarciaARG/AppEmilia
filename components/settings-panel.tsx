"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Save, User, Globe, Heart } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  name: string
  age: number
  language: "es" | "en" | "both"
  avatar: string
  stars: number
  level: number
}

interface SettingsPanelProps {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
}

export default function SettingsPanel({ profile, onSave }: SettingsPanelProps) {
  const [tempProfile, setTempProfile] = useState(profile)

  const avatars = ["💕", "👶", "🍼", "🌟", "🎈", "🦄", "🌈", "⭐", "💖", "🎀"]

  const handleSave = () => {
    onSave(tempProfile)
    alert("¡Configuración guardada! ¡Buaaa de felicidad!")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative w-16 h-16">
            <Image src="/images/bebe-conejo.png" alt="Bebé Conejo" fill className="object-contain" />
          </div>
          <div className="relative w-16 h-16">
            <Image src="/images/bebe-abeja.png" alt="Bebé Abeja" fill className="object-contain" />
          </div>
          <div className="relative w-16 h-16">
            <Image src="/images/bebe-rana.png" alt="Bebé Rana" fill className="object-contain" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">⚙️ Mi Perfil de Bebé Llorón</h2>
        <p className="text-gray-600">Personaliza tu aventura con los Bebés Llorones</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl border-4 border-pink-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-600">
              <User className="w-5 h-5" />
              Información del Bebé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-lg font-semibold text-pink-700">
                Nombre del Bebé
              </Label>
              <Input
                id="name"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="text-lg p-3 rounded-xl border-2 border-pink-300 focus:border-pink-500"
                placeholder="Mi nombre de bebé"
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-lg font-semibold text-pink-700">
                Edad
              </Label>
              <Input
                id="age"
                type="number"
                min="3"
                max="10"
                value={tempProfile.age}
                onChange={(e) => setTempProfile({ ...tempProfile, age: Number.parseInt(e.target.value) || 6 })}
                className="text-lg p-3 rounded-xl border-2 border-pink-300 focus:border-pink-500"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold text-pink-700 mb-3 block">Elige tu Avatar Favorito</Label>
              <div className="grid grid-cols-5 gap-3">
                {avatars.map((avatar) => (
                  <Button
                    key={avatar}
                    onClick={() => setTempProfile({ ...tempProfile, avatar })}
                    className={`text-3xl p-4 rounded-xl border-2 transition-all ${
                      tempProfile.avatar === avatar
                        ? "border-pink-500 bg-pink-100 scale-110"
                        : "border-gray-300 bg-white hover:bg-pink-50 hover:border-pink-300"
                    }`}
                  >
                    {avatar}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="bg-gradient-to-br from-blue-50 to-teal-50 shadow-xl border-4 border-blue-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Globe className="w-5 h-5" />
              Idioma de los Bebés Llorones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={tempProfile.language}
              onValueChange={(value: "es" | "en" | "both") => setTempProfile({ ...tempProfile, language: value })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-blue-200 hover:bg-blue-50">
                <RadioGroupItem value="es" id="spanish" />
                <Label htmlFor="spanish" className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                  🇪🇸 Solo Español - ¡Buaaa!
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-blue-200 hover:bg-blue-50">
                <RadioGroupItem value="en" id="english" />
                <Label htmlFor="english" className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                  🇺🇸 Solo Inglés - Waaah!
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-blue-200 hover:bg-blue-50">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                  🌍 Ambos Idiomas - ¡Buaaa & Waaah!
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Progress Display */}
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 shadow-xl border-4 border-yellow-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Heart className="w-5 h-5 fill-orange-600" />
              Progreso del Bebé Llorón
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/80 rounded-xl p-4 border-2 border-pink-200">
                <div className="text-3xl mb-2">💕</div>
                <div className="text-2xl font-bold text-pink-600">{profile.stars}</div>
                <div className="text-sm text-gray-600">Corazones</div>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border-2 border-purple-200">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-purple-600">{profile.level}</div>
                <div className="text-sm text-gray-600">Nivel</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">¡Sigue jugando para conseguir más corazones y subir de nivel!</p>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Babies */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl border-4 border-purple-300">
          <CardHeader>
            <CardTitle className="text-purple-600 text-center">💕 Mis Bebés Llorones Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/80 rounded-xl border-2 border-yellow-200">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <Image src="/images/bebe-abeja.png" alt="Bebé Abeja" fill className="object-contain" />
                </div>
                <p className="text-sm font-semibold text-yellow-700">Bebé Abeja</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl border-2 border-green-200">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <Image src="/images/bebe-rana.png" alt="Bebé Rana" fill className="object-contain" />
                </div>
                <p className="text-sm font-semibold text-green-700">Bebé Rana</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl border-2 border-pink-200">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <Image src="/images/bebe-conejo.png" alt="Bebé Conejo" fill className="object-contain" />
                </div>
                <p className="text-sm font-semibold text-pink-700">Bebé Conejo</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl border-2 border-blue-200">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <Image src="/images/bebe-astronauta.png" alt="Bebé Astronauta" fill className="object-contain" />
                </div>
                <p className="text-sm font-semibold text-blue-700">Bebé Astronauta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg border-2 border-white"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Mi Perfil
          </Button>
          <p className="text-sm text-gray-600 mt-2">¡Buaaa! ¡Tu perfil se guardará con amor!</p>
        </div>
      </div>
    </div>
  )
}
