"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="bg-tournament-black border-b border-tournament-gold">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-tournament-gold text-2xl font-bold">
            Speedball Tournament
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={`text-sm ${pathname === "/" ? "text-tournament-gold" : "text-white hover:text-tournament-gold"}`}
            >
              Bracket
            </Link>

            {user?.isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className={`text-sm ${pathname === "/admin" ? "text-tournament-gold" : "text-white hover:text-tournament-gold"}`}
                >
                  Admin
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-tournament-gold text-tournament-gold hover:bg-tournament-gold hover:text-tournament-black"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-tournament-gold text-tournament-gold hover:bg-tournament-gold hover:text-tournament-black"
                >
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

