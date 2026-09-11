import { createContext, useContext } from 'react'
import type { NotificationResponse } from '../types/notifications'

export type NotificationFilter = 'all' | 'unread'

export interface NotificationsContextValue {
  notifications: NotificationResponse[]
  totalItems: number
  allCount: number
  unreadCount: number
  loading: boolean
  error: string | null
  filter: NotificationFilter
  search: string
  runningId: string | null
  markAsRead: (notificationId: string) => Promise<void>
  remove: (notificationId: string) => Promise<void>
  refresh: () => Promise<void>
  handleFilterChange: (next: NotificationFilter) => void
  handleSearch: (value: string) => void
}

export const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined)

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}