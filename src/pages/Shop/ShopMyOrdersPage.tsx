import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyOrders, type MyOrdersTab } from '../../hooks/useMyOrders'
import { OrderStatus } from '../../types/orders'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { orderStatusMeta } from '../../components/ui/orderStatusMeta'
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog'
import { formatCurrency, formatDateTime } from '../../utils/format'
import type { CustomerOrderResponse } from '../../types/orders'

const tabs: { value: MyOrdersTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: OrderStatus.Pending, label: orderStatusMeta[OrderStatus.Pending].label },
  { value: OrderStatus.Confirmed, label: orderStatusMeta[OrderStatus.Confirmed].label },
  { value: OrderStatus.Completed, label: orderStatusMeta[OrderStatus.Completed].label },
  { value: OrderStatus.Cancelled, label: orderStatusMeta[OrderStatus.Cancelled].label },
]

export function ShopMyOrdersPage() {
  const {
    orders,
    counts,
    loading,
    error,
    tab,
    page,
    totalPages,
    handleTabChange,
    setPage,
    cancelOrder,
  } = useMyOrders()
  const navigate = useNavigate()

  const [cancelTarget, setCancelTarget] = useState<CustomerOrderResponse | null>(
    null,
  )
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  async function handleCancelConfirm() {
    if (!cancelTarget) return
    setCancelError(null)
    setCancelling(true)
    try {
      await cancelOrder(cancelTarget.orderId)
      setCancelTarget(null)
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : 'Failed to cancel order',
      )
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500">Track and manage your orders</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map(({ value, label }) => {
          const count =
            value === 'all'
              ? Object.values(counts).reduce((sum, c) => sum + c, 0)
              : counts[value as OrderStatus]
          const active = tab === value
          return (
            <button
              key={String(value)}
              type="button"
              onClick={() => handleTabChange(value)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
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

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <p className="py-10 text-center text-sm text-gray-500">
            No orders in this category.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.orderId}>
              <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-100 transition-shadow hover:shadow-md">
                <button
                  type="button"
                  onClick={() => navigate(`/shop/my-orders/${order.orderId}`)}
                  className="w-full text-left"
                >
                  <span className="block p-5">
                    <span className="flex flex-wrap items-center justify-between gap-3">
                      <span>
                        <span className="block text-sm font-semibold text-gray-900">
                          Order #{order.orderId.slice(0, 8)}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {formatDateTime(order.orderedAt)}
                        </span>
                      </span>
                      <StatusBadge status={order.status} />
                    </span>
                    <span className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-500">
                        {order.items?.length ?? 0} item
                        {(order.items?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </span>
                  </span>
                </button>
                {order.status === OrderStatus.Pending && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
                    <span className="text-xs text-gray-500">
                      You can cancel while the order is pending.
                    </span>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setCancelError(null)
                        setCancelTarget(order)
                      }}
                    >
                      Cancel Order
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={cancelTarget !== null}
        onClose={() => {
          setCancelTarget(null)
          setCancelError(null)
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        isLoading={cancelling}
        error={cancelError}
      />
    </div>
  )
}
