import { useEffect } from 'react'
import { ManageAnonymousSessionUseCase } from '@/core/usecases/ManageAnonymousSession'
import { CookieStorageService } from '@/adapters/secondary/storage/CookieStorageService'

const cookieService = new CookieStorageService()
const manageSessionUseCase = new ManageAnonymousSessionUseCase(cookieService)

export function useAnonymousSession() {
  useEffect(() => {
    // Ensure VK-ANON-KEY cookie exists on mount
    manageSessionUseCase.ensureAnonymousKey()
  }, [])

  return {
    getAnonymousKey: () => manageSessionUseCase.getAnonymousKey(),
    createAnonymousKey: () => manageSessionUseCase.createAnonymousKey(),
    removeAnonymousKey: () => manageSessionUseCase.removeAnonymousKey(),
  }
}
