import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PWAInstaller from "@/components/pwa-installer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bebés Llorones - Aprende Jugando",
  description:
    "Aplicación educativa para niños con los adorables Bebés Llorones. Aprende letras, palabras, cuentos y canciones.",
  keywords: ["bebés llorones", "educación", "niños", "aprender", "juegos", "letras", "palabras"],
  authors: [{ name: "Bebés Llorones App" }],
  creator: "Bebés Llorones Educational Team",
  publisher: "Bebés Llorones",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bebes-llorones-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bebés Llorones - Aprende Jugando",
    description: "Aplicación educativa para niños con los adorables Bebés Llorones",
    url: "https://bebes-llorones-app.vercel.app",
    siteName: "Bebés Llorones App",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bebés Llorones - Aprende Jugando",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bebés Llorones - Aprende Jugando",
    description: "Aplicación educativa para niños con los adorables Bebés Llorones",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bebés Llorones",
  },
  applicationName: "Bebés Llorones",
  referrer: "origin-when-cross-origin",
  category: "education",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec4899" },
    { media: "(prefers-color-scheme: dark)", color: "#ec4899" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bebés Llorones" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        {children}
        <PWAInstaller />
      </body>
    </html>
  )
}
