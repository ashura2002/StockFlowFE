import type { NavItem } from '../layout/sidebarNav'
import {
  BellIcon,
  BoxesIcon,
  ClipboardIcon,
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
    { to: '/shop/profile', label: 'Profile', icon: UserCircleIcon },
  ]
}