import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useProfile } from '../hooks/useProfile'
import ProjectCard from '../components/ProjectCard'

const skills = [
  { name: 'Laravel / PHP',    icon: '🐘', level: 85 },
  { name: 'Flutter / Dart',   icon: '💙', level: 80 },
  { name: 'JavaScript',       icon: '⚡', level: 78 },
  { name: 'React / Vite',     icon: '⚛️', level: 72 },
  { name: 'Supabase / Firebase', icon: '🔥', level: 75 },
  { name: 'MySQL / SQLite',   icon: '🗄️', level: 70 },
]

function useTypewriter(words, speed = 70, pause = 1500) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1))
        if (text.length === current.length) {
          setTimeout(() => setDeleting(true), pause)
        }
      } else {
        setText(current.slice(0, text.length - 1))
        if (text.length === 0) {
          setDeleting(false)
          setIndex((i) => i + 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, speed, pause])

  return text
}

export default function Home() {
  const { projects, loading: loadingProjects } = useProjects({ featuredOnly: true })
  const { profile, loading: loadingProfile } = useProfile()

  const role = useTypewriter([
    'Développeur Web & Mobile',
    'Laravel · Flutter · React',
    'Étudiant Master DSI Réseaux',
  ], 70, 1500)

  return (
    <div className="dot-grid min-h-screen">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-accent px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {loadingProfile ? '...' : profile?.location || 'Kasserine, Tunisie'}
          </span>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
            Salut, je suis{' '}
            <span className="text-gradient">Tozri Mohamed</span>
          </h1>

          <div className="text-2xl md:text-3xl font-medium text-text-dim mb-6 h-10 flex items-center gap-1">
            <span>{role}</span>
            <span className="animate-blink text-accent">|</span>
          </div>

          <p className="text-text-dim max-w-xl leading-relaxed mb-10">
            {loadingProfile
              ? '...'
              : profile?.bio || 'Étudiant en Master Professionnel en Développement des Systèmes Informatiques et Réseaux.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-medium transition-all duration-200 glow"
            >
              Voir mes projets
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-accent text-text-dim hover:text-text rounded-xl font-medium transition-all duration-200"
            >
              Me contacter
            </Link>
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-accent text-text-dim hover:text-text rounded-xl font-medium transition-all duration-200"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Stats avec animation différée */}
        <div className="grid grid-cols-3 gap-6 mt-20 max-w-md animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          {[
            { value: '4+',  label: 'Projets réalisés' },
            { value: '3',   label: 'Langages maîtrisés' },
            { value: '2+',  label: 'Ans de formation' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-gradient">{value}</div>
              <div className="text-xs text-text-dim mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="max-w-6xl mx-auto px-6 py-20 animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-accent" />
          <h2 className="text-sm font-mono text-accent uppercase tracking-widest">
            Compétences
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(({ name, icon, level }, idx) => (
            <div
              key={name}
              className="glass rounded-xl p-4 hover:border-accent/30 transition-all duration-300 group animate-fade-up [animation-delay:${600 + idx * 100}ms] opacity-0 [animation-fill-mode:forwards]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <span className="text-xs font-mono text-accent">{level}%</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-1000"
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projets featured */}
      <section className="max-w-6xl mx-auto px-6 py-20 animate-fade-up [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-accent" />
            <h2 className="text-sm font-mono text-accent uppercase tracking-widest">
              Projets récents
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-sm text-text-dim hover:text-accent transition-colors"
          >
            Tous les projets →
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}