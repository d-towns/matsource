"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { getUserTeams } from '@/lib/services/auth-actions'
import { Team } from '@/lib/models/team'
import { useUser } from '@/hooks/use-user'


interface TeamContextType {
  activeTeam: Team | null
  setActiveTeam: (team: Team) => void
  teams: Team[] | null
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export const TeamProvider = ({ children}: { children: ReactNode,}) => {
  const [activeTeam, setActiveTeamState] = useState<Team | null>(null)
  const [teams, setTeams] = useState<Team[] | null>(null)
  const {user} = useUser()

  // On mount, load from localStorage or fetch from server if not present
  const loadActiveTeamFromStorage = () => {
    const stored = localStorage.getItem('activeTeam')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setActiveTeamState(Team.parse(parsed))
        return true
      } catch {
        setActiveTeamState(null)
        return false
      }
    }
    return false
  }

  const loadTeamsFromServer = async () => {

    const teams = await getUserTeams()
    console.log('teams', teams)
    if (teams) {
      setTeams(teams)      
    } else {
      setActiveTeamState(null)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasStoredTeam = loadActiveTeamFromStorage()
      
      // If we have a stored team, just load teams from server
      if (hasStoredTeam) {
        loadTeamsFromServer()
      } 
      // If no stored team, load teams and set first as active
      loadTeamsFromServer()
    }
  }, [user])

  // Separate effect to handle setting active team when teams are loaded
  useEffect(() => {
    if (teams && teams.length > 0 && !activeTeam) {
      setActiveTeamState(Team.parse(teams[0]))
    }
  }, [teams, activeTeam])

  // Whenever activeTeam changes, persist to localStorage and set cookie
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTeam && activeTeam.id) {
      localStorage.setItem('activeTeam', JSON.stringify(activeTeam))
      // Set cookie for server access
      document.cookie = `activeTeam=${activeTeam.id}; path=/; SameSite=Lax`;
      loadTeamsFromServer()
    }
  }, [activeTeam])

  // Setter that also persists
  const setActiveTeam = (team: Team) => {
    setActiveTeamState(team)
    // localStorage and cookie will be updated by the effect
  }

  return (
    <TeamContext.Provider value={{ activeTeam, setActiveTeam, teams }}>
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