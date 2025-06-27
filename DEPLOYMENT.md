# 🚀 Guía de Despliegue en GitHub Pages

## Pasos para publicar tu aplicación:

### 1. 📁 Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) y crea una cuenta si no tienes
2. Haz clic en "New repository"
3. Nombra tu repositorio: `bebes-llorones-app`
4. Marca "Public" 
5. Marca "Add a README file"
6. Haz clic en "Create repository"

### 2. 📤 Subir el Código

**Opción A: Usando GitHub Web (Fácil)**
1. En tu repositorio, haz clic en "uploading an existing file"
2. Arrastra todos los archivos del proyecto
3. Escribe un mensaje: "Primera versión de Bebés Llorones"
4. Haz clic en "Commit changes"

**Opción B: Usando Git (Avanzado)**
\`\`\`bash
git clone https://github.com/TU-USUARIO/bebes-llorones-app.git
cd bebes-llorones-app
# Copia todos los archivos aquí
git add .
git commit -m "Primera versión de Bebés Llorones"
git push origin main
\`\`\`

### 3. ⚙️ Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (arriba a la derecha)
3. Scroll hacia abajo hasta "Pages" (menú izquierdo)
4. En "Source", selecciona "GitHub Actions"
5. ¡Listo! GitHub automáticamente construirá y desplegará tu app

### 4. 🌐 Acceder a tu Aplicación

Tu aplicación estará disponible en:
\`\`\`
https://TU-USUARIO.github.io/bebes-llorones-app/
\`\`\`

**Ejemplo**: Si tu usuario es "maria123", la URL será:
\`\`\`
https://maria123.github.io/bebes-llorones-app/
\`\`\`

### 5. 📝 Personalizar

Antes de subir, cambia estos archivos:

**En `README.md`:**
- Cambia `tu-usuario` por tu usuario real de GitHub
- Cambia `tu-email@ejemplo.com` por tu email

**En `package.json`:**
- Cambia la URL del repositorio
- Cambia el autor

**En `.github/workflows/deploy.yml`:**
- Cambia `cname: bebes-llorones.github.io` por tu dominio

### 6. 🔄 Actualizaciones Automáticas

Cada vez que hagas cambios y los subas a GitHub:
1. GitHub Actions automáticamente construirá la app
2. Se desplegará en GitHub Pages
3. Los cambios estarán disponibles en 2-5 minutos

### 7. 📱 Compartir tu App

Una vez publicada, puedes compartir tu aplicación:

- 📱 **WhatsApp**: Comparte el enlace directamente
- 📧 **Email**: Envía el enlace a familiares
- 📱 **Redes Sociales**: Comparte en Facebook, Instagram, etc.
- 🏫 **Escuelas**: Comparte con maestros y padres

### 8. 📊 Ver Estadísticas

En tu repositorio de GitHub puedes ver:
- Cuántas personas han visitado tu app
- Desde qué países acceden
- Qué dispositivos usan

### 9. 🆓 Dominio Personalizado (Opcional)

Si quieres un dominio como `bebes-llorones.com`:
1. Compra un dominio en Namecheap, GoDaddy, etc.
2. En GitHub Pages settings, añade tu dominio personalizado
3. Configura los DNS según las instrucciones de GitHub

### 10. 🔧 Solución de Problemas

**Si la app no carga:**
- Verifica que el workflow de GitHub Actions se ejecutó correctamente
- Revisa que todos los archivos se subieron correctamente
- Espera 5-10 minutos para que se propague

**Si las imágenes no aparecen:**
- Verifica que las imágenes están en la carpeta `public/images/`
- Revisa que los nombres de archivo coinciden exactamente

**Si hay errores de construcción:**
- Ve a la pestaña "Actions" en tu repositorio
- Revisa los logs de error
- Asegúrate de que `package.json` tiene todas las dependencias

### 🎉 ¡Felicidades!

Tu aplicación de Bebés Llorones ya está en línea y disponible para todo el mundo. Los niños pueden jugar desde cualquier dispositivo con internet.

**Próximos pasos:**
- Comparte el enlace con amigos y familia
- Pide feedback para mejoras
- Añade más funcionalidades
- Considera crear una versión en más idiomas
