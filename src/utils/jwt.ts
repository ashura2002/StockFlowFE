import { Role } from '../types/auth'

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

function decodePayload(token: string): unknown {
  const parts = token.split('.')
  if (parts.length < 2) return null
  const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const decoded = atob(base64Url + padding)
  return JSON.parse(decodeURIComponent(
    Array.from(decoded, (c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
  ))
}

function claimToRole(value: unknown): Role | null {
  const normalized = String(value)
  const numeric = Number(normalized)
  if (numeric === Role.Admin) return Role.Admin
  if (numeric === Role.Customer) return Role.Customer
  const lower = normalized.toLowerCase()
  if (lower === 'admin') return Role.Admin
  if (lower === 'customer') return Role.Customer
  return null
}

export function decodeJwtRole(accessToken: string): Role | null {
  try {
    const payload = decodePayload(accessToken)
    if (typeof payload !== 'object' || payload === null) return null
    const claims = payload as Record<string, unknown>
    const role = claims.role ?? claims[ROLE_CLAIM] ?? claims.Role
    return claimToRole(role)
  } catch {
    return null
  }
}