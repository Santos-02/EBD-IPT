import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Classes from './Classes'
import SocietyPage from './SocietyPage'

function App() {
  const [claims, setClaims] = useState<any | null>(null)
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null)

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

  // If a society is selected, render its page. Otherwise render Classes (or Auth)
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!claims ? (
        <Auth />
      ) : selectedSociety ? (
        <SocietyPage society={selectedSociety} onBack={() => setSelectedSociety(null)} />
      ) : (
        <Classes key={claims.sub} onSelect={(s: string) => setSelectedSociety(s)} />
      )}
    </div>
  )
}

export default App
