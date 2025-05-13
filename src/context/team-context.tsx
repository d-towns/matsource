"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { getUserTeams } from '@/components/app-sidebar/actions'
import { Team } from '@/lib/models/team'


interface TeamContextType {
  activeTeam: Team | null
  setActiveTeam: (team: Team) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export const TeamProvider = ({ children, userId }: { children: ReactNode, userId?: string }) => {
  const [activeTeam, setActiveTeamState] = useState<Team | null>(null)

  // On mount, load from localStorage or fetch from server if not present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('activeTeam')
      console.log('stored', stored)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          console.log('parsed', parsed)
          setActiveTeamState(Team.parse(parsed))
        } catch {
          setActiveTeamState(null)
        }
      } else if (userId) {
        console.log('userId', userId)
        // Fetch all teams for the user and set the first as active
        getUserTeams(userId).then(teams => {
          console.log('teams', teams)
          if (teams) {
            setActiveTeamState(Team.parse(teams))
          } else {
            setActiveTeamState(null)
          }
        })
      } else {
        setActiveTeamState(null)
      }
    }
  }, [userId])

  // Whenever activeTeam changes, persist to localStorage and set cookie
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTeam && activeTeam.id) {
      localStorage.setItem('activeTeam', JSON.stringify(activeTeam))
      // Set cookie for server access
      document.cookie = `activeTeam=${activeTeam.id}; path=/; SameSite=Lax`;
    }
  }, [activeTeam])

  // Setter that also persists
  const setActiveTeam = (team: Team) => {
    setActiveTeamState(team)
    // localStorage and cookie will be updated by the effect
  }

  return (
    <TeamContext.Provider value={{ activeTeam, setActiveTeam }}>
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return context
} 