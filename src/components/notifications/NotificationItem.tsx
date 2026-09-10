import type { NotificationResponse } from '../../types/notifications'
import { IconButton } from '../ui/IconButton'
import { CheckIcon, TrashIcon } from '../ui/icons'

interface NotificationItemProps {
  notification: NotificationResponse
  isRunning: boolean
  onMarkRead: (notificationId: string) => void
  onDeleteRequest: (notification: NotificationResponse) => void
}

export function NotificationItem({
  notification,
  isRunning,
  onMarkRead,
  onDeleteRequest,
}: NotificationItemProps) {
  const unread = !notification.isRead

  return (
    <div
      className={`flex items-start gap-3 px-5 py-4 transition-colors sm:px-6 ${
        unread ? 'bg-indigo-50/60' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          unread ? 'bg-indigo-500' : 'bg-gray-200'
        }`}
      />
      <p
        className={`min-w-0 flex-1 text-sm ${
          unread ? 'font-semibold text-gray-900' : 'font-normal text-gray-600'
        }`}
      >
        {notification.content ?? 'No content'}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        {unread && (
          <IconButton
            label="Mark as read"
            onClick={() => onMarkRead(notification.notificationId)}
            disabled={isRunning}
          >
            <CheckIcon className="h-4 w-4" />
          </IconButton>
        )}
        <IconButton
          label="Delete notification"
          onClick={() => onDeleteRequest(notification)}
          disabled={isRunning}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <TrashIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  )
}