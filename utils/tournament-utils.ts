import type { Match, Team, Tournament } from "@/types/tournament"

// Get a team by ID
export function getTeamById(teams: Team[], teamId: string | null): Team | undefined {
  if (!teamId) return undefined
  return teams.find((team) => team.id === teamId)
}

// Determine the winner of a match
export function determineWinner(match: Match): string | null {
  if (!match.played || match.team1Score === null || match.team2Score === null) {
    return null
  }

  if (match.team1Score > match.team2Score) {
    return match.team1Id
  } else if (match.team2Score > match.team1Score) {
    return match.team2Id
  }

  // In case of a tie, return null or implement tie-breaking logic
  return null
}

// Format date for display
export function formatMatchDate(dateString: string | null): string {
  if (!dateString) return "TBD"

  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  }

  return date.toLocaleDateString("en-US", options)
}

// Check if a team is the winner of a match
export function isWinner(match: Match, teamId: string | null): boolean {
  if (!teamId || !match.winnerId) return false
  return match.winnerId === teamId
}

// Reset tournament to initial state
export function resetTournament(tournament: Tournament): Tournament {
  const resetTournament = { ...tournament }

  // Reset all matches after the first round
  for (let i = 1; i < resetTournament.rounds.length; i++) {
    resetTournament.rounds[i].matches = resetTournament.rounds[i].matches.map((match) => ({
      ...match,
      team1Id: null,
      team2Id: null,
      team1Score: null,
      team2Score: null,
      winnerId: null,
      played: false,
      status: "upcoming",
    }))
  }

  // Reset first round scores but keep teams
  resetTournament.rounds[0].matches = resetTournament.rounds[0].matches.map((match) => ({
    ...match,
    team1Score: null,
    team2Score: null,
    winnerId: null,
    played: false,
    status: "upcoming",
  }))

  return resetTournament
}

