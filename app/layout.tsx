import React from "react"
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Geist, Geist_Mono, JetBrains_Mono, Instrument_Serif, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { TopNav } from '@/components/top-nav'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });
const lora = Lora({ subsets: ["latin"], variable: "--font-body-serif" });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.withjuno.ai'),
  title: 'Juno AI | Pedagogical AI for Education',
  description: 'Building artificial intelligence that benefits all learners. Pedagogically sound, privacy-first AI models for education.',
  generator: 'v0.app',
  appleWebApp: {
    title: 'Juno',
  },
  openGraph: {
    title: 'Juno AI | Pedagogical AI for Education',
    description: 'Building artificial intelligence that benefits all learners. Pedagogically sound, privacy-first AI models for education.',
    images: [
      {
        url: '/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Juno AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juno AI | Pedagogical AI for Education',
    description: 'Building artificial intelligence that benefits all learners. Pedagogically sound, privacy-first AI models for education.',
    images: ['/opengraph.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${geist.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${lora.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <TopNav />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
