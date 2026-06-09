// // hooks/useAuth.js
// import { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'

// // Réexporte depuis le contexte — compatibilité avec les imports existants
// export { useAuth } from '../contexts/AuthContext'

// export function useAuth() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     // 1. Récupérer la session existante
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       const hasSession = !!session
//       setIsAuthenticated(hasSession)
//       setUser(session?.user || null)
//       setLoading(false)
//     })

//     // 2. Écouter les changements d'auth (login/logout)
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       const hasSession = !!session
//       setIsAuthenticated(hasSession)
//       setUser(session?.user || null)
//       setLoading(false)
//     })

//     return () => {
//       listener?.subscription.unsubscribe()
//     }
//   }, [])

//   // Connexion avec email + mot de passe
//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     if (error) {
//       return { success: false, error: error.message }
//     }
//     // La session est automatiquement mise à jour par onAuthStateChange
//     return { success: true, user: data.user }
//   }

//   // Déconnexion
//   const logout = async () => {
//     await supabase.auth.signOut()
//     // L'état sera mis à jour automatiquement
//   }

//   return { isAuthenticated, loading, login, logout, user }
// }