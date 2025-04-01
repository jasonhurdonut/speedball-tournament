"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTournament } from "@/context/tournament-context"
import { useAuth } from "@/context/auth-context"
import { TournamentBracket } from "@/components/tournament-bracket"
import { EditMatchModal } from "@/components/edit-match-modal"
import type { Match } from "@/types/tournament"
import { Button } from "@/components/ui/button"
import { resetTournament } from "@/utils/tournament-utils"
import { AlertCircle } from "lucide-react"

export default function AdminPage() {
  const { tournament, updateMatch, isLoading } = useTournament()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-tournament-gold">Loading...</div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center space-x-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span>You must be an admin to access this page</span>
        </div>
      </div>
    )
  }

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match)
  }

  const handleSaveMatch = (updatedMatch: Match) => {
    updateMatch(updatedMatch)
    setSelectedMatch(null)
  }

  const handleResetTournament = () => {
    if (window.confirm("Are you sure you want to reset the tournament? This will clear all match results.")) {
      const reset = resetTournament(tournament)
      // We need to update each match individually to trigger the state updates
      reset.rounds.forEach((round) => {
        round.matches.forEach((match) => {
          updateMatch(match)
        })
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tournament-gold">Tournament Admin</h1>

        <Button
          variant="destructive"
          onClick={handleResetTournament}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Reset Tournament
        </Button>
      </div>

      <div className="bg-tournament-black/50 p-6 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-tournament-gold/10 p-4 rounded mb-4 text-sm">
          <p className="text-tournament-gold">
            Click on any match to update its result. Winners will automatically advance to the next round.
          </p>
        </div>

        <div className="min-h-[800px]">
          <TournamentBracket tournament={tournament} isAdmin={true} onEditMatch={handleEditMatch} />
        </div>
      </div>

      <EditMatchModal
        match={selectedMatch}
        teams={tournament.teams}
        onSave={handleSaveMatch}
        onCancel={() => setSelectedMatch(null)}
      />
    </div>
  )
}

