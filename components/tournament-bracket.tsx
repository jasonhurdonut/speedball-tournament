"use client"
import type { Tournament, Match } from "@/types/tournament"
import { MatchCard } from "./match-card"

interface TournamentBracketProps {
  tournament: Tournament
  isAdmin?: boolean
  onEditMatch?: (match: Match) => void
}

export function TournamentBracket({ tournament, isAdmin = false, onEditMatch }: TournamentBracketProps) {
  return (
    <div className="tournament-bracket">
      <div className="bracket-container">
        {tournament.rounds.map((round) => (
          <div key={round.id} className={`round round-${round.id}`}>
            <h3 className="round-title">{round.name}</h3>
            <div className="matches">
              {round.matches.map((match) => (
                <div key={match.id} className="match-wrapper">
                  <MatchCard match={match} teams={tournament.teams} isAdmin={isAdmin} onEdit={onEditMatch} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

