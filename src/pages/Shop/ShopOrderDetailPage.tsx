import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { CustomerOrderResponse } from '../../types/orders'
import { OrderStatus } from '../../types/orders'
import { mockMyOrdersService } from '../../services/myOrders.mock'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog'
import { formatCurrency, formatDateTime } from '../../utils/format'

export function ShopOrderDetailPage() {
  const { orderId = '' } = useParams()
  const [order, setOrder] = useState<CustomerOrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await mockMyOrdersService.getDetails(orderId)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  async function handleCancelConfirm() {
    if (!order) return
    setCancelError(null)
    setCancelling(true)
    try {
      await mockMyOrdersService.cancel(order.orderId)
      setConfirmOpen(false)
      await refresh()
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
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/shop/my-orders" className="hover:text-indigo-600">
          My Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">
          {order ? `#${order.orderId.slice(0, 8)}` : 'Order'}
        </span>
      </nav>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading || !order ? (
        <Card>
          <div className="space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-40 animate-pulse rounded bg-gray-100" />
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.orderId.slice(0, 8)}
                </h1>
                <p className="text-sm text-gray-500">
                  {formatDateTime(order.orderedAt)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Items ({order.items?.length ?? 0})
            </h2>
            <ul className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <li
                  key={item.orderItemId}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </Card>

          {order.status === OrderStatus.Pending && (
            <div className="flex justify-end">
              <Button
                variant="danger"
                onClick={() => {
                  setCancelError(null)
                  setConfirmOpen(true)
                }}
              >
                Cancel Order
              </Button>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
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
