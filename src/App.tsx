import './App.css'
import { useState, useEffect } from 'react'
import supabase from './api/supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Members from './components/Members'
import AuthProvider from './context/auth'

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
    // <div className="container" style={{ padding: '50px 0 100px 0' }}>
    //   {!claims ? (<Auth />) : (<Dashboard />)}

    //   <Routes>
    //     <Route path="/sociedades/:society" element={<Dashboard />} />
    //     <Route path="/membros" element={<Members />} />
    //   </Routes>
    // </div>
  )
}

export default App