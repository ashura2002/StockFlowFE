import { useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useProducts } from '../../hooks/useProducts'
import { useProductMutations } from '../../hooks/useProductMutations'
import type { MockProductRow } from '../../services/products.mock'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { IconButton } from '../../components/ui/IconButton'
import { Card } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { SearchIcon, PlusIcon, PencilIcon, TrashIcon } from '../../components/ui/icons'
import { formatCurrency } from '../../utils/format'
import { ProductForm } from '../../components/products/ProductForm'
import { ProductDetailDrawer } from '../../components/products/ProductDetailDrawer'
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog'

type FormMode = { type: 'closed' } | { type: 'create' } | { type: 'edit'; product: MockProductRow }

export function ProductsPage() {
  const {
    products,
    categories,
    suppliers,
    loading,
    error,
    search,
    page,
    totalPages,
    totalItems,
    handleSearch,
    setPage,
    refresh,
  } = useProducts()

  const { create, update, remove, saving } = useProductMutations(refresh)

  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<MockProductRow | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const columns: Column<MockProductRow>[] = useMemo(
    () => [
      { key: 'productName', header: 'Product', render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
            {(row.productName ?? '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{row.productName}</p>
            <p className="text-xs text-gray-500 truncate">{row.supplier}</p>
          </div>
        </div>
      )},
      { key: 'price', header: 'Price', align: 'right', render: (row) => (
        <span className="font-medium text-gray-900">{formatCurrency(row.price)}</span>
      )},
      { key: 'category', header: 'Category', render: (row) => (
        <span className="text-gray-700">{row.category}</span>
      )},
      { key: 'stock', header: 'Stock', align: 'right', render: (row) => {
        const low = row.stock <= 10
        return (
          <span className={low ? 'font-medium text-red-600' : 'font-medium text-gray-900'}>
            {row.stock}
            {low && ' Low'}
          </span>
        )
      }},
      { key: 'supplier', header: 'Supplier' },
      { key: 'actions', header: 'Action', align: 'right', render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton
            label="Edit"
            onClick={(e) => {
              e.stopPropagation()
              setFormMode({ type: 'edit', product: row })
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </IconButton>
          <IconButton
            label="Delete"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteTarget(row)
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </div>
      )},
    ],
    [],
  )

  async function handleFormSubmit(data: Record<string, unknown>) {
    if (formMode.type === 'create') {
      await create(data as Omit<MockProductRow, 'productId'>)
    } else if (formMode.type === 'edit' && formMode.product) {
      await update(formMode.product.productId, {
        productName: data.productName as string,
        price: data.price as number,
        stock: data.stock as number,
        productDescriptions: (data.productDescriptions as string) || null,
      })
    }
    setFormMode({ type: 'closed' })
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await remove(deleteTarget.productId)
    setDeleteTarget(null)
  }

  return (
    <PageContainer
      title="Products"
      description={`${totalItems} product${totalItems !== 1 ? 's' : ''} total`}
      actions={
        <Button onClick={() => setFormMode({ type: 'create' })}>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Add Product
        </Button>
      }
    >
      <Card>
        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            icon={<SearchIcon className="h-4 w-4" />}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-3">
                <div className="h-9 w-9 rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            data={products}
            emptyMessage="No products found"
            onRowClick={(row) => setDetailId(row.productId)}
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

      <ProductForm
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        onSubmit={handleFormSubmit}
        product={formMode.type === 'edit' ? formMode.product : undefined}
        categories={categories}
        suppliers={suppliers}
        saving={saving}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.productName}"? This action cannot be undone.`
            : ''
        }
        isLoading={saving}
      />

      <ProductDetailDrawer
        open={detailId !== null}
        productId={detailId}
        onClose={() => setDetailId(null)}
      />
    </PageContainer>
  )
}