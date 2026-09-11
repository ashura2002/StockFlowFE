import { NavLink, useLocation } from 'react-router-dom'
import { LockIcon, TrashIcon } from '../ui/icons'

const ACCOUNT_SEGMENT = '/settings/account'

function accountBase(pathname: string): string {
  const idx = pathname.indexOf(ACCOUNT_SEGMENT)
  return idx >= 0 ? pathname.slice(0, idx + ACCOUNT_SEGMENT.length) : ''
}

interface Tab {
  to: string
  label: string
  icon: typeof LockIcon
}

export function AccountSettingsTabs() {
  const { pathname } = useLocation()
  const base = accountBase(pathname)

  const tabs: Tab[] = [
    { to: `${base}/password`, label: 'Change Password', icon: LockIcon },
    { to: `${base}/delete`, label: 'Delete Account', icon: TrashIcon },
  ]

  return (
    <nav
      aria-label="Account settings"
      className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <tab.icon className="h-4 w-4" />
          <span className="truncate">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}