import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'

// Skeleton loader — affiché pendant le chargement
function ProjectSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden animate-pulse">
      <div className="h-44 bg-border" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-border rounded w-2/3" />
        <div className="h-3 bg-border rounded w-full" />
        <div className="h-3 bg-border rounded w-4/5" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-16 bg-border rounded-full" />
          <div className="h-5 w-16 bg-border rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects, loading, error } = useProjects()
  const [filter, setFilter]          = useState('Tous')
  const [search, setSearch]          = useState('')

  // Extraire les techs uniques depuis les tableaux technologies[]
  const allTechs = [
    'Tous',
    ...new Set(projects.flatMap((p) => p.technologies || [])),
  ]

  // Filtrage local : tech + recherche textuelle
  const filtered = projects.filter((p) => {
    const matchTech  = filter === 'Tous' || p.technologies?.includes(filter)
    const matchSearch =
      !search.trim() ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    return matchTech && matchSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">

      {/* ── Header ── */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-accent" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            Portfolio
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Mes <span className="text-gradient">Projets</span>
        </h1>
        <p className="text-text-dim mt-4 max-w-xl">
          {loading ? '...' : `${projects.length} projet${projects.length > 1 ? 's' : ''} — de l'idée à la production.`}
        </p>
      </div>

      {/* ── Barre de recherche ── */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border focus:border-accent rounded-xl pl-11 pr-4 py-3 text-sm text-text outline-none transition-all placeholder-muted"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Filtres tech ── */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-10">
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                filter === tech
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-text-dim hover:border-accent/40 hover:text-text'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* ── Erreur ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
          ⚠️ Erreur de chargement : {error}
        </div>
      )}

      {/* ── Skeletons ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <ProjectSkeleton key={i} />)}
        </div>
      )}

      {/* ── Liste projets ── */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-text-dim">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium">Aucun projet trouvé</p>
          <p className="text-sm mt-1">
            {search ? `Aucun résultat pour "${search}"` : 'Aucun projet avec cette technologie'}
          </p>
          <button
            onClick={() => { setFilter('Tous'); setSearch('') }}
            className="mt-4 text-sm text-accent hover:text-accent-light transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}