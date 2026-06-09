// src/pages/About.jsx
import { Link } from 'react-router-dom'

// Timeline compacte
function TimelineItem({ year, title, place, description, isLast }) {
  return (
    <div className="relative pl-8">
      {!isLast && <div className="absolute left-[7px] top-6 w-px h-full bg-border" />}
      <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-accent bg-bg" />
      <div className="pb-10">
        <span className="text-xs font-mono text-accent">{year}</span>
        <h3 className="font-semibold text-text mt-0.5">{title}</h3>
        <p className="text-sm text-text-dim mb-1">{place}</p>
        <p className="text-sm text-text-dim leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Données du CV
const education = [
  {
    year: '2025 — Présent',
    title: 'Master Professionnel en Développement des Systèmes Informatiques et Réseaux',
    place: 'ISET Sfax',
    description: 'Spécialisation en développement web et mobile (Laravel, Flutter, PHP, MySQL).',
  },
  {
    year: '2022 — 2025',
    title: 'Licence en Technologie d’Informatique',
    place: 'ISET Kasserine',
    description: 'Formation en développement d’applications, bases de données et réseaux.',
  },
  {
    year: '2020 — 2021',
    title: 'Baccalauréat en Économie et gestion',
    place: 'Lycée secondaire Thelepte',
    description: 'Section économique et gestion.',
  },
]

const techStack = [
  { cat: 'Front-End', items: ['JavaScript', 'HTML', 'CSS', 'jQuery', 'Bootstrap', 'Flutter', 'Dart'] },
  { cat: 'Back-End', items: ['PHP', 'Firebase', 'Supabase'] },
  { cat: 'Base de données', items: ['MySQL'] },
  { cat: 'Framework', items: ['Laravel'] },
]

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      {/* Header */}
      <div className="mb-16 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-accent" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">À propos</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Qui suis-<span className="text-gradient">je</span> ?
        </h1>
        <p className="text-text-dim max-w-2xl leading-relaxed text-lg">
          Étudiant en Master Professionnel en Développement des Systèmes Informatiques et Réseaux,
          spécialisé en développement web et mobile avec Laravel, Flutter, PHP et MySQL.
          Passionné par la création d’applications performantes et intuitives.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Parcours (éducation) */}
        <div>
          <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <span className="text-accent">◆</span> Formation
          </h2>
          <div>
            {education.map((item, i) => (
              <TimelineItem
                key={i}
                year={item.year}
                title={item.title}
                place={item.place}
                description={item.description}
                isLast={i === education.length - 1}
              />
            ))}
          </div>

          {/* Langues */}
          <div className="mt-8">
            <h3 className="text-sm font-mono text-accent mb-3">Langues</h3>
            <div className="flex flex-wrap gap-2">
              {['Arabe (natif)', 'Anglais (courant)', 'Français (intermédiaire)'].map((lang) => (
                <span
                  key={lang}
                  className="text-sm px-3 py-1 rounded-lg bg-surface border border-border text-text-dim"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Centres d'intérêt */}
          <div className="mt-6">
            <h3 className="text-sm font-mono text-accent mb-3">Centres d’intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {['Jeux vidéo', 'Développement créatif', 'Tech & innovations'].map((interest) => (
                <span
                  key={interest}
                  className="text-sm px-3 py-1 rounded-lg bg-surface border border-border text-text-dim"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stack technique */}
        <div>
          <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <span className="text-accent">◆</span> Compétences techniques
          </h2>
          <div className="space-y-6">
            {techStack.map(({ cat, items }) => (
              <div key={cat}>
                <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-sm px-3 py-1 rounded-lg bg-surface border border-border text-text-dim hover:border-accent/40 hover:text-text transition-all cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Valeurs */}
          <div className="mt-10 glass rounded-2xl p-5">
            <p className="text-sm font-mono text-accent mb-3">// Mes valeurs</p>
            <ul className="space-y-2">
              {[
                'Code propre et maintenable',
                'Veille technologique continue',
                'Travail en équipe et partage',
                'Solutions centrées utilisateur',
              ].map((v) => (
                <li key={v} className="flex items-center gap-2 text-sm text-text-dim">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  {v}
                </li>
              ))}
            </ul>
          </div>

          {/* Bouton vers projets (optionnel) */}
          <div className="mt-8 text-center md:text-left">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
            >
              Voir mes réalisations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}