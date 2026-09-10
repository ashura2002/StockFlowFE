import type { ReactNode } from 'react'
import type { DashboardResponseDto } from '../../types/dashboard'
import { formatCurrency, formatNumber } from '../../utils/format'
import { Card } from '../ui/Card'
import {
  ArrowUpRightIcon,
  ClipboardListIcon,
  DollarIcon,
  TrendDownIcon,
} from '../ui/icons'

interface StatCardProps {
  label: string
  value: string
  icon: ReactNode
  trend?: { label: string; positive: boolean }
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 !p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p
            className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.positive ? (
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            ) : (
              <TrendDownIcon className="h-3.5 w-3.5" />
            )}
            {trend.label}
          </p>
        )}
      </div>
    </Card>
  )
}

interface StatCardGridProps {
  stats: DashboardResponseDto
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  const cards: StatCardProps[] = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarIcon className="h-6 w-6" />,
      trend: { label: `${stats.totalOrders} orders`, positive: true },
    },
    {
      label: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      icon: <ClipboardListIcon className="h-6 w-6" />,
      trend: {
        label: `${stats.completedOrders} completed`,
        positive: true,
      },
    },
    {
      label: 'Pending Orders',
      value: formatNumber(stats.pendingOrders),
      icon: <ClipboardListIcon className="h-6 w-6" />,
      trend: { label: 'Awaiting action', positive: false },
    },
    {
      label: 'Cancelled Orders',
      value: formatNumber(stats.cancelledOrders),
      icon: <TrendDownIcon className="h-6 w-6" />,
      trend: { label: 'Refunds needed', positive: false },
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          trend={card.trend}
        />
      ))}
    </div>
  )
}