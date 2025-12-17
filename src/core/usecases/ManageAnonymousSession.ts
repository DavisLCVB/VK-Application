import { CookieService } from '../ports/CookieService'

const VAULT_KRATE_ANON_KEY_NAME = 'VAULT-KRATE-ANON-KEY'
const MIN_EXPIRATION_HOURS = 12
const MAX_EXPIRATION_HOURS = 24

export class ManageAnonymousSessionUseCase {
  constructor(private readonly cookieService: CookieService) {}

  /**
   * Ensure VAULT-KRATE-ANON-KEY cookie exists
   * Creates one if it doesn't exist
   */
  ensureAnonymousKey(): void {
    if (!this.cookieService.hasAnonymousKey()) {
      this.createAnonymousKey()
    }
  }

  /**
   * Create a new anonymous session key
   * @returns The generated key
   */
  createAnonymousKey(): string {
    // Generate a random UUID for the anonymous key
    const key = crypto.randomUUID()

    // Random expiration between 12-24 hours
    const expirationHours =
      Math.random() * (MAX_EXPIRATION_HOURS - MIN_EXPIRATION_HOURS) +
      MIN_EXPIRATION_HOURS

    this.cookieService.setAnonymousKey(key, expirationHours)

    return key
  }

  /**
   * Get current anonymous key
   * @returns The anonymous key or null
   */
  getAnonymousKey(): string | null {
    return this.cookieService.getAnonymousKey()
  }

  /**
   * Remove anonymous session
   */
  removeAnonymousKey(): void {
    this.cookieService.removeAnonymousKey()
  }
}
