import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { NotificationResponse } from '../types/notifications'
import { notificationsService } from '../services/notifications.service'
import { useAuth } from './AuthContext'
import {
  NotificationsContext,
  type NotificationFilter,
} from './NotificationContext'

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [search, setSearch] = useState('')
  const [runningId, setRunningId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([])
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await notificationsService.getAll()
      setNotifications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

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
      await notificationsService.markAsRead(notificationId)
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
      await notificationsService.delete(notificationId)
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

  const value = useMemo(
    () => ({
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
    }),
    [
      filtered,
      notifications.length,
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
    ],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}