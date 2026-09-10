function normalizeApiBaseUrl(raw: string | undefined): string {
  const fallback = 'http://localhost:3000/api'
  const trimmed = (raw ?? fallback).replace(/\/+$/, '')
  if (trimmed.length === 0) return fallback
  return trimmed.toLowerCase().endsWith('/api') ? trimmed : `${trimmed}/api`
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)

export const STORAGE_KEYS = {
  token: 'stockflow.token',
  user: 'stockflow.user',
} as const