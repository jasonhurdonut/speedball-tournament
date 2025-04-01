"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Tournament, Match } from "@/types/tournament"
import { initialTournamentData } from "@/data/initial-data"

interface TournamentContextType {
  tournament: Tournament
  updateMatch: (match: Match) => void
  isLoading: boolean
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [tournament, setTournament] = useState<Tournament>(initialTournamentData)
  const [isLoading, setIsLoading] = useState(true)

  // Load tournament data from localStorage on initial render
  useEffect(() => {
    const loadTournament = () => {
      try {
        const savedTournament = localStorage.getItem("tournament")
        if (savedTournament) {
          setTournament(JSON.parse(savedTournament))
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load tournament data:", error)
        setIsLoading(false)
      }
    }

    loadTournament()
  }, [])

  // Save tournament data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("tournament", JSON.stringify(tournament))
    }
  }, [tournament, isLoading])

  // Update a match and propagate winners to next rounds
  const updateMatch = (updatedMatch: Match) => {
    setTournament((prevTournament) => {
      // Create a deep copy of the tournament
      const newTournament = JSON.parse(JSON.stringify(prevTournament)) as Tournament

      // Find and update the match
      const roundIndex = newTournament.rounds.findIndex((round) => round.id === updatedMatch.round)
      if (roundIndex === -1) return prevTournament

      const matchIndex = newTournament.rounds[roundIndex].matches.findIndex((match) => match.id === updatedMatch.id)
      if (matchIndex === -1) return prevTournament

      // Update match status based on played state
      if (updatedMatch.played) {
        updatedMatch.status = "completed"
      } else {
        // Check if match date is today
        const today = new Date()
        const matchDate = updatedMatch.date ? new Date(updatedMatch.date) : null

        if (
          matchDate &&
          matchDate.getDate() === today.getDate() &&
          matchDate.getMonth() === today.getMonth() &&
          matchDate.getFullYear() === today.getFullYear()
        ) {
          updatedMatch.status = "in-progress"
        } else {
          updatedMatch.status = "upcoming"
        }
      }

      newTournament.rounds[roundIndex].matches[matchIndex] = updatedMatch

      // If this match has a winner, update the next round's match
      if (updatedMatch.winnerId && roundIndex < newTournament.rounds.length - 1) {
        const nextRound = roundIndex + 1
        const nextMatchNumber = Math.floor(updatedMatch.matchNumber / 2)
        const nextMatchIndex = newTournament.rounds[nextRound].matches.findIndex(
          (match) => match.matchNumber === nextMatchNumber,
        )

        if (nextMatchIndex !== -1) {
          const nextMatch = newTournament.rounds[nextRound].matches[nextMatchIndex]

          // Determine if this winner should be team1 or team2 in the next match
          if (updatedMatch.matchNumber % 2 === 0) {
            // Even match numbers go to team1 slot
            nextMatch.team1Id = updatedMatch.winnerId
          } else {
            // Odd match numbers go to team2 slot
            nextMatch.team2Id = updatedMatch.winnerId
          }

          newTournament.rounds[nextRound].matches[nextMatchIndex] = nextMatch
        }
      }

      return newTournament
    })
  }

  return (
    <TournamentContext.Provider value={{ tournament, updateMatch, isLoading }}>{children}</TournamentContext.Provider>
  )
}

export function useTournament() {
  const context = useContext(TournamentContext)
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider")
  }
  return context
}

