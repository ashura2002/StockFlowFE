import { useCallback, useEffect, useState } from 'react'
import type { AdminOrderResponse, OrderStatus } from '../types/orders'
import { ordersService } from '../services/orders.service'
import { orderCounts } from '../utils/orderCounts'

export type OrderTab = 'all' | OrderStatus

const PAGE_SIZE = 8

export function useOrders() {
  const [orders, setOrders] = useState<AdminOrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<OrderTab>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await ordersService.getAll()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const counts = orderCounts(orders)

  const tabFiltered =
    tab === 'all' ? orders : orders.filter((o) => o.status === tab)

  const query = search.trim().toLowerCase()
  const filtered = query
    ? tabFiltered.filter(
        (o) =>
          o.email?.toLowerCase().includes(query) ||
          o.orderId.toLowerCase().includes(query),
      )
    : tabFiltered

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleTabChange = useCallback((next: OrderTab) => {
    setTab(next)
    setPage(1)
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    orders: paginated,
    allOrders: filtered,
    counts,
    loading,
    error,
    tab,
    search,
    page: safePage,
    totalPages,
    totalItems: filtered.length,
    handleTabChange,
    handleSearch,
    setPage,
    refresh,
  }
}