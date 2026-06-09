import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Hook central — CRUD complet projets via Supabase
export function useProjects({ featuredOnly = false } = {}) {
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  // ── Lecture ────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtre optionnel : projets mis en avant uniquement
    if (featuredOnly) query = query.eq('featured', true)

    const { data, error: err } = await query

    if (err) {
      setError(err.message)
      setProjects([])
    } else {
      setProjects(data || [])
    }

    setLoading(false)
  }, [featuredOnly])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  // ── Ajouter ────────────────────────────────────────────────────
  const addProject = async (project) => {
    const { data, error: err } = await supabase
      .from('projects')
      .insert([{
        title:        project.title,
        description:  project.description,
        image_url:    project.image_url    || null,
        github_url:   project.github_url   || null,
        demo_url:     project.demo_url     || null,
        technologies: project.technologies || [],
        featured:     project.featured     || false,
      }])
      .select()
      .single()

    if (err) return { success: false, error: err.message }

    // Mise à jour instantanée de l'interface (optimistic)
    setProjects((prev) => [data, ...prev])
    return { success: true, data }
  }

  // ── Modifier ───────────────────────────────────────────────────
  const updateProject = async (id, updates) => {
    const { data, error: err } = await supabase
      .from('projects')
      .update({
        title:        updates.title,
        description:  updates.description,
        image_url:    updates.image_url    || null,
        github_url:   updates.github_url   || null,
        demo_url:     updates.demo_url     || null,
        technologies: updates.technologies || [],
        featured:     updates.featured     || false,
      })
      .eq('id', id)
      .select()
      .single()

    if (err) return { success: false, error: err.message }

    // Mise à jour instantanée dans la liste locale
    setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    return { success: true, data }
  }

  // ── Supprimer ──────────────────────────────────────────────────
  const deleteProject = async (id) => {
    const { error: err } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (err) return { success: false, error: err.message }

    // Retrait instantané de la liste locale
    setProjects((prev) => prev.filter((p) => p.id !== id))
    return { success: true }
  }

  // ── Recherche ──────────────────────────────────────────────────
  const searchProjects = async (query) => {
    if (!query.trim()) { fetchProjects(); return }

    setLoading(true)
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (!err) setProjects(data || [])
    setLoading(false)
  }

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    searchProjects,
    refetch: fetchProjects,
  }
}