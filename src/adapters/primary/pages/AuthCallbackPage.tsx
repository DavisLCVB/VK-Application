import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/adapters/secondary/supabase/client'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash

        if (!hash || !hash.includes('access_token')) {
          setError('No authentication tokens found in URL')
          setTimeout(() => navigate('/auth'), 3000)
          return
        }

        // Parse the hash parameters
        const params = new URLSearchParams(hash.replace('#', ''))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (!access_token || !refresh_token) {
          setError('Invalid authentication tokens')
          setTimeout(() => navigate('/auth'), 3000)
          return
        }

        // Set the session in Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (sessionError) {
          throw sessionError
        }

        // Clean up the URL and redirect to dashboard
        window.history.replaceState(null, document.title, window.location.pathname)
        navigate('/dashboard', { replace: true })
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setTimeout(() => navigate('/auth'), 3000)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}
