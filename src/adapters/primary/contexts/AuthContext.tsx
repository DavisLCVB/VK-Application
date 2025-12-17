import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { AuthUser } from '@/core/ports/AuthService'
import { SupabaseAuthService } from '@/adapters/secondary/supabase/SupabaseAuthService'
import { UserApiService } from '@/adapters/secondary/api/UserApiService'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authService = new SupabaseAuthService()
const userService = new UserApiService()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const createdUsers = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Check current user on mount
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Listen to auth changes
    const unsubscribe = authService.onAuthStateChange(async (newUser) => {
      if (newUser && !createdUsers.current.has(newUser.id)) {
        createdUsers.current.add(newUser.id)
        try {
          await userService.createUser(newUser.id)
        } catch {
          // Silently ignore - user might already exist
        }
      }
      setUser(newUser)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const newUser = await authService.signUp(email, password)

      // Create user in backend
      try {
        await userService.createUser(newUser.id)
      } catch (error) {
        console.error('Failed to create user in backend:', error)
        // User is created in Supabase but not in backend
        // This might be okay depending on your requirements
      }

      setUser(newUser)
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    const signedInUser = await authService.signIn(email, password)
    setUser(signedInUser)
  }

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle()
    // User will be set via onAuthStateChange when OAuth redirect completes
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
