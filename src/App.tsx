import { useState, useEffect } from 'react'
import supabase from './api/supabaseClient'
import RoutesController from './routes'
import { AuthProvider } from './context/auth'

function App() {
  const [claims, setClaims] = useState<any | null>(null)

  useEffect(() => {
    const loadClaims = async () => {
      const res = await supabase.auth.getClaims()
      const claims = res.data?.claims ?? null
      setClaims(claims)
    }

    loadClaims()

    const { data } = supabase.auth.onAuthStateChange(() => {
      loadClaims()
    })

    return () => data?.subscription?.unsubscribe()
  }, [])

  return (
    <AuthProvider>
      <RoutesController />
    </AuthProvider>
  )
}

export default App