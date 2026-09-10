import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Card } from '../ui/Card'
import {
  BoxesIcon,
  ClipboardListIcon,
  PlusIcon,
  ShoppingCartIcon,
  TruckIcon,
} from '../ui/icons'

interface QuickAction {
  to: string
  label: string
  icon: ReactNode
}

const actions: QuickAction[] = [
  { to: '/admin/products', label: 'Add Product', icon: <PlusIcon className="h-5 w-5" /> },
  { to: '/admin/products', label: 'Adjust Stock', icon: <BoxesIcon className="h-5 w-5" /> },
  { to: '/admin/orders', label: 'New Order', icon: <ShoppingCartIcon className="h-5 w-5" /> },
  { to: '/admin/suppliers', label: 'Add Supplier', icon: <TruckIcon className="h-5 w-5" /> },
]

export function QuickActions() {
  return (
    <Card className="!p-5">
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 px-3 py-4 text-center text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span className="text-indigo-600">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>
      <Link
        to="/admin/orders"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <ClipboardListIcon className="h-4 w-4" />
        View All Orders
      </Link>
    </Card>
  )
}