export interface CookieService {
  /**
   * Get the VAULT-KRATE-ANON-KEY cookie value
   * @returns Cookie value or null if not set
   */
  getAnonymousKey(): string | null

  /**
   * Set the VAULT-KRATE-ANON-KEY cookie
   * @param key - Cookie value
   * @param expirationHours - Expiration in hours
   */
  setAnonymousKey(key: string, expirationHours: number): void

  /**
   * Remove the VAULT-KRATE-ANON-KEY cookie
   */
  removeAnonymousKey(): void

  /**
   * Check if the cookie exists
   * @returns True if cookie exists
   */
  hasAnonymousKey(): boolean
}
