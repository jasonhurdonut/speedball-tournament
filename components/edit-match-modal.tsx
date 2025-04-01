"use client"

import { useState, useEffect } from "react"
import type { Match, Team } from "@/types/tournament"
import { getTeamById, formatMatchDate } from "@/utils/tournament-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface EditMatchModalProps {
  match: Match | null
  teams: Team[]
  onSave: (updatedMatch: Match) => void
  onCancel: () => void
}

export function EditMatchModal({ match, teams, onSave, onCancel }: EditMatchModalProps) {
  const [team1Score, setTeam1Score] = useState<number | null>(null)
  const [team2Score, setTeam2Score] = useState<number | null>(null)
  const [played, setPlayed] = useState(false)
  const [status, setStatus] = useState<"upcoming" | "in-progress" | "completed">("upcoming")

  const team1 = getTeamById(teams, match?.team1Id || null)
  const team2 = getTeamById(teams, match?.team2Id || null)

  // Reset form when match changes
  useEffect(() => {
    if (match) {
      setTeam1Score(match.team1Score)
      setTeam2Score(match.team2Score)
      setPlayed(match.played)
      setStatus(match.status || "upcoming")
    }
  }, [match])

  if (!match) return null

  const handleSave = () => {
    // Determine winner based on scores
    let winnerId: string | null = null

    if (played && team1Score !== null && team2Score !== null) {
      if (team1Score > team2Score) {
        winnerId = match.team1Id
      } else if (team2Score > team1Score) {
        winnerId = match.team2Id
      }
      // If scores are equal, winnerId remains null (tie)
    }

    const updatedMatch: Match = {
      ...match,
      team1Score,
      team2Score,
      played,
      winnerId,
      status: played ? "completed" : status,
    }

    onSave(updatedMatch)
  }

  const handleStatusChange = (newStatus: "upcoming" | "in-progress" | "completed") => {
    setStatus(newStatus)
    if (newStatus === "completed") {
      setPlayed(true)
    }
  }

  return (
    <Dialog open={!!match} onOpenChange={() => onCancel()}>
      <DialogContent className="bg-tournament-black border-tournament-gold text-white">
        <DialogHeader>
          <DialogTitle className="text-tournament-gold">Edit Match Result</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-tournament-gold">
            {formatMatchDate(match.date)} - Round {match.round}
          </div>

          {team1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="team-emoji">{team1.logoUrl}</div>
                <span>{team1.name}</span>
              </div>

              <div>
                <Input
                  type="number"
                  min="0"
                  value={team1Score === null ? "" : team1Score}
                  onChange={(e) => setTeam1Score(e.target.value ? Number.parseInt(e.target.value) : null)}
                  className="w-16 text-center bg-tournament-black border-tournament-gold"
                  disabled={!played}
                />
              </div>
            </div>
          )}

          {team2 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="team-emoji">{team2.logoUrl}</div>
                <span>{team2.name}</span>
              </div>

              <div>
                <Input
                  type="number"
                  min="0"
                  value={team2Score === null ? "" : team2Score}
                  onChange={(e) => setTeam2Score(e.target.value ? Number.parseInt(e.target.value) : null)}
                  className="w-16 text-center bg-tournament-black border-tournament-gold"
                  disabled={!played}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 pt-2">
            <Label className="text-sm mb-2">Match Status</Label>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={status === "upcoming" ? "default" : "outline"}
                className={
                  status === "upcoming"
                    ? "bg-tournament-gold text-tournament-black"
                    : "border-tournament-gold text-tournament-gold"
                }
                onClick={() => handleStatusChange("upcoming")}
              >
                Upcoming
              </Button>
              <Button
                size="sm"
                variant={status === "in-progress" ? "default" : "outline"}
                className={
                  status === "in-progress"
                    ? "bg-tournament-gold text-tournament-black"
                    : "border-tournament-gold text-tournament-gold"
                }
                onClick={() => handleStatusChange("in-progress")}
              >
                In Progress
              </Button>
              <Button
                size="sm"
                variant={status === "completed" ? "default" : "outline"}
                className={
                  status === "completed"
                    ? "bg-tournament-gold text-tournament-black"
                    : "border-tournament-gold text-tournament-gold"
                }
                onClick={() => handleStatusChange("completed")}
              >
                Completed
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="played"
              checked={played}
              onCheckedChange={(checked) => setPlayed(checked as boolean)}
              className="border-tournament-gold data-[state=checked]:bg-tournament-gold data-[state=checked]:text-tournament-black"
            />
            <Label htmlFor="played" className="text-sm">
              Match has been played
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-tournament-gold text-tournament-gold hover:bg-tournament-gold hover:text-tournament-black"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-tournament-gold text-tournament-black hover:bg-tournament-darkGold"
          >
            Save Result
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

