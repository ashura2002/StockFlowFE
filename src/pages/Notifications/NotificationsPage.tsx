import { useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { SearchIcon, BellIcon } from '../../components/ui/icons'
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog'
import { useNotifications, type NotificationFilter } from '../../hooks/useNotifications'
import type { NotificationResponse } from '../../types/notifications'
import { NotificationItem } from '../../components/notifications/NotificationItem'

const filters: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
]

export function NotificationsPage() {
  const {
    notifications,
    totalItems,
    allCount,
    unreadCount,
    loading,
    error,
    filter,
    search,
    runningId,
    markAsRead,
    remove,
    handleFilterChange,
    handleSearch,
  } = useNotifications()

  const [deleteTarget, setDeleteTarget] = useState<NotificationResponse | null>(
    null,
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await remove(deleteTarget.notificationId)
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete notification',
      )
    }
  }

  return (
    <PageContainer
      title="Notifications"
      description={`${totalItems} notification${totalItems !== 1 ? 's' : ''} shown`}
    >
      <Card className="p-0 sm:p-0">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-2">
            {filters.map(({ value, label }) => {
              const count = value === 'unread' ? unreadCount : allCount
              const active = filter === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleFilterChange(value)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                      active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="sm:w-64">
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search notifications..."
              icon={<SearchIcon className="h-4 w-4" />}
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:m-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-1 p-5 sm:p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 px-2 py-4"
              >
                <div className="h-3 w-3 rounded-full bg-gray-200" />
                <div className="h-4 w-full max-w-md rounded bg-gray-200" />
                <div className="h-8 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BellIcon className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {search.trim() || filter === 'unread'
                ? 'No notifications match the current filter'
                : 'You have no notifications'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                isRunning={runningId === notification.notificationId}
                onMarkRead={(id) => void markAsRead(id)}
                onDeleteRequest={setDeleteTarget}
              />
            ))}
          </ul>
        )}
      </Card>

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onClose={() => {
          setDeleteTarget(null)
          setDeleteError(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        isLoading={runningId === deleteTarget?.notificationId}
        error={deleteError}
      />
    </PageContainer>
  )
}