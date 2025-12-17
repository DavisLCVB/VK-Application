import { AuthService, AuthUser } from '@/core/ports/AuthService'
import { supabase } from './client'

export class SupabaseAuthService implements AuthService {
  async signUp(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(`Sign up failed: ${error.message}`)
    }

    if (!data.user) {
      throw new Error('Sign up failed: No user returned')
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(`Sign in failed: ${error.message}`)
    }

    if (!data.user) {
      throw new Error('Sign in failed: No user returned')
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      throw new Error(`Google sign in failed: ${error.message}`)
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`Sign out failed: ${error.message}`)
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
        })
      } else {
        callback(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }
}
