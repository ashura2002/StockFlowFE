import { useEffect, useState } from 'react'
import type { AdminOrderResponse } from '../../types/orders'
import { OrderStatus } from '../../types/orders'
import { mockOrdersService } from '../../services/orders.mock'
import type { OrderAction } from '../../hooks/useOrderActions'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { Modal } from '../shared/Modal'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/StatusBadge'
import { ClipboardListIcon } from '../ui/icons'

interface OrderDetailDrawerProps {
  open: boolean
  onClose: () => void
  orderId: string | null
  onAction?: (orderId: string, action: OrderAction) => Promise<void>
  runningAction?: OrderAction | null
}

export function OrderDetailDrawer({
  open,
  onClose,
  orderId,
  onAction,
  runningAction = null,
}: OrderDetailDrawerProps) {
  if (!open || !orderId) return null
  return (
    <Modal open onClose={onClose} title="Order Details" maxWidth="lg">
      <DrawerBody
        key={orderId}
        orderId={orderId}
        onAction={onAction}
        runningAction={runningAction}
      />
    </Modal>
  )
}

interface DrawerBodyProps {
  orderId: string
  onAction?: (orderId: string, action: OrderAction) => Promise<void>
  runningAction?: OrderAction | null
}

function DrawerBody({ orderId, onAction, runningAction }: DrawerBodyProps) {
  const [order, setOrder] = useState<AdminOrderResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    mockOrdersService
      .getById(orderId)
      .then((o) => {
        if (!cancelled) setOrder(o)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load order')
      })
    return () => {
      cancelled = true
    }
  }, [orderId])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-40 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  const items = order.items ?? []
  const pending = order.status === OrderStatus.Pending
  const confirmed = order.status === OrderStatus.Confirmed

  const currentOrderId = order.orderId

  async function handleAction(action: OrderAction) {
    if (!onAction) return
    await onAction(currentOrderId, action)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            Order #{order.orderId.slice(0, 8)}
          </p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(order.totalPrice)}
          </p>
          <p className="text-sm text-gray-500">{order.email ?? '—'}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="text-xs text-gray-500">
        Placed {formatDateTime(order.orderedAt)}
      </p>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
          <ClipboardListIcon className="h-4 w-4 text-gray-400" />
          Items ({items.length})
        </h4>
        {items.length === 0 ? (
          <div className="rounded-lg bg-gray-50 py-8 text-center text-sm text-gray-400">
            No items
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {items.map((item) => (
              <li
                key={item.orderItemId}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-gray-900">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(pending || confirmed) && onAction && (
        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
          {pending && (
            <>
              <Button
                variant="danger"
                onClick={() => void handleAction('cancel')}
                isLoading={runningAction === 'cancel'}
                disabled={runningAction !== null}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleAction('confirm')}
                isLoading={runningAction === 'confirm'}
                disabled={runningAction !== null}
              >
                Confirm
              </Button>
            </>
          )}
          {confirmed && (
            <Button
              onClick={() => void handleAction('complete')}
              isLoading={runningAction === 'complete'}
              disabled={runningAction !== null}
            >
              Complete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}