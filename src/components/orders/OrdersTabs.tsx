import type { OrderStatus } from '../../types/orders'
import type { OrderTab } from '../../hooks/useOrders'
import { orderStatusMeta } from '../ui/orderStatusMeta'
import { OrderStatus as OrderStatusConst } from '../../types/orders'

interface OrdersTabsProps {
  tab: OrderTab
  counts: Record<OrderStatus, number>
  onChange: (tab: OrderTab) => void
}

const tabDefinitions: { value: OrderTab; label: string }[] = [
  { value: 'all', label: 'All' },
  {
    value: OrderStatusConst.Pending,
    label: orderStatusMeta[OrderStatusConst.Pending].label,
  },
  {
    value: OrderStatusConst.Confirmed,
    label: orderStatusMeta[OrderStatusConst.Confirmed].label,
  },
  {
    value: OrderStatusConst.Completed,
    label: orderStatusMeta[OrderStatusConst.Completed].label,
  },
  {
    value: OrderStatusConst.Cancelled,
    label: orderStatusMeta[OrderStatusConst.Cancelled].label,
  },
]

export function OrdersTabs({ tab, counts, onChange }: OrdersTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabDefinitions.map(({ value, label }) => {
        const count =
          value === 'all'
            ? Object.values(counts).reduce((sum, c) => sum + c, 0)
            : counts[value as OrderStatus]
        const active = tab === value
        return (
          <button
            key={String(value)}
            type="button"
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              active
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}