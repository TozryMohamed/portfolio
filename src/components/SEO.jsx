import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Met à jour le <title> et les meta dynamiquement selon la page
const pages = {
  '/': {
    title: 'Mohamed Tozri — Développeur Web & Mobile | Laravel · Flutter · React',
    description: 'Portfolio de Mohamed Tozri, étudiant en Master DSI Réseaux à l\'ISET Sfax. Spécialisé en développement web et mobile : Laravel, Flutter, React, Supabase.',
  },
  '/about': {
    title: 'À propos — Mohamed Tozri | Parcours & Compétences',
    description: 'Découvrez le parcours académique et les compétences de Mohamed Tozri : Master DSI Réseaux ISET Sfax, Licence ISET Kasserine, Laravel, Flutter, React, MySQL.',
  },
  '/projects': {
    title: 'Projets — Mohamed Tozri | Web & Mobile',
    description: 'Découvrez les projets de Mohamed Tozri : système de gestion des examens, app de recettes Flutter/Firebase, plateforme de location de véhicules et plus encore.',
  },
  '/contact': {
    title: 'Contact — Mohamed Tozri | Développeur Web & Mobile',
    description: 'Contactez Mohamed Tozri pour vos projets de développement web et mobile. Disponible pour des collaborations et opportunités.',
  },
}

export default function SEO() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = pages[pathname] || pages['/']

    // Titre
    document.title = meta.title

    // Meta description
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', meta.description)

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc  = document.querySelector('meta[property="og:description"]')
    const ogUrl   = document.querySelector('meta[property="og:url"]')
    if (ogTitle) ogTitle.setAttribute('content', meta.title)
    if (ogDesc)  ogDesc.setAttribute('content', meta.description)
    if (ogUrl)   ogUrl.setAttribute('content', `https://portfolio-phi-eight-vkhngik7nm.vercel.app${pathname}`)

    // Twitter
    const twTitle = document.querySelector('meta[name="twitter:title"]')
    const twDesc  = document.querySelector('meta[name="twitter:description"]')
    if (twTitle) twTitle.setAttribute('content', meta.title)
    if (twDesc)  twDesc.setAttribute('content', meta.description)

    // Canonical
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', `https://portfolio-phi-eight-vkhngik7nm.vercel.app${pathname}`)

  }, [pathname])

  return null
}