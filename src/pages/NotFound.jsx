import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-bg dot-grid flex items-center justify-center px-6">
      <div className="text-center">
        {/* Code d'erreur glitch */}
        <div className="relative mb-6">
          <h1
            className={`text-[120px] md:text-[180px] font-bold font-mono leading-none text-gradient select-none transition-all ${
              glitch ? 'translate-x-1 opacity-80' : ''
            }`}
          >
            404
          </h1>
          {glitch && (
            <h1 className="absolute inset-0 text-[120px] md:text-[180px] font-bold font-mono leading-none text-accent/30 -translate-x-1 select-none">
              404
            </h1>
          )}
        </div>

        <div className="glass rounded-2xl px-8 py-6 max-w-md mx-auto">
          <p className="font-mono text-xs text-accent mb-2">// Error: Page not found</p>
          <h2 className="text-xl font-semibold mb-3">Page introuvable</h2>
          <p className="text-text-dim text-sm mb-6 leading-relaxed">
            La page que vous cherchez n'existe pas ou a été déplacée.
            Peut-être une faute de frappe dans l'URL ?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-medium transition-all"
            >
              ← Retour à l'accueil
            </Link>
            <Link
              to="/projects"
              className="px-5 py-2.5 border border-border hover:border-accent text-text-dim hover:text-text rounded-xl text-sm font-medium transition-all"
            >
              Voir les projets
            </Link>
          </div>
        </div>

        {/* Code décoratif */}
        <pre className="mt-10 text-xs font-mono text-border select-none">
{`function findPage(url) {
  return pages.find(p => p.path === url)
  // ↑ returned: undefined
}`}
        </pre>
      </div>
    </div>
  )
}
