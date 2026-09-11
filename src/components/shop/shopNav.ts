import type { NavItem } from '../layout/sidebarNav'
import {
  BellIcon,
  BoxesIcon,
  ClipboardIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '../ui/icons'

export function shopNavItems(cartCount = 0): NavItem[] {
  return [
    { to: '/shop', label: 'Shop', icon: BoxesIcon, end: true },
    { to: '/shop/my-orders', label: 'My Orders', icon: ClipboardIcon },
    {
      to: '/shop/cart',
      label: 'Cart',
      icon: ShoppingCartIcon,
      badge: cartCount,
    },
    { to: '/shop/notifications', label: 'Notifications', icon: BellIcon },
    {
      to: '/shop/settings/profile',
      label: 'Settings',
      icon: SettingsIcon,
      children: [
        { to: '/shop/settings/profile', label: 'Profile', icon: UserCircleIcon },
        { to: '/shop/settings/account', label: 'Account', icon: SettingsIcon },
      ],
    },
  ]
}