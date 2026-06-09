import { useState } from 'react'
import { supabase } from '../lib/supabase'

const BUCKET = 'projects-images'

export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)

  // ── Upload ─────────────────────────────────────────────────────
  const uploadImage = async (file) => {
    // Validation type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      return { success: false, error: 'Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.' }
    }

    // Validation taille (max 3 MB)
    if (file.size > 3 * 1024 * 1024) {
      return { success: false, error: 'Image trop lourde (max 3 MB).' }
    }

    setUploading(true)
    setProgress(0)

    // Nom unique : timestamp + nom nettoyé
    const ext      = file.name.split('.').pop()
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 40)
    const fileName = `${Date.now()}-${safeName}.${ext}`

    // Simulation progression (Supabase JS ne stream pas le progress)
    const ticker = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85))
    }, 150)

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    clearInterval(ticker)

    if (error) {
      setUploading(false)
      setProgress(0)
      return { success: false, error: error.message }
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path)

    setProgress(100)
    setTimeout(() => { setUploading(false); setProgress(0) }, 500)

    return { success: true, url: publicUrl, path: data.path }
  }

  // ── Suppression ────────────────────────────────────────────────
  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return { success: true }

    // Extraire le chemin depuis l'URL publique
    const path = extractPath(imageUrl)
    if (!path) return { success: false, error: 'Chemin introuvable' }

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path])

    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  return { uploadImage, deleteImage, uploading, progress }
}

// Extrait le chemin relatif depuis une URL Supabase Storage
function extractPath(url) {
  try {
    const marker = `/storage/v1/object/public/${BUCKET}/`
    const idx    = url.indexOf(marker)
    return idx !== -1 ? url.slice(idx + marker.length) : null
  } catch {
    return null
  }
}