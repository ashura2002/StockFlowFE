import { useEffect, useState } from 'react'
import type { UserResponse } from '../../types/users'
import { usersService } from '../../services/users.service'
import { formatDate } from '../../utils/format'
import { Modal } from '../shared/Modal'
import { RoleBadge } from '../ui/RoleBadge'
import { MailIcon, UsersIcon } from '../ui/icons'

interface UserDetailDrawerProps {
  open: boolean
  onClose: () => void
  userId: string | null
}

export function UserDetailDrawer({
  open,
  onClose,
  userId,
}: UserDetailDrawerProps) {
  if (!open || !userId) return null
  return (
    <Modal open onClose={onClose} title="User Details" maxWidth="md">
      <DrawerBody key={userId} userId={userId} />
    </Modal>
  )
}

interface DrawerBodyProps {
  userId: string
}

function DrawerBody({ userId }: DrawerBodyProps) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    usersService
      .getById(userId)
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load user')
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <UsersIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {user.email ?? 'No email'}
          </p>
          <RoleBadge role={user.role} />
        </div>
      </div>

      <dl className="divide-y divide-gray-100 rounded-lg border border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="flex items-center gap-2 text-sm text-gray-500">
            <MailIcon className="h-4 w-4" />
            Email
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {user.email ?? '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-gray-500">User ID</dt>
          <dd className="max-w-[60%] truncate text-right text-xs font-medium text-gray-700">
            {user.userId}
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-gray-500">Joined</dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatDate(user.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  )
}