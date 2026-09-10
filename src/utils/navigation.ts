import type { Role } from '../types/auth'

export function homePathForRole(role: Role | null): string {
  if (role === null) return '/login'
  if (role === 2) return '/shop'
  return '/admin/dashboard'
}