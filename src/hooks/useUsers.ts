import { useCallback, useEffect, useState } from 'react'
import type { UserResponse } from '../types/users'
import { usersService } from '../services/users.service'

export type UserTab = 'active' | 'deleted'

const PAGE_SIZE = 8

export function useUsers() {
  const [active, setActive] = useState<UserResponse[]>([])
  const [deleted, setDeleted] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<UserTab>('active')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const [activeData, deletedData] = await Promise.all([
        usersService.getActive(),
        usersService.getDeleted(),
      ])
      setActive(activeData)
      setDeleted(deletedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const query = search.trim().toLowerCase()
  const filteredActive = query
    ? active.filter(
        (u) =>
          u.email?.toLowerCase().includes(query) ||
          u.userId.toLowerCase().includes(query),
      )
    : active

  const totalPages = Math.max(1, Math.ceil(filteredActive.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedActive = filteredActive.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const handleTabChange = useCallback((next: UserTab) => {
    setTab(next)
    setPage(1)
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const totalItems = tab === 'active' ? filteredActive.length : deleted.length

  return {
    activeUsers: paginatedActive,
    deletedUsers: deleted,
    activeCount: active.length,
    deletedCount: deleted.length,
    loading,
    error,
    tab,
    search,
    page: safePage,
    totalPages,
    totalItems,
    handleTabChange,
    handleSearch,
    setPage,
    refresh,
  }
}
