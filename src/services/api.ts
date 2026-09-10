import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '../types/api'
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  <T>(response: AxiosResponse<T>): AxiosResponse<T> => response,
  (error: unknown): Promise<never> => {
    const apiError = normalizeApiError(error)
    return Promise.reject(apiError)
  },
)

function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const data = error.response?.data
    const message =
      extractErrorMessage(data) ?? error.message ?? 'An unexpected error occurred'
    const errors = extractFieldErrors(data)
    return { status, message, errors }
  }
  return { status: 0, message: 'An unexpected error occurred' }
}

function extractErrorMessage(data: unknown): string | null {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data.trim()
  }
  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>
    const candidate = record.message ?? record.detail ?? record.title
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim()
    }
  }
  return null
}

function extractFieldErrors(
  data: unknown,
): Record<string, string[]> | undefined {
  if (typeof data !== 'object' || data === null) return undefined
  const record = data as Record<string, unknown>
  const errors = record.errors
  if (typeof errors !== 'object' || errors === null) return undefined
  const fieldErrors: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    fieldErrors[key] = Array.isArray(value)
      ? value.map(String)
      : [String(value)]
  }
  return fieldErrors
}

export default api