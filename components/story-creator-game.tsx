"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, RotateCcw, Heart, BookOpen } from "lucide-react"
import Image from "next/image"

interface StoryCreatorGameProps {
  language: "es" | "en" | "both"
  level: number
  onReward: (stars: number) => void
}

const storyTemplates = {
  es: {
    // Niveles 1-10: Cuentos simples
    basic: [
      {
        title: "EL BEBÉ Y SU MASCOTA",
        template:
          "HABÍA UNA VEZ UN BEBÉ QUE TENÍA UN [ANIMAL]. EL [ANIMAL] ERA MUY [ADJETIVO]. JUNTOS FUERON AL [LUGAR] Y ENCONTRARON UN [OBJETO]. ¡FUE UNA AVENTURA [ADJETIVO]!",
        words: {
          ANIMAL: ["GATO", "PERRO", "CONEJO", "PATO"],
          ADJETIVO: ["FELIZ", "TRAVIESO", "DULCE", "DIVERTIDO"],
          LUGAR: ["PARQUE", "JARDÍN", "PLAYA", "BOSQUE"],
          OBJETO: ["TESORO", "FLOR", "PELOTA", "LIBRO"],
        },
        image: "🐾",
      },
      {
        title: "LA COMIDA MÁGICA",
        template:
          "EN LA COCINA HABÍA UN [ALIMENTO] MÁGICO. CUANDO EL BEBÉ LO COMIÓ, SE SINTIÓ MUY [EMOCIÓN]. DESPUÉS SALIÓ A [ACCIÓN] CON SU [FAMILIAR]. ¡QUÉ DÍA TAN [ADJETIVO]!",
        words: {
          ALIMENTO: ["PAN", "MANZANA", "LECHE", "GALLETA"],
          EMOCIÓN: ["FELIZ", "FUERTE", "ALEGRE", "CONTENTO"],
          ACCIÓN: ["JUGAR", "CORRER", "BAILAR", "CANTAR"],
          FAMILIAR: ["MAMÁ", "PAPÁ", "HERMANA", "ABUELO"],
          ADJETIVO: ["ESPECIAL", "BONITO", "PERFECTO", "INCREÍBLE"],
        },
        image: "🍎",
      },
      {
        title: "EL JUGUETE PERDIDO",
        template:
          "EL BEBÉ PERDIÓ SU [JUGUETE] FAVORITO. LO BUSCÓ EN EL [LUGAR] Y DEBAJO DE LA [MUEBLE]. FINALMENTE LO ENCONTRÓ EN EL [LUGAR2]. ¡ESTABA MUY [EMOCIÓN]!",
        words: {
          JUGUETE: ["OSITO", "PELOTA", "MUÑECA", "CARRO"],
          LUGAR: ["JARDÍN", "CUARTO", "SALA", "COCINA"],
          MUEBLE: ["CAMA", "MESA", "SILLA", "SOFÁ"],
          LUGAR2: ["ARMARIO", "CAJA", "RINCÓN", "PATIO"],
          EMOCIÓN: ["FELIZ", "EMOCIONADO", "CONTENTO", "ALEGRE"],
        },
        image: "🧸",
      },
    ],
    // Niveles 11-25: Cuentos con más elementos
    intermediate: [
      {
        title: "LA AVENTURA EN EL ESPACIO",
        template:
          "EL BEBÉ ASTRONAUTA VIAJÓ EN SU [VEHÍCULO] AL PLANETA [PLANETA]. ALLÍ CONOCIÓ A UN [ALIEN] [ADJETIVO]. JUNTOS DESCUBRIERON UNA [COSA] BRILLANTE. DECIDIERON [ACCIÓN] JUNTOS PARA SIEMPRE.",
        words: {
          VEHÍCULO: ["COHETE", "NAVE", "PLATILLO", "CÁPSULA"],
          PLANETA: ["MARTE", "VENUS", "JÚPITER", "SATURNO"],
          ALIEN: ["MARCIANO", "EXTRATERRESTRE", "ROBOT", "CRIATURA"],
          ADJETIVO: ["AMIGABLE", "CURIOSO", "INTELIGENTE", "DIVERTIDO"],
          COSA: ["ESTRELLA", "CRISTAL", "GEMA", "PIEDRA"],
          ACCIÓN: ["EXPLORAR", "VIAJAR", "JUGAR", "ESTUDIAR"],
        },
        image: "🚀",
      },
      {
        title: "EL REINO DE LOS ANIMALES",
        template:
          "EN UN REINO LEJANO, EL REY [ANIMAL1] ORGANIZÓ UNA FIESTA. INVITÓ A LA REINA [ANIMAL2] Y AL PRÍNCIPE [ANIMAL3]. SIRVIERON [COMIDA] DELICIOSA Y BAILARON [BAILE]. TODOS FUERON MUY [ADJETIVO].",
        words: {
          ANIMAL1: ["LEÓN", "ELEFANTE", "OSO", "TIGRE"],
          ANIMAL2: ["JIRAFA", "CEBRA", "MARIPOSA", "ABEJA"],
          ANIMAL3: ["CONEJO", "RATÓN", "RANA", "PATO"],
          COMIDA: ["FRUTAS", "MIEL", "PASTELES", "DULCES"],
          BAILE: ["VALS", "SALSA", "TANGO", "BALLET"],
          ADJETIVO: ["FELICES", "ELEGANTES", "GRACIOSOS", "ALEGRES"],
        },
        image: "👑",
      },
    ],
    // Niveles 26-40: Cuentos complejos
    advanced: [
      {
        title: "LA ESCUELA MÁGICA",
        template:
          "EN LA ESCUELA MÁGICA, LA MAESTRA [PERSONAJE] ENSEÑÓ A LOS ESTUDIANTES A HACER [MAGIA]. EL BEBÉ APRENDIÓ A CONVERTIR [OBJETO1] EN [OBJETO2]. PERO ALGO SALIÓ MAL Y APARECIÓ UN [CRIATURA] [ADJETIVO]. AL FINAL, TODOS [FINAL].",
        words: {
          PERSONAJE: ["HADA", "BRUJA", "MAGA", "HECHICERA"],
          MAGIA: ["POCIONES", "HECHIZOS", "TRUCOS", "ENCANTAMIENTOS"],
          OBJETO1: ["PIEDRA", "FLOR", "LIBRO", "LÁPIZ"],
          OBJETO2: ["MARIPOSA", "ESTRELLA", "ARCOÍRIS", "MÚSICA"],
          CRIATURA: ["DRAGÓN", "UNICORNIO", "FÉNIX", "PEGASO"],
          ADJETIVO: ["TRAVIESO", "AMIGABLE", "CURIOSO", "JUGUETÓN"],
          FINAL: ["RIERON", "CELEBRARON", "APRENDIERON", "SE DIVIRTIERON"],
        },
        image: "🪄",
      },
    ],
    // Niveles 41-50: Cuentos muy elaborados
    expert: [
      {
        title: "LA GRAN AVENTURA INTERDIMENSIONAL",
        template:
          "EL BEBÉ CIENTÍFICO INVENTÓ UNA [MÁQUINA] PARA VIAJAR A [DIMENSIÓN]. ALLÍ ENCONTRÓ UNA CIVILIZACIÓN DE [SERES] QUE HABLABAN [IDIOMA]. TENÍAN UN PROBLEMA: SU [RECURSO] ESTABA [PROBLEMA]. EL BEBÉ USÓ SU [HERRAMIENTA] PARA [SOLUCIÓN] Y SALVAR SU MUNDO.",
        words: {
          MÁQUINA: ["PORTAL", "TELETRANSPORTADOR", "CÁPSULA", "PUERTA"],
          DIMENSIÓN: ["OTRA DIMENSIÓN", "EL FUTURO", "EL PASADO", "UN MUNDO PARALELO"],
          SERES: ["ROBOTS", "CRISTALES", "PLANTAS", "ENERGÍAS"],
          IDIOMA: ["MÚSICA", "COLORES", "MATEMÁTICAS", "EMOCIONES"],
          RECURSO: ["AGUA", "LUZ", "AIRE", "ENERGÍA"],
          PROBLEMA: ["DESAPARECIENDO", "CONTAMINADO", "AGOTÁNDOSE", "CAMBIANDO"],
          HERRAMIENTA: ["VARITA", "COMPUTADORA", "CRISTAL", "FÓRMULA"],
          SOLUCIÓN: ["PURIFICAR", "RESTAURAR", "MULTIPLICAR", "RENOVAR"],
        },
        image: "🔬",
      },
    ],
  },
  en: [
    {
      title: "THE BABY AND THE MAGIC PET",
      template:
        "ONCE UPON A TIME, A BABY HAD A [ANIMAL]. THE [ANIMAL] WAS VERY [ADJECTIVE]. TOGETHER THEY WENT TO THE [PLACE] AND FOUND A [OBJECT]. IT WAS A [ADJECTIVE] ADVENTURE!",
      words: {
        ANIMAL: ["CAT", "DOG", "RABBIT", "BIRD"],
        ADJECTIVE: ["HAPPY", "FUNNY", "SWEET", "BRAVE"],
        PLACE: ["PARK", "FOREST", "BEACH", "GARDEN"],
        OBJECT: ["TREASURE", "FLOWER", "BALL", "BOOK"],
      },
      image: "🐾",
    },
  ],
}

export default function StoryCreatorGame({ language, level, onReward }: StoryCreatorGameProps) {
  const [currentTemplate, setCurrentTemplate] = useState<any>(null)
  const [selectedWords, setSelectedWords] = useState<{ [key: string]: string }>({})
  const [completedStory, setCompletedStory] = useState<string>("")
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentWordType, setCurrentWordType] = useState<string>("")

  const currentData = language === "both" ? storyTemplates.es : storyTemplates[language] || storyTemplates.es

  useEffect(() => {
    generateStoryTemplate()
  }, [level])

  const generateStoryTemplate = () => {
    let templatePool: any[] = []

    if (level <= 10) {
      templatePool = currentData.basic
    } else if (level <= 25) {
      templatePool = [...currentData.basic, ...currentData.intermediate]
    } else if (level <= 40) {
      templatePool = [...currentData.intermediate, ...currentData.advanced]
    } else {
      templatePool = [...currentData.advanced, ...currentData.expert]
    }

    const template = templatePool[Math.floor(Math.random() * templatePool.length)]
    setCurrentTemplate(template)
    setSelectedWords({})
    setCompletedStory("")

    // Encontrar el primer tipo de palabra que necesita
    const wordTypes = Object.keys(template.words)
    setCurrentWordType(wordTypes[0])
  }

  const selectWord = (wordType: string, word: string) => {
    const newSelectedWords = { ...selectedWords, [wordType]: word }
    setSelectedWords(newSelectedWords)

    // Encontrar el siguiente tipo de palabra que necesita
    const wordTypes = Object.keys(currentTemplate.words)
    const nextWordType = wordTypes.find((type) => !newSelectedWords[type])

    if (nextWordType) {
      setCurrentWordType(nextWordType)
    } else {
      // Todas las palabras seleccionadas, crear la historia
      createStory(newSelectedWords)
    }
  }

  const createStory = (words: { [key: string]: string }) => {
    let story = currentTemplate.template

    // Reemplazar cada placeholder con la palabra seleccionada
    Object.keys(words).forEach((wordType) => {
      const regex = new RegExp(`\\[${wordType}\\]`, "g")
      story = story.replace(regex, words[wordType])
    })

    setCompletedStory(story)
  }

  const readStory = () => {
    if ("speechSynthesis" in window && completedStory) {
      const utterance = new SpeechSynthesisUtterance(completedStory)
      utterance.lang = language === "en" ? "en-US" : "es-ES"
      utterance.rate = 0.7
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const finishStory = () => {
    setScore(score + 1)
    setShowSuccess(true)
    onReward(6)

    // Agregar progreso al sistema de niveles
    if ((window as any).addLevelProgress) {
      ;(window as any).addLevelProgress()
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("¡CLUCK CLUCK! ¡BEBÉ POLLO ESTÁ SÚPER ORGULLOSO DE TU CUENTO!")
      utterance.lang = "es-ES"
      utterance.rate = 0.8
      utterance.pitch = 1.4
      speechSynthesis.speak(utterance)
    }

    setTimeout(() => {
      setShowSuccess(false)
      generateStoryTemplate()
    }, 4000)
  }

  const isStoryComplete = () => {
    if (!currentTemplate) return false
    return Object.keys(currentTemplate.words).every((wordType) => selectedWords[wordType])
  }

  if (!currentTemplate) return <div>Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/bebe-pollo.png" alt="BEBÉ POLLO" fill className="object-contain animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-yellow-600 mb-2">
          <span className="no-uppercase">🐥</span> CASA DE CUENTOS CON BEBÉ POLLO
        </h2>
        <p className="text-lg text-yellow-700 italic">"¡CLUCK CLUCK! ¡VAMOS A CREAR HISTORIAS INCREÍBLES!"</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span className="text-xl font-bold text-pink-600">CORAZONES: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl border-4 border-yellow-300 mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 animate-bounce no-uppercase" data-emoji="true">
              {currentTemplate.image}
            </div>
            <h3 className="text-2xl font-bold text-yellow-700 mb-4">{currentTemplate.title}</h3>
          </div>

          {/* Historia en construcción */}
          <div className="bg-gradient-to-r from-white to-yellow-50 rounded-2xl p-6 mb-6 border-4 border-yellow-200">
            <h4 className="text-lg font-bold text-yellow-700 mb-4 text-center">TU CUENTO:</h4>
            <div className="text-lg leading-relaxed text-gray-800 min-h-[120px]">
              {completedStory || (
                <div className="text-gray-500 italic text-center">¡Elige palabras para crear tu historia!</div>
              )}
            </div>
          </div>

          {/* Selección de palabras */}
          {!isStoryComplete() && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-yellow-600 mb-3 text-center">ELIGE UN {currentWordType}:</h4>
              <div className="grid grid-cols-2 gap-3">
                {currentTemplate.words[currentWordType]?.map((word: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => selectWord(currentWordType, word)}
                    className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold text-lg py-4 rounded-xl transition-all border-2 border-yellow-400 hover:scale-105"
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Palabras seleccionadas */}
          {Object.keys(selectedWords).length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-yellow-600 mb-3 text-center">PALABRAS ELEGIDAS:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(selectedWords).map(([type, word]) => (
                  <div key={type} className="bg-yellow-100 border-2 border-yellow-300 rounded-xl px-3 py-2">
                    <span className="text-xs text-yellow-600 font-semibold">{type}:</span>
                    <span className="text-sm font-bold text-yellow-800 ml-1">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4 justify-center flex-wrap">
            {isStoryComplete() && (
              <>
                <Button
                  onClick={readStory}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  LEER CUENTO
                </Button>

                <Button
                  onClick={finishStory}
                  className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg border-2 border-white"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  ¡CUENTO TERMINADO!
                </Button>
              </>
            )}

            <Button
              onClick={generateStoryTemplate}
              className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-white"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              NUEVO CUENTO
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image src="/images/bebe-pollo.png" alt="BEBÉ POLLO" fill className="object-contain animate-bounce" />
              </div>
              <div className="text-6xl mb-4 animate-bounce no-uppercase" data-emoji="true">
                📚
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">¡CUENTO FANTÁSTICO!</h3>
              <p className="text-xl text-white mb-2">¡BEBÉ POLLO ESTÁ CACAREANDO DE ALEGRÍA!</p>
              <p className="text-lg text-white/90">+6 CORAZONES</p>
              <div className="flex justify-center mt-4 gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Heart key={i} className="w-5 h-5 text-pink-200 fill-pink-200 animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información del nivel */}
      <div className="text-center bg-white/80 rounded-2xl p-4 border-2 border-yellow-300">
        <h4 className="text-lg font-bold text-yellow-700 mb-2">NIVEL {level} - CASA DE CUENTOS</h4>
        <p className="text-sm text-gray-600">
          {level <= 10
            ? "CUENTOS SIMPLES"
            : level <= 25
              ? "CUENTOS CON MÁS ELEMENTOS"
              : level <= 40
                ? "CUENTOS COMPLEJOS"
                : "CUENTOS MUY ELABORADOS"}
        </p>
      </div>
    </div>
  )
}
