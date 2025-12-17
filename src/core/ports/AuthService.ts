import { User } from '../domain/User'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthService {
  /**
   * Sign up a new user
   * @param email - User email
   * @param password - User password
   * @returns Created user
   */
  signUp(email: string, password: string): Promise<AuthUser>

  /**
   * Sign in an existing user
   * @param email - User email
   * @param password - User password
   * @returns Authenticated user
   */
  signIn(email: string, password: string): Promise<AuthUser>

  /**
   * Sign in with Google OAuth
   */
  signInWithGoogle(): Promise<void>

  /**
   * Sign out current user
   */
  signOut(): Promise<void>

  /**
   * Get current authenticated user
   * @returns Current user or null if not authenticated
   */
  getCurrentUser(): Promise<AuthUser | null>

  /**
   * Listen to auth state changes
   * @param callback - Callback function called when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void
}
