import { useEffect, useState } from 'react'
import type { DashboardResponseDto } from '../types/dashboard'
import { dashboardService } from '../services/dashboard.service'
import type { ApiError } from '../types/api'

interface UseDashboardResult {
  data: DashboardResponseDto | null
  isLoading: boolean
  error: string | null
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const result = await dashboardService.getDashboard()
        if (!cancelled) setData(result)
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : (err as ApiError).message ?? 'Failed to load dashboard'
          setError(message)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, isLoading, error }
}