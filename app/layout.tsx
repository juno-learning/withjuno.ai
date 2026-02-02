import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono, Silkscreen } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });
const silkscreen = Silkscreen({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-silkscreen" });

export const metadata: Metadata = {
  title: 'Juno AI | Pedagogical AI for Education',
  description: 'Building artificial intelligence that benefits all learners. Pedagogically sound, privacy-first AI models for education.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${jetbrainsMono.variable}`} style={{ backgroundColor: "#000000" }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
