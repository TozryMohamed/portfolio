// src/pages/Admin/AdminDashboard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProjects } from '../../hooks/useProjects'
import ImageUploader from '../../components/ImageUploader'

// ===================== Composant Field (déplacé hors de ProjectForm) =====================
const Field = ({ field, label, as, value, onChange, error, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-text-dim mb-1">{label}</label>
    {as === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        rows={3}
        className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-sm outline-none resize-none transition-all text-text"
        {...props}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-sm outline-none transition-all text-text"
        {...props}
      />
    )}
    {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
  </div>
)

// ===================== Formulaire projet (corrigé) =====================
function ProjectForm({ initial, onSave, onCancel, saving }) {
  const empty = {
    title: '',
    description: '',
    github_url: '',
    demo_url: '',
    technologies: '',
    featured: false,
    image_url: null,
  }

  // Initialisation paresseuse avec une fonction pour éviter de recalculer à chaque render
  const [data, setData] = useState(() =>
    initial
      ? {
          ...initial,
          technologies: Array.isArray(initial.technologies)
            ? initial.technologies.join(', ')
            : '',
          image_url: initial.image_url || null,
        }
      : empty
  )
  const [errors, setErrors] = useState({})

  // Gestionnaire générique pour tous les champs (forme fonctionnelle)
  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const e = {}
    if (!data.title.trim()) e.title = 'Titre requis'
    if (!data.description.trim()) e.description = 'Description requise'
    return e
  }

  const handleSave = () => {
    const err = validate()
    if (Object.keys(err).length) {
      setErrors(err)
      return
    }
    onSave({
      ...data,
      technologies: data.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image_url: data.image_url || null,
    })
  }

  const handleImageUpload = (url) => {
    setData((prev) => ({ ...prev, image_url: url }))
  }

  const handleImageDelete = () => {
    setData((prev) => ({ ...prev, image_url: null }))
  }

  const toggleFeatured = () => {
    setData((prev) => ({ ...prev, featured: !prev.featured }))
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold text-sm text-accent">
        {initial ? '✏️ Modifier le projet' : '➕ Nouveau projet'}
      </h3>

      <ImageUploader
        currentUrl={data.image_url}
        onUpload={handleImageUpload}
        onDelete={handleImageDelete}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          field="title"
          label="Titre *"
          value={data.title || ''}
          onChange={handleFieldChange}
          error={errors.title}
          placeholder="Mon projet"
        />
        <Field
          field="github_url"
          label="Lien GitHub"
          value={data.github_url || ''}
          onChange={handleFieldChange}
          error={errors.github_url}
          placeholder="https://github.com/..."
          type="url"
        />
      </div>

      <Field
        field="description"
        label="Description *"
        as="textarea"
        value={data.description || ''}
        onChange={handleFieldChange}
        error={errors.description}
        placeholder="Description du projet..."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          field="technologies"
          label="Technologies (séparées par virgules)"
          value={data.technologies || ''}
          onChange={handleFieldChange}
          error={errors.technologies}
          placeholder="React, Laravel, ..."
        />
        <Field
          field="demo_url"
          label="Lien Demo"
          value={data.demo_url || ''}
          onChange={handleFieldChange}
          error={errors.demo_url}
          placeholder="https://..."
          type="url"
        />
      </div>

      {/* Toggle featured */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={toggleFeatured}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            data.featured ? 'bg-accent' : 'bg-border'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              data.featured ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
        <span className="text-sm text-text-dim">Projet mis en avant (featured)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm rounded-lg transition-all flex items-center gap-2"
        >
          {saving && (
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {initial ? 'Mettre à jour' : 'Ajouter'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 border border-border text-text-dim hover:text-text text-sm rounded-lg transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

// ===================== Stat Card =====================
function StatCard({ label, value, icon, loading }) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        {loading ? (
          <div className="h-7 w-12 bg-border rounded animate-pulse mb-1" />
        ) : (
          <p className="text-2xl font-bold text-text">{value}</p>
        )}
        <p className="text-xs text-text-dim">{label}</p>
      </div>
    </div>
  )
}

// ===================== Dashboard Principal =====================
export default function AdminDashboard() {
  const { logout, user } = useAuth()
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()
  const navigate = useNavigate()

  const [view, setView] = useState('dashboard')
  const [editingProject, setEditing] = useState(null)
  const [deleteConfirm, setDelConfirm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const handleAdd = async (data) => {
    setSaving(true)
    const result = await addProject(data)
    setSaving(false)
    if (result.success) {
      setView('projects')
      showToast('✅ Projet ajouté avec succès')
    } else {
      showToast(`❌ Erreur : ${result.error}`, 'error')
    }
  }

  const handleUpdate = async (data) => {
    setSaving(true)
    const result = await updateProject(editingProject.id, data)
    setSaving(false)
    if (result.success) {
      setEditing(null)
      showToast('✅ Projet mis à jour')
    } else {
      showToast(`❌ Erreur : ${result.error}`, 'error')
    }
  }

  const handleDelete = async (id) => {
    const result = await deleteProject(id)
    setDelConfirm(null)
    if (result.success) {
      showToast('🗑️ Projet supprimé')
    } else {
      showToast(`❌ Erreur : ${result.error}`, 'error')
    }
  }

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'projects', icon: '🗂️', label: 'Projets' },
    { id: 'add', icon: '➕', label: 'Ajouter' },
  ]

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-16 md:w-56 border-r border-border flex flex-col py-6 px-2 md:px-4">
        <div className="font-mono text-accent font-medium text-sm mb-8 hidden md:block px-2">
          admin panel
        </div>
        <div className="text-xs text-muted hidden md:block px-2 mb-6 truncate">
          {user?.email}
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setView(id)
                setEditing(null)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                view === id
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-dim hover:text-text hover:bg-surface'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="hidden md:block">{label}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-dim hover:text-text hover:bg-surface transition-all"
          >
            <span>🌐</span>
            <span className="hidden md:block">Voir le site</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span>
            <span className="hidden md:block">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Toast */}
        {toast.msg && (
          <div
            className={`fixed top-4 right-4 z-50 glass rounded-xl px-4 py-3 text-sm animate-fade-in border ${
              toast.type === 'error'
                ? 'border-red-500/30 text-red-400'
                : 'border-accent/20 text-text'
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Dashboard */}
        {view === 'dashboard' && (
          <div className="animate-fade-up">
            <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Projets publiés"
                value={projects.length}
                icon="🗂️"
                loading={loading}
              />
              <StatCard
                label="Projets featured"
                value={projects.filter((p) => p.featured).length}
                icon="⭐"
                loading={loading}
              />
              <StatCard
                label="Technologies"
                value={new Set(projects.flatMap((p) => p.technologies || [])).size}
                icon="⚙️"
                loading={loading}
              />
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-sm">Projets récents</h2>
                <button
                  onClick={() => setView('projects')}
                  className="text-xs text-accent hover:text-accent-light"
                >
                  Tout voir →
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-border rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm">{p.title}</span>
                        {p.featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {p.technologies?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Liste Projets */}
        {view === 'projects' && !editingProject && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">
                Projets <span className="text-muted font-normal">({projects.length})</span>
              </h1>
              <button
                onClick={() => setView('add')}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white text-sm rounded-lg transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-medium text-text-dim uppercase tracking-wide">
                      Projet
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-text-dim uppercase tracking-wide hidden md:table-cell">
                      Technologies
                    </th>
                    <th className="text-center p-4 text-xs font-medium text-text-dim uppercase tracking-wide hidden lg:table-cell">
                      Featured
                    </th>
                    <th className="p-4 text-xs font-medium text-text-dim uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="p-4">
                          <div className="h-4 bg-border rounded animate-pulse w-40" />
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="h-4 bg-border rounded animate-pulse w-32" />
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="h-4 bg-border rounded animate-pulse w-8 mx-auto" />
                        </td>
                        <td className="p-4">
                          <div className="h-4 bg-border rounded animate-pulse w-16 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    projects.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                      >
                        <td className="p-4">
                          <p className="text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-text-dim truncate max-w-[200px]">
                            {p.description}
                          </p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {p.technologies?.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-xs px-2 py-0.5 rounded-full bg-bg border border-border text-muted"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell text-center">
                          {p.featured ? (
                            <span className="text-accent text-lg">★</span>
                          ) : (
                            <span className="text-border text-lg">☆</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditing(p)
                                setView('projects')
                              }}
                              className="p-1.5 rounded-lg hover:bg-accent/10 text-text-dim hover:text-accent transition-all"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDelConfirm(p.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-dim hover:text-red-400 transition-all"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {!loading && projects.length === 0 && (
                <div className="text-center py-12 text-text-dim text-sm">
                  Aucun projet.{' '}
                  <button
                    onClick={() => setView('add')}
                    className="text-accent hover:underline"
                  >
                    Ajouter le premier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formulaire modification */}
        {editingProject && (
          <div className="animate-fade-up max-w-2xl">
            <button
              onClick={() => setEditing(null)}
              className="text-text-dim hover:text-text text-sm mb-4 flex items-center gap-1"
            >
              ← Retour
            </button>
            <ProjectForm
              initial={editingProject}
              onSave={handleUpdate}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </div>
        )}

        {/* Formulaire ajout */}
        {view === 'add' && (
          <div className="animate-fade-up max-w-2xl">
            <button
              onClick={() => setView('projects')}
              className="text-text-dim hover:text-text text-sm mb-4 flex items-center gap-1"
            >
              ← Retour
            </button>
            <h1 className="text-xl font-semibold mb-6">Nouveau projet</h1>
            <ProjectForm
              onSave={handleAdd}
              onCancel={() => setView('projects')}
              saving={saving}
            />
          </div>
        )}
      </main>

      {/* Modal confirmation suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <h3 className="font-semibold mb-2">Confirmer la suppression</h3>
            <p className="text-text-dim text-sm mb-6">
              Cette action supprimera le projet de Supabase. Irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all"
              >
                Supprimer
              </button>
              <button
                onClick={() => setDelConfirm(null)}
                className="flex-1 py-2 border border-border text-text-dim hover:text-text text-sm rounded-lg transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}