import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { supabase } from './lib/supabase'
import { AuthProvider } from './contexts/AuthContext'

// Test de connexion — à supprimer après vérification
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Erreur de connexion Supabase :', error.message)
  } else {
    console.log('✅ Supabase connecté avec succès !', data)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider enveloppe toute l'app pour la session globale */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)