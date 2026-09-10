import { useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useOrders } from '../../hooks/useOrders'
import { useOrderActions, type OrderAction } from '../../hooks/useOrderActions'
import type { AdminOrderResponse } from '../../types/orders'
import { OrderStatus as OrderStatusConst } from '../../types/orders'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { IconButton } from '../../components/ui/IconButton'
import { Card } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { SearchIcon, CheckIcon, XIcon, CheckCircleIcon } from '../../components/ui/icons'
import { formatCurrency } from '../../utils/format'
import { OrdersTabs } from '../../components/orders/OrdersTabs'
import { OrderDetailDrawer } from '../../components/orders/OrderDetailDrawer'
import { OrderActionConfirm } from '../../components/orders/OrderActionConfirm'

export function OrdersPage() {
  const {
    orders,
    counts,
    loading,
    error,
    tab,
    search,
    page,
    totalPages,
    totalItems,
    handleTabChange,
    handleSearch,
    setPage,
    refresh,
  } = useOrders()

  const {
    confirm,
    action: runningAction,
    isRunning,
    error: actionError,
    setError: setActionError,
  } = useOrderActions(refresh)

  const [detailId, setDetailId] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<AdminOrderResponse | null>(null)

  const columns: Column<AdminOrderResponse>[] = useMemo(
    () => [
      {
        key: 'orderId',
        header: 'Order',
        render: (row) => (
          <span className="font-medium text-gray-900">
            {row.orderId.slice(0, 8)}
          </span>
        ),
      },
      {
        key: 'email',
        header: 'Customer',
        render: (row) => (
          <span className="block max-w-xs truncate text-gray-700">
            {row.email ?? '—'}
          </span>
        ),
      },
      {
        key: 'orderedAt',
        header: 'Date',
        render: (row) =>
          new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
          }).format(new Date(row.orderedAt)),
      },
      {
        key: 'totalPrice',
        header: 'Total',
        align: 'right',
        render: (row) => (
          <span className="font-medium text-gray-900">
            {formatCurrency(row.totalPrice)}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            {row.status === OrderStatusConst.Pending && (
              <>
                <IconButton
                  label="Cancel order"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActionError(null)
                    setCancelTarget(row)
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <XIcon className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Confirm order"
                  onClick={(e) => {
                    e.stopPropagation()
                    void confirm(row.orderId, 'confirm')
                  }}
                  disabled={isRunning}
                >
                  <CheckIcon className="h-4 w-4" />
                </IconButton>
              </>
            )}
            {row.status === OrderStatusConst.Confirmed && (
              <IconButton
                label="Complete order"
                onClick={(e) => {
                  e.stopPropagation()
                  void confirm(row.orderId, 'complete')
                }}
                disabled={isRunning}
              >
                <CheckCircleIcon className="h-4 w-4" />
              </IconButton>
            )}
          </div>
        ),
      },
    ],
    [confirm, isRunning, setActionError],
  )

  async function handleDetailAction(orderId: string, action: OrderAction) {
    await confirm(orderId, action)
  }

  async function handleCancelConfirm() {
    if (!cancelTarget) return
    setActionError(null)
    try {
      await confirm(cancelTarget.orderId, 'cancel')
      setCancelTarget(null)
    } catch {
      // error shown in dialog via actionError
    }
  }

  return (
    <PageContainer
      title="Orders"
      description={`${totalItems} order${totalItems !== 1 ? 's' : ''} shown`}
    >
      <Card>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <OrdersTabs tab={tab} counts={counts} onChange={handleTabChange} />
          <div className="md:w-64">
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders..."
              icon={<SearchIcon className="h-4 w-4" />}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-3">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-40 flex-1 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            data={orders}
            emptyMessage="No orders match the current filter"
            onRowClick={(row) => setDetailId(row.orderId)}
          />
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
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
      </Card>

      <OrderDetailDrawer
        open={detailId !== null}
        orderId={detailId}
        onClose={() => setDetailId(null)}
        onAction={handleDetailAction}
        runningAction={runningAction}
      />

      <OrderActionConfirm
        open={cancelTarget !== null}
        onClose={() => {
          setCancelTarget(null)
          setActionError(null)
        }}
        onConfirm={handleCancelConfirm}
        isLoading={runningAction === 'cancel'}
        error={actionError}
      />
    </PageContainer>
  )
}