// Timeline item compacte
function TimelineItem({ year, title, place, description, isLast }) {
  return (
    <div className="relative pl-8">
      {/* Ligne verticale */}
      {!isLast && <div className="absolute left-[7px] top-6 w-px h-full bg-border" />}
      {/* Point */}
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

const timeline = [
  {
    year: '2024 — Présent',
    title: 'Développeur Full-Stack Senior',
    place: 'TechCorp, Paris',
    description: 'Développement d\'applications SaaS B2B avec React, Next.js et Node.js. Lead technique sur 3 projets.',
  },
  {
    year: '2022 — 2024',
    title: 'Développeur Front-End',
    place: 'AgenceWeb, Lyon',
    description: 'Intégration et développement d\'interfaces utilisateurs modernes. Migration vers React et TypeScript.',
  },
  {
    year: '2021 — 2022',
    title: 'Master Informatique',
    place: 'Université de Lyon',
    description: 'Spécialisation en génie logiciel et systèmes distribués. Mémoire sur les micro-services.',
  },
  {
    year: '2019 — 2021',
    title: 'Licence Informatique',
    place: 'IUT de Grenoble',
    description: 'Formation en développement web, algorithmes et bases de données.',
  },
]

const techStack = [
  { cat: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Vue 3'] },
  { cat: 'Backend', items: ['Node.js', 'Express', 'Nest.js', 'Python', 'REST/GraphQL'] },
  { cat: 'Base de données', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'] },
  { cat: 'DevOps', items: ['Docker', 'GitHub Actions', 'Vercel', 'AWS S3', 'Linux'] },
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
          Développeur full-stack passionné avec 3 ans d'expérience dans la création d'applications web modernes.
          J'aime transformer des idées complexes en interfaces élégantes et des architectures robustes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Timeline */}
        <div>
          <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <span className="text-accent">◆</span> Parcours
          </h2>
          <div>
            {timeline.map((item, i) => (
              <TimelineItem key={i} {...item} isLast={i === timeline.length - 1} />
            ))}
          </div>
        </div>

        {/* Stack technique */}
        <div>
          <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <span className="text-accent">◆</span> Stack technique
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
                'Code propre & maintenable',
                'Performance & accessibilité',
                'Collaboration & communication',
                'Amélioration continue',
              ].map((v) => (
                <li key={v} className="flex items-center gap-2 text-sm text-text-dim">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
