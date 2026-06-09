import { Link } from 'react-router-dom'

export default function Footer() {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/TozryMohamed' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/tozri-mohamed26/' },
    { name: 'Behance', url: 'https://www.behance.net/mohammedtozri' },
  ]

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-mono text-accent text-sm hover:text-accent-light transition-colors">
          tozry.dev
        </Link>
        <p className="text-text-dim text-sm">
          © {new Date().getFullYear()} — tozry.dev — Tous droits réservés
        </p>
        <div className="flex items-center gap-5">
          {socialLinks.map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-accent text-sm transition-colors"
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}