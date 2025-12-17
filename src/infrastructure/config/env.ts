export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  },
  app: {
    url: import.meta.env.VITE_APP_URL || window.location.origin,
  },
  vaultKrateSecret: import.meta.env.VITE_VAULT_KRATE_SECRET || '',
} as const

// Validate required environment variables
export function validateConfig() {
  const missing: string[] = []

  if (!config.supabase.url) missing.push('VITE_SUPABASE_URL')
  if (!config.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  if (!config.vaultKrateSecret) missing.push('VITE_VAULT_KRATE_SECRET')

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}. ` +
      'Authentication features may not work correctly.'
    )
  }
}
