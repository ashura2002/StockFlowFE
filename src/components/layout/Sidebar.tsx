import { NavLink } from 'react-router-dom'
import { navItems, type NavItem } from './sidebarNav'
import { IconButton } from '../ui/IconButton'
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons'

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onToggleCollapsed: () => void
  items?: NavItem[]
  brandLabel?: string
}

export function Sidebar({
  open,
  collapsed,
  onToggleCollapsed,
  items = navItems,
  brandLabel = 'StockFlow',
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-gray-200 bg-white transition-all duration-200 lg:translate-x-0 ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      } ${open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}`}
    >
      <div
        className={`flex h-16 items-center border-b border-gray-200 ${
          collapsed ? 'lg:justify-center lg:px-0' : 'lg:px-6'
        } px-6`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-white"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
            />
          </svg>
        </div>
        <span
          className={`ml-2 text-lg font-bold text-gray-900 whitespace-nowrap ${
            collapsed ? 'lg:hidden' : ''
          }`}
        >
          {brandLabel}
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              } ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
            <span
              className={`flex-1 whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}
            >
              {item.label}
            </span>
            {typeof item.badge === 'number' && item.badge > 0 && (
              <span
                className={`rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-semibold text-white ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-gray-200 lg:block">
        <div className={collapsed ? 'flex justify-center py-3' : 'px-3 py-3'}>
          <IconButton
            label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapsed}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </IconButton>
        </div>
      </div>
    </aside>
  )
}