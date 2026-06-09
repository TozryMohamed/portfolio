// Carte projet — compatible champs Supabase (technologies[], github_url, demo_url)
export default function ProjectCard({ project, compact = false }) {
  const {
    title,
    description,
    technologies,
    github_url,
    demo_url,
    image_url,
    color,
  } = project

  // Couleur générée depuis le titre si pas de couleur définie
  const cardColor = color || stringToColor(title || '')

  return (
    <div className="group relative rounded-2xl border border-border bg-surface hover:border-accent/40 transition-all duration-300 overflow-hidden">

      {/* Image ou placeholder coloré */}
      {image_url ? (
        <img
          src={image_url}
          alt={title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div
          className="h-44 flex items-center justify-center text-4xl font-bold font-mono opacity-20 group-hover:opacity-30 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${cardColor}22, ${cardColor}44)` }}
        >
          {title?.slice(0, 2).toUpperCase()}
        </div>
      )}

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-text font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-1">
          {title}
        </h3>

        {!compact && (
          <p className="text-text-dim text-sm leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tech badges — champ technologies[] Supabase */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {technologies?.slice(0, compact ? 2 : 4).map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-2 py-0.5 rounded-full border border-border text-text-dim"
            >
              {t}
            </span>
          ))}
          {technologies?.length > 4 && !compact && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-border text-muted">
              +{technologies.length - 4}
            </span>
          )}
        </div>

        {/* Liens — champs github_url / demo_url Supabase */}
        <div className="flex items-center gap-3">
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-dim hover:text-text transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          )}
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Génère une couleur hex cohérente depuis une chaîne
function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += value.toString(16).padStart(2, '0')
  }
  return color
}