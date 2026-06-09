import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Redirige vers /admin/login si non authentifié
// Mémorise la page demandée pour redirection après login
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Écran de chargement pendant la vérification de session
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-dim text-sm font-mono">Vérification session...</p>
        </div>
      </div>
    )
  }

  // Non authentifié → redirection login avec retour automatique
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}