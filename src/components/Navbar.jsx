import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'  // ← import du contexte d’auth

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'À propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()  // ← récupération de l'utilisateur connecté
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-mono text-accent font-medium text-lg tracking-tight">
          tozry<span className="text-text">.</span>dev
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === to ? 'text-accent' : 'text-text-dim hover:text-text'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          {/* Lien Admin visible uniquement si connecté */}
          {user && (
            <li>
              <Link
                to="/admin"
                className="text-sm font-medium px-4 py-1.5 rounded-full border border-border text-text-dim hover:border-accent hover:text-accent transition-all duration-200"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile burger */}
        <button
          className="md:hidden text-text-dim hover:text-text"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass mt-1 mx-4 rounded-xl p-4 animate-fade-in">
          {/* Liens normaux */}
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === to ? 'text-accent bg-accent/10' : 'text-text-dim hover:text-text'
              }`}
            >
              {label}
            </Link>
          ))}
          {/* Lien Admin mobile uniquement si connecté */}
          {user && (
            <Link
              to="/admin"
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin' ? 'text-accent bg-accent/10' : 'text-text-dim hover:text-text'
              }`}
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  )
}