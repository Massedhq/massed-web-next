'use client'

import { useState, useEffect } from 'react'

const MASSED_IO = process.env.NODE_ENV === 'development' 
  ? null 
  : 'https://massed-web.vercel.app/'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAuth()
  }, [])

  async function initAuth() {
    const user = getUser()

    if (!user || !user.id) {
  if (MASSED_IO) {
    localStorage.removeItem('user')
    window.location.href = MASSED_IO
    return
  }
  // Development: use a test user
  const devUser = { id: 1, full_name: 'Test User', username: 'testuser', email: 'test@massed.io' }
  setUser(devUser)
  setLoading(false)
  return
}

    // Set state immediately (fast UI)
    setUser(user)
    setLoading(false)

    // Clean URL
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Refresh from DB in background
    fetchCurrentUser(user)
  }

  function getUser() {
    const params = new URLSearchParams(window.location.search)
    const userParam = params.get('user')

    if (userParam && userParam !== 'undefined') {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        localStorage.setItem('user', JSON.stringify(user))
        return user
      } catch (e) {
        console.error('❌ Failed to parse user param', e)
      }
    }

    const stored = localStorage.getItem('user')
    if (!stored || stored === 'undefined') return null

    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('❌ Corrupted user in storage, clearing...')
      localStorage.removeItem('user')
      return null
    }
  }

  async function fetchCurrentUser(user) {
    try {
      const res = await fetch(
        `https://www.massed.io/api/get-me?user_id=${user.id}`
      )
      const data = await res.json()
      if (!res.ok) {
        console.error('❌ getMe error:', data.error)
        return
      }
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (err) {
      console.error('🔥 getMe failed:', err)
    }
  }

  function logout() {
    localStorage.removeItem('user')
    window.location.href = MASSED_IO
  }

  return { user, loading, logout }
}