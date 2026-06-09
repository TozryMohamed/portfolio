// src/pages/Contact.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Composant Field (déplacé hors de Contact pour éviter les remounts)
const Field = ({ name, label, value, onChange, error, ...props }) => {
  const { as, ...rest } = props
  return (
    <div>
      <label className="block text-sm font-medium text-text-dim mb-1.5">{label}</label>
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={5}
          className={`w-full bg-surface border rounded-xl px-4 py-3 text-sm text-text placeholder-muted outline-none transition-all resize-none ${
            error ? 'border-red-500/50' : 'border-border focus:border-accent'
          }`}
          {...rest}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full bg-surface border rounded-xl px-4 py-3 text-sm text-text placeholder-muted outline-none transition-all ${
            error ? 'border-red-500/50' : 'border-border focus:border-accent'
          }`}
          {...rest}
        />
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    if (submitError) setSubmitError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Le nom est requis'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email invalide'
    if (!form.subject.trim()) e.subject = 'Le sujet est requis'
    if (form.message.trim().length < 10) e.message = 'Message trop court (min. 10 caractères)'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) {
      setErrors(err)
      return
    }

    setLoading(true)
    setSubmitError('')

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }
      ])

    setLoading(false)

    if (error) {
      console.error('Erreur Supabase:', error)
      setSubmitError("Une erreur s'est produite. Veuillez réessayer plus tard.")
      return
    }

    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
  }

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'mohamedtozri465@gmail.com' },
    { icon: '📍', label: 'Localisation', value: 'Kasserine, Tunisie' },
    { icon: '⏱️', label: 'Disponibilité', value: 'Immédiate' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-accent" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">Contact</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Travaillons <span className="text-gradient">ensemble</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Infos de contact */}
        <div>
          <p className="text-text-dim leading-relaxed mb-8">
            Étudiant en Master Professionnel en Développement des Systèmes Informatiques et Réseaux,
            spécialisé en développement web et mobile avec Laravel, Flutter, PHP et MySQL.
            Disponible pour des missions freelance ou des opportunités à temps plein.
          </p>

          <div className="space-y-4">
            {contactInfo.map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 glass rounded-xl">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div>
          {sent ? (
            <div className="glass rounded-2xl p-8 text-center animate-fade-in">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Message envoyé !</h3>
              <p className="text-text-dim text-sm mb-6">Je vous répondrai dans les plus brefs délais.</p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-accent hover:text-accent-light transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                name="name"
                label="Nom complet"
                value={form.name}
                onChange={handleFieldChange}
                error={errors.name}
                placeholder="Mohamed Tozri"
                type="text"
              />
              <Field
                name="email"
                label="Adresse email"
                value={form.email}
                onChange={handleFieldChange}
                error={errors.email}
                placeholder="mohamedtozri465@gmail.com"
                type="email"
              />
              <Field
                name="subject"
                label="Sujet"
                value={form.subject}
                onChange={handleFieldChange}
                error={errors.subject}
                placeholder="Ex: Demande de devis, Collaboration, ..."
                type="text"
              />
              <Field
                name="message"
                label="Message"
                value={form.message}
                onChange={handleFieldChange}
                error={errors.message}
                placeholder="Décrivez votre projet..."
                as="textarea"
              />

              {submitError && (
                <div className="text-red-400 text-sm text-center p-2 rounded-lg bg-red-500/10">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 glow flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}