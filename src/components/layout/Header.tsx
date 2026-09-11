import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useNotifications } from '../../context/NotificationContext'
import { IconButton } from '../ui/IconButton'
import {
  BellIcon,
  ChevronDownIcon,
  LogoutIcon,
  MenuIcon,
  ShoppingCartIcon,
} from '../ui/icons'

interface AppHeaderProps {
  onMenuClick: () => void
  variant?: 'admin' | 'shop'
}

export function AppHeader({ onMenuClick, variant = 'admin' }: AppHeaderProps) {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const initials = (user?.name ?? 'U S')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  function handleLogout() {
    setUserMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
      <IconButton label="Toggle sidebar" onClick={onMenuClick} className="lg:hidden">
        <MenuIcon />
      </IconButton>

      <div className="flex-1" />

      {variant === 'shop' ? (
        <>
          <button
            type="button"
            onClick={() => navigate('/shop/notifications')}
            aria-label="Notifications"
            title="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2.5 w-2.5" aria-hidden="true">
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/shop/cart')}
            aria-label="Cart"
            title="Cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ShoppingCartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/admin/notifications')}
          aria-label="Notifications"
          title="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5" aria-hidden="true">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          )}
        </button>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
        >
          {user?.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={`${user.name ?? 'User'} profile picture`}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              {initials}
            </span>
          )}
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {user?.name ?? 'User'}
          </span>
          <ChevronDownIcon className="hidden h-4 w-4 text-gray-400 sm:block" />
        </button>

        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setUserMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl bg-white py-1.5 shadow-lg ring-1 ring-gray-200">
              <div className="border-b border-gray-100 px-4 py-2.5">
                <p className="truncate text-sm font-medium text-gray-900">
                  {user?.name ?? 'User'}
                </p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogoutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}