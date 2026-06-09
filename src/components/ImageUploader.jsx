// src/components/ImageUploader.jsx
import { useState, useRef } from 'react'
import { useStorage } from '../hooks/useStorage'

// Composant réutilisable — drag & drop + preview + suppression
export default function ImageUploader({ currentUrl, onUpload, onDelete }) {
  const { uploadImage, deleteImage, uploading, progress } = useStorage()
  const [preview, setPreview] = useState(currentUrl || null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  // Traitement fichier
  const handleFile = async (file) => {
    if (!file) return
    setError('')

    // Prévisualisation locale immédiate
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    // Upload vers Supabase Storage
    const result = await uploadImage(file)

    if (!result.success) {
      setError(result.error)
      setPreview(currentUrl || null) // Rétablir l'ancienne image
      return
    }

    // Notifier le parent avec l'URL publique
    onUpload(result.url)
  }

  // Suppression
  const handleDelete = async () => {
    if (!preview) return
    setError('')

    const result = await deleteImage(preview)
    if (!result.success) {
      setError(result.error)
      return
    }

    setPreview(null)
    onDelete()
  }

  // Drag & Drop
  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = () => setDragging(false)

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-text-dim mb-1">
        Image du projet
      </label>

      {/* Prévisualisation */}
      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-border">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-48 object-cover"
          />

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white text-sm rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Remplacer
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>

          {/* Barre de progression */}
          {uploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        /* Zone drag & drop */
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragging
              ? 'border-accent bg-accent/10 scale-[1.02]'
              : 'border-border hover:border-accent/50 hover:bg-surface'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full px-8">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-text-dim">Upload en cours...</p>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-mono text-accent">{progress}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <div className={`text-4xl mb-1 transition-transform ${dragging ? 'scale-125' : ''}`}>
                {dragging ? '📂' : '🖼️'}
              </div>
              <p className="text-sm font-medium text-text-dim">
                {dragging ? 'Relâcher pour uploader' : 'Glisser une image ici'}
              </p>
              <p className="text-xs text-muted">ou cliquer pour parcourir</p>
              <p className="text-xs text-muted mt-1">JPG, PNG, WEBP — max 3 MB</p>
            </div>
          )}
        </div>
      )}

      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <span className="text-red-400 text-sm">⚠️</span>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* URL publique copiable */}
      {preview && !preview.startsWith('data:') && (
        <div className="flex items-center gap-2 p-2.5 bg-surface rounded-lg border border-border">
          <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-xs font-mono text-text-dim truncate flex-1">{preview}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(preview)}
            className="text-xs text-accent hover:text-accent-light flex-shrink-0 transition-colors"
          >
            Copier
          </button>
        </div>
      )}
    </div>
  )
}