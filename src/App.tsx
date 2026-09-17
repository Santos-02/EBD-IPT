import { useEffect } from 'react'
import supabase from './api/supabaseClient'
import RoutesController from './routes'
import { AuthProvider } from './context/auth'

function App() {
  useEffect(() => {
    const loadClaims = async () => {
      await supabase.auth.getClaims()
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