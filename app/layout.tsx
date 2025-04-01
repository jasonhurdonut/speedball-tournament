import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TournamentProvider } from "@/context/tournament-context"
import { AuthProvider } from "@/context/auth-context"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Speedball Tournament Bracket",
  description: "A professional tournament bracket for speedball competitions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <TournamentProvider>
              <div className="min-h-screen flex flex-col bg-tournament-black text-white">
                <Header />
                <main className="flex-1">{children}</main>
                <footer className="bg-tournament-black border-t border-tournament-gold py-4">
                  <div className="container mx-auto px-4 text-center text-sm text-tournament-gold/70">
                    © {new Date().getFullYear()} Speedball Tournament Organizer
                  </div>
                </footer>
              </div>
            </TournamentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'