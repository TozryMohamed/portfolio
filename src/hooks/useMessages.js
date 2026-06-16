import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useMessages() {
  const [messages, setMessages]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [unreadCount, setUnread]  = useState(0)

  // ── Lecture (admin uniquement) ─────────────────────────────────
  const fetchMessages = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setMessages(data || [])
      setUnread((data || []).filter((m) => !m.read).length)
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  // ── Marquer comme lu ───────────────────────────────────────────
  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      )
      setUnread((n) => Math.max(0, n - 1))
    }
  }

  // ── Marquer tous comme lus ────────────────────────────────────
  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('read', false)

    if (!error) {
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })))
      setUnread(0)
    }
  }

  // ── Supprimer ──────────────────────────────────────────────────
  const deleteMessage = async (id) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }

    setMessages((prev) => prev.filter((m) => m.id !== id))
    setUnread((prev) =>
      messages.find((m) => m.id === id && !m.read) ? prev - 1 : prev
    )
    return { success: true }
  }

  // ── Envoi public (formulaire Contact) ─────────────────────────
  const sendMessage = async ({ name, email, subject, message }) => {
    const { error } = await supabase
      .from('messages')
      .insert([{ name, email, subject, message }])

    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  return {
    messages,
    loading,
    unreadCount,
    fetchMessages,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    sendMessage,
  }
}