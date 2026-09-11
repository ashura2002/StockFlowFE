import { useCallback, useEffect, useState } from 'react'
import type {
  CustomerOrderResponse,
  CreateOrderItem,
  OrderStatus,
  UpdateOrderItemRequest,
} from '../types/orders'
import { myOrdersService } from '../services/myOrders.service'
import { orderCounts } from '../utils/orderCounts'

export type MyOrdersTab = 'all' | OrderStatus

const PAGE_SIZE = 6

export function useMyOrders() {
  const [orders, setOrders] = useState<CustomerOrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<MyOrdersTab>('all')
  const [page, setPage] = useState(1)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await myOrdersService.list()
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

  const totalPages = Math.max(1, Math.ceil(tabFiltered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = tabFiltered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const handleTabChange = useCallback((next: MyOrdersTab) => {
    setTab(next)
    setPage(1)
  }, [])

  const createOrder = useCallback(
    async (items: CreateOrderItem[]): Promise<string> =>
      myOrdersService.create({ orderItems: items }),
    [],
  )

  const getDetails = useCallback(
    async (orderId: string): Promise<CustomerOrderResponse> =>
      myOrdersService.getDetails(orderId),
    [],
  )

  const cancelOrder = useCallback(
    async (orderId: string): Promise<void> => {
      await myOrdersService.cancel(orderId)
      await refresh()
    },
    [refresh],
  )

  const updateItems = useCallback(
    async (orderId: string, data: UpdateOrderItemRequest): Promise<void> => {
      await myOrdersService.updateItems(orderId, data)
      await refresh()
    },
    [refresh],
  )

  return {
    orders: paginated,
    allOrders: filteredByTabOrder(orders, tab),
    counts,
    loading,
    error,
    tab,
    page: safePage,
    totalPages,
    totalItems: tabFiltered.length,
    handleTabChange,
    setPage,
    refresh,
    createOrder,
    getDetails,
    cancelOrder,
    updateItems,
  }
}

function filteredByTabOrder(
  orders: CustomerOrderResponse[],
  tab: MyOrdersTab,
): CustomerOrderResponse[] {
  return tab === 'all' ? orders : orders.filter((o) => o.status === tab)
}
