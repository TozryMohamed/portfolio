import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Hook lecture du profil Mohamed depuis Supabase
export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data)
        setLoading(false)
      })
  }, [])

  return { profile, loading }
}