import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissions } from '../hooks/usePermissions'
import * as useAuthHook from '../hooks/useAuth'

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

describe('usePermissions hook', () => {
  it('should return loading initially and default state without user', () => {
    // Mock user as null
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signOut: vi.fn()
    } as any)

    const { result } = renderHook(() => usePermissions())
    
    // Initially without a user it clears everything
    expect(result.current.role).toBe(null)
    expect(result.current.permissions).toEqual([])
    expect(result.current.hasPermission('analytics.read')).toBe(false)
  })

  // Testing the mock Owner behavior we set up in the hook
  it('should return owner permissions if user is present', async () => {
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: { id: 'user-1' },
      session: { access_token: 'token' },
      loading: false,
      signOut: vi.fn()
    } as any)

    const { result } = renderHook(() => usePermissions())

    // Wait for async effect
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(result.current.role).toBe('Owner')
    expect(result.current.hasPermission('analytics.read')).toBe(true)
    expect(result.current.hasPermission('reports.write')).toBe(true)
  })
})
