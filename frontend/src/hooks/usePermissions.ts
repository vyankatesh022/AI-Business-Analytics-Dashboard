'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface PermissionContext {
  role: string | null
  permissions: string[]
  loading: boolean
}

export function usePermissions(): PermissionContext & { hasPermission: (p: string) => boolean } {
  const { user, session } = useAuth()
  const [role, setRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !session) {
        setRole(null)
        setPermissions([])
        setLoading(false)
        return
      }

      try {
        // In the real app, this calls your backend API
        // const res = await fetch('http://localhost:8000/api/v1/users/me', {
        //   headers: { Authorization: `Bearer ${session.access_token}` }
        // })
        // const data = await res.json()
        
        // Mocking for Phase 3 boilerplate setup
        setRole('Owner')
        setPermissions([
          'analytics.read', 'analytics.write',
          'datasets.read', 'datasets.write',
          'reports.read', 'reports.write',
          'predictions.read', 'predictions.run',
          'ai.read', 'ai.run',
          'billing.read', 'billing.manage',
          'organization.read', 'organization.manage',
          'user.read', 'user.manage',
          'audit.read'
        ])
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [user, session])

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  return { role, permissions, loading, hasPermission }
}
