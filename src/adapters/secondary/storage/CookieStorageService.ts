import Cookies from 'js-cookie'
import { CookieService } from '@/core/ports/CookieService'

const VAULT_KRATE_ANON_KEY = 'VAULT-KRATE-ANON-KEY'

export class CookieStorageService implements CookieService {
  getAnonymousKey(): string | null {
    return Cookies.get(VAULT_KRATE_ANON_KEY) ?? null
  }

  setAnonymousKey(key: string, expirationHours: number): void {
    const expirationDays = expirationHours / 24

    Cookies.set(VAULT_KRATE_ANON_KEY, key, {
      expires: expirationDays,
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    })
  }

  removeAnonymousKey(): void {
    Cookies.remove(VAULT_KRATE_ANON_KEY)
  }

  hasAnonymousKey(): boolean {
    return Cookies.get(VAULT_KRATE_ANON_KEY) !== undefined
  }
}
