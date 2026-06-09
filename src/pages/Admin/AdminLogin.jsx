import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'


export default function AdminLogin() {
  const [creds, setCreds]   = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const { login, user }     = useAuth()
  const navigate            = useNavigate()
  const location            = useLocation()

  // Si déjà connecté → rediriger directement
  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || '/admin'
      navigate(destination, { replace: true })
    }
  }, [user, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation basique
    if (!creds.email || !creds.password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    const result = await login(creds.email, creds.password)

    if (result.success) {
      // Rediriger vers la page demandée ou /admin par défaut
      const destination = location.state?.from?.pathname || '/admin'
      navigate(destination, { replace: true })
    } else {
      // Traduire les erreurs Supabase en français
      const msg = translateError(result.error)
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg dot-grid flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-mono text-accent text-2xl font-medium">
            mohamed.dev
          </Link>
          <p className="text-text-dim text-sm mt-1">Espace administration</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-xl font-semibold mb-1">Connexion Admin</h1>
          <p className="text-muted text-xs font-mono mb-6">
            Accès réservé — Supabase Auth
          </p>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠️</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-dim mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                className="w-full bg-bg border border-border focus:border-accent rounded-xl px-4 py-2.5 text-sm text-text outline-none transition-all placeholder-muted"
                placeholder="mohamedtozri465@gmail.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-text-dim mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={creds.password}
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                className="w-full bg-bg border border-border focus:border-accent rounded-xl px-4 py-2.5 text-sm text-text outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        {/* Retour portfolio */}
        <p className="text-center mt-4 text-xs text-muted">
          ←{' '}
          <Link to="/" className="text-text-dim hover:text-accent transition-colors">
            Retour au portfolio
          </Link>
        </p>
      </div>
    </div>
  )
}

// Traduit les messages d'erreur Supabase en français
function translateError(msg) {
  if (!msg) return 'Une erreur est survenue'
  if (msg.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect'
  if (msg.includes('Email not confirmed'))       return 'Email non confirmé — vérifiez votre boîte mail'
  if (msg.includes('Too many requests'))         return 'Trop de tentatives — réessayez dans quelques minutes'
  if (msg.includes('User not found'))            return 'Aucun compte trouvé avec cet email'
  if (msg.includes('network'))                   return 'Erreur réseau — vérifiez votre connexion'
  return msg
}