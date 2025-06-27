// Script para generar iconos de diferentes tamaños
// Ejecutar con: node scripts/generate-icons.js

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

// Crear directorio de iconos si no existe
const iconsDir = path.join(__dirname, "../public/icons")
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Tamaños de iconos necesarios para PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// SVG base del icono (Bebé Llorón)
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fce7f3"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
  </defs>
  
  <!-- Fondo circular -->
  <circle cx="256" cy="256" r="240" fill="url(#bg)" stroke="#ec4899" stroke-width="8"/>
  
  <!-- Cara del bebé -->
  <circle cx="256" cy="220" r="120" fill="#ffeaa7"/>
  
  <!-- Ojos -->
  <circle cx="230" cy="200" r="15" fill="#2d3436"/>
  <circle cx="282" cy="200" r="15" fill="#2d3436"/>
  <circle cx="235" cy="195" r="5" fill="white"/>
  <circle cx="287" cy="195" r="5" fill="white"/>
  
  <!-- Boca llorando -->
  <ellipse cx="256" cy="240" rx="20" ry="15" fill="#2d3436"/>
  
  <!-- Lágrimas -->
  <ellipse cx="210" cy="230" rx="8" ry="15" fill="#74b9ff"/>
  <ellipse cx="302" cy="230" rx="8" ry="15" fill="#74b9ff"/>
  
  <!-- Gorro de bebé -->
  <path d="M 180 150 Q 256 100 332 150 Q 320 120 256 120 Q 192 120 180 150" fill="#ff7675"/>
  <circle cx="320" cy="130" r="15" fill="#ff7675"/>
  
  <!-- Corazones flotantes -->
  <text x="150" y="100" font-size="30" fill="#e84393">💕</text>
  <text x="350" y="120" font-size="25" fill="#e84393">💕</text>
  <text x="400" y="300" font-size="20" fill="#e84393">💕</text>
  <text x="80" y="350" font-size="25" fill="#e84393">💕</text>
  
  <!-- Texto -->
  <text x="256" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#2d3436">Bebés</text>
  <text x="256" y="460" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#2d3436">Llorones</text>
</svg>
`

// Generar iconos
async function generateIcons() {
  console.log("Generando iconos para PWA...")

  for (const size of sizes) {
    try {
      await sharp(Buffer.from(iconSVG))
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`))

      console.log(`✅ Icono ${size}x${size} generado`)
    } catch (error) {
      console.error(`❌ Error generando icono ${size}x${size}:`, error)
    }
  }

  // Generar favicon
  try {
    await sharp(Buffer.from(iconSVG)).resize(32, 32).png().toFile(path.join(__dirname, "../public/favicon.ico"))

    console.log("✅ Favicon generado")
  } catch (error) {
    console.error("❌ Error generando favicon:", error)
  }

  console.log("🎉 ¡Todos los iconos generados correctamente!")
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  generateIcons()
}

module.exports = { generateIcons }
