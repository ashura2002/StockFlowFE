import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navItems, type NavItem } from './sidebarNav'
import { IconButton } from '../ui/IconButton'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '../ui/icons'

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onToggleCollapsed: () => void
  items?: NavItem[]
  brandLabel?: string
}

function isPathActive(path: string, current: string) {
  return current === path || current.startsWith(`${path}/`)
}

function GroupItem({
  item,
  collapsed,
  onToggleCollapsed,
}: {
  item: NavItem
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(() =>
    item.children?.some((child) => isPathActive(child.to, pathname)),
  )

  const showChildren = expanded || Boolean(item.children?.some((child) => isPathActive(child.to, pathname)))

  return (
    <div>
      <button
        type="button"
        onClick={() => (collapsed ? onToggleCollapsed() : setExpanded(!expanded))}
        title={collapsed ? item.label : undefined}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          collapsed ? 'lg:justify-center lg:px-0' : ''
        } ${
          showChildren
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
        <span
          className={`flex-1 whitespace-nowrap text-left ${collapsed ? 'lg:hidden' : ''}`}
        >
          {item.label}
        </span>
        {!collapsed && (
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 transition-transform ${showChildren ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {showChildren && !collapsed && (
        <div className="mt-0.5 ml-3 space-y-0.5 border-l border-gray-200 pl-3">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              title={collapsed ? child.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
              <span className="flex-1 whitespace-nowrap">{child.label}</span>
              {typeof child.badge === 'number' && child.badge > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                  {child.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
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
          <img
            src="/Stockflow.png"
            alt={brandLabel}
            className="h-6 w-6 rounded object-contain"
          />
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
        {items.map((item) =>
          item.children?.length ? (
            <GroupItem
              key={item.to}
              item={item}
              collapsed={collapsed}
              onToggleCollapsed={onToggleCollapsed}
            />
          ) : (
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
          ),
        )}
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