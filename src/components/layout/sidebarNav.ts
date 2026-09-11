import type { ComponentType } from 'react'
import {
  BellIcon,
  BoxesIcon,
  ClipboardIcon,
  DashboardIcon,
  SettingsIcon,
  TagIcon,
  TruckIcon,
  UserCircleIcon,
  UsersIcon,
} from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
  badge?: number
  children?: NavItem[]
}

export const navItems: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/admin/products', label: 'Products', icon: BoxesIcon },
  { to: '/admin/categories', label: 'Category', icon: TagIcon },
  { to: '/admin/suppliers', label: 'Suppliers', icon: TruckIcon },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/notifications', label: 'Notifications', icon: BellIcon },
  {
    to: '/admin/settings/profile',
    label: 'Settings',
    icon: SettingsIcon,
    children: [
      { to: '/admin/settings/profile', label: 'Profile', icon: UserCircleIcon },
      { to: '/admin/settings/account', label: 'Account', icon: SettingsIcon },
    ],
  },
]