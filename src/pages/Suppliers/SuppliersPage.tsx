import { useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useSupplierMutations } from '../../hooks/useSupplierMutations'
import type { SupplierResponse } from '../../types/suppliers'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { IconButton } from '../../components/ui/IconButton'
import { Card } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import {
  SearchIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
} from '../../components/ui/icons'
import { SupplierForm } from '../../components/suppliers/SupplierForm'
import { SupplierDetailDrawer } from '../../components/suppliers/SupplierDetailDrawer'
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog'

type FormMode =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; supplier: SupplierResponse }

export function SuppliersPage() {
  const {
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
  } = useSuppliers()
  const { create, update, remove, saving } = useSupplierMutations(refresh)

  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<SupplierResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const columns: Column<SupplierResponse>[] = useMemo(
    () => [
      {
        key: 'supplierName',
        header: 'Supplier',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TruckIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900">
                {row.supplierName}
              </p>
              <p className="truncate text-xs text-gray-500">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'phoneNumber',
        header: 'Phone',
        render: (row) => (
          <span className="text-gray-700">{row.phoneNumber ?? '—'}</span>
        ),
      },
      {
        key: 'address',
        header: 'Address',
        render: (row) => (
          <span className="block max-w-md truncate text-gray-500">
            {row.address ?? '—'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            <IconButton
              label="Edit"
              onClick={(e) => {
                e.stopPropagation()
                setFormMode({ type: 'edit', supplier: row })
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </IconButton>
            <IconButton
              label="Delete"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteError(null)
                setDeleteTarget(row)
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4" />
            </IconButton>
          </div>
        ),
      },
    ],
    [],
  )

  async function handleFormSubmit(data: {
    supplierName: string
    email: string
    phoneNumber: string
    address: string
  }) {
    if (formMode.type === 'create') {
      await create(data)
    } else if (formMode.type === 'edit' && formMode.supplier) {
      await update(formMode.supplier.supplierId, data)
    }
    setFormMode({ type: 'closed' })
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await remove(deleteTarget.supplierId)
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete supplier',
      )
    }
  }

  return (
    <PageContainer
      title="Suppliers"
      description={`${totalItems} supplier${totalItems !== 1 ? 's' : ''} total`}
      actions={
        <Button onClick={() => setFormMode({ type: 'create' })}>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Add Supplier
        </Button>
      }
    >
      <Card>
        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search suppliers..."
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
                <div className="h-4 w-40 flex-1 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            data={suppliers}
            emptyMessage="No suppliers found"
            onRowClick={(row) => setDetailId(row.supplierId)}
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

      <SupplierForm
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        onSubmit={handleFormSubmit}
        supplier={formMode.type === 'edit' ? formMode.supplier : undefined}
        saving={saving}
      />

      <SupplierDetailDrawer
        open={detailId !== null}
        supplierId={detailId}
        onClose={() => setDetailId(null)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onClose={() => {
          setDeleteTarget(null)
          setDeleteError(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Supplier"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.supplierName}"? This action cannot be undone.`
            : ''
        }
        isLoading={saving}
        error={deleteError}
      />
    </PageContainer>
  )
}