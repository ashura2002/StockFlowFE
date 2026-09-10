import { useCallback, useEffect, useState } from 'react'
import type { SupplierResponse } from '../types/suppliers'
import { mockSuppliersService } from '../services/suppliers.mock'

const PAGE_SIZE = 5

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await mockSuppliersService.getAll()
      setSuppliers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const filtered = search
    ? suppliers.filter((s) =>
        s.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()),
      )
    : suppliers

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    suppliers: paginated,
    allSuppliers: filtered,
    loading,
    error,
    search,
    page: safePage,
    totalPages,
    totalItems: filtered.length,
    handleSearch,
    setPage,
    refresh,
  }
}