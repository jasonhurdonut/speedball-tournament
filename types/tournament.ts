export interface Team {
  id: string
  name: string
  logoUrl: string
}

export interface Match {
  id: string
  round: number
  matchNumber: number
  team1Id: string | null
  team2Id: string | null
  team1Score: number | null
  team2Score: number | null
  winnerId: string | null
  date: string | null
  played: boolean
  status?: "upcoming" | "in-progress" | "completed"
}

export interface Round {
  id: number
  name: string
  matches: Match[]
}

export interface Tournament {
  id: string
  name: string
  rounds: Round[]
  teams: Team[]
}

export interface User {
  id: string
  username: string
  isAdmin: boolean
}

