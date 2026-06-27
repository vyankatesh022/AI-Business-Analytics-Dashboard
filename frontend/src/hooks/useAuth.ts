'use client'

import { useEffect, useState } from 'react'

// Dummy User interface since we're not importing Supabase
interface User {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock a logged in user for UI dev purposes
    const mockUser = {
      id: '123',
      email: 'admin@enterprise.ai',
    }
    
    setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 500)
  }, [])

  return { user, session: null, loading, signOut: () => setUser(null) }
}
