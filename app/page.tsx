"use client"
import { useTournament } from "@/context/tournament-context"
import { TournamentBracket } from "@/components/tournament-bracket"

export default function Home() {
  const { tournament, isLoading } = useTournament()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-tournament-gold">Loading tournament data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-tournament-gold text-center mb-8">{tournament.name}</h1>

      <div className="bg-tournament-black/50 p-6 rounded-lg shadow-lg overflow-hidden">
        <div className="min-h-[800px]">
          <TournamentBracket tournament={tournament} />
        </div>
      </div>
    </div>
  )
}

