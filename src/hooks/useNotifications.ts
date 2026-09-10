import { useCallback, useEffect, useMemo, useState } from 'react'
import type { NotificationResponse } from '../types/notifications'
import { mockNotificationsService } from '../services/notifications.mock'

export type NotificationFilter = 'all' | 'unread'

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [search, setSearch] = useState('')
  const [runningId, setRunningId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await mockNotificationsService.getAll()
      setNotifications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  )

  const query = search.trim().toLowerCase()
  const filtered = notifications.filter((n) => {
    const matchesFilter = filter === 'all' || !n.isRead
    const matchesSearch = query
      ? n.content?.toLowerCase().includes(query)
      : true
    return matchesFilter && matchesSearch
  })

  const markAsRead = useCallback(async (notificationId: string) => {
    setRunningId(notificationId)
    try {
      await mockNotificationsService.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n,
        ),
      )
    } finally {
      setRunningId(null)
    }
  }, [])

  const remove = useCallback(async (notificationId: string) => {
    setRunningId(notificationId)
    try {
      await mockNotificationsService.delete(notificationId)
      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== notificationId),
      )
    } finally {
      setRunningId(null)
    }
  }, [])

  const handleFilterChange = useCallback((next: NotificationFilter) => {
    setFilter(next)
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return {
    notifications: filtered,
    totalItems: filtered.length,
    allCount: notifications.length,
    unreadCount,
    loading,
    error,
    filter,
    search,
    runningId,
    markAsRead,
    remove,
    refresh,
    handleFilterChange,
    handleSearch,
  }
}