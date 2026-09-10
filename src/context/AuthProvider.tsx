import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { AuthResponse, LoginPayload, Role, User } from '../types/auth'
import { authService } from '../services/auth.service'
import { STORAGE_KEYS } from '../utils/constants'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.user)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      localStorage.removeItem(STORAGE_KEYS.user)
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.token),
  )

  const login = useCallback(async (payload: LoginPayload): Promise<User> => {
    const response: AuthResponse = await authService.login(payload)
    localStorage.setItem(STORAGE_KEYS.token, response.accessToken)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
    return response.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((next: User) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(next))
    setUser(next)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      role: user?.role ?? null,
      hasRole: (role: Role) => Boolean(user && user.role === role),
      login,
      logout,
      updateUser,
    }),
    [user, token, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}