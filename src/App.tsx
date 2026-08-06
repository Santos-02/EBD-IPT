import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
//import { Route } from 'react-router-dom'

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

  // If a society is selected, render its page. Otherwise render Classes (or Auth)
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
              {!claims ? ( <Auth /> ) : ( <Dashboard /> )}
              {/* <Route path="/society/:society" element={<Dashboard />} /> */}
      {/* {!claims ? (
        <Auth />
      ) : selectedSociety ? (
        <SocietyPage society={selectedSociety} onBack={() => setSelectedSociety(null)} />
      ) : (
        <Classes key={claims.sub} onSelect={(s: string) => setSelectedSociety(s)} />
      )} */}
    </div>
  )
}

export default App

// function App() {
//   const [claims, setClaims] = useState(null)

//   useEffect(() => {
//     const loadClaims = async () => {
//       const {
//         data: { claims },
//       } = await supabase.auth.getClaims()
//       setClaims(claims)
//     }

//     loadClaims()

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(() => {
//       loadClaims()
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   return (
//     <div className="container" style={{ padding: '50px 0 100px 0' }}>
//       {!claims ? <Auth /> : <Account key={claims.sub} claims={claims} />}
//     </div>
//   )
// }

// export default App