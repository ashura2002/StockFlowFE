interface UsersTabsProps {
  tab: 'active' | 'deleted'
  activeCount: number
  deletedCount: number
  onChange: (tab: 'active' | 'deleted') => void
}

export function UsersTabs({
  tab,
  activeCount,
  deletedCount,
  onChange,
}: UsersTabsProps) {
  const tabs = [
    { value: 'active' as const, label: 'Active', count: activeCount },
    { value: 'deleted' as const, label: 'Deleted', count: deletedCount },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ value, label, count }) => {
        const active = tab === value
        return (
          <button
            key={value}
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