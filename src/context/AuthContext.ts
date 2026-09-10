import { createContext, useContext } from 'react'
import type { LoginPayload, Role, User } from '../types/auth'

export interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  role: Role | null
  hasRole: (role: Role) => boolean
  login: (payload: LoginPayload) => Promise<User>
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}