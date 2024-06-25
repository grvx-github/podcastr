'use client'

// app/context/UserContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { Session } from "next-auth"

interface UserContextProps {
  user: Session["user"] | null
  loading: boolean
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Session["user"] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the session and set the user data
    ;(async () => {
      const session = await getServerSession(authConfig)
      setUser(session?.user || null)
      setLoading(false)
    })()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
