import { useEffect, useState } from 'react'
import type { SupplierWithProducts } from '../../types/suppliers'
import { mockSuppliersService } from '../../services/suppliers.mock'
import { formatCurrency } from '../../utils/format'
import { Modal } from '../shared/Modal'
import { BoxIcon, MailIcon, MapPinIcon, PhoneIcon, TruckIcon } from '../ui/icons'

interface SupplierDetailDrawerProps {
  open: boolean
  onClose: () => void
  supplierId: string | null
}

export function SupplierDetailDrawer({
  open,
  onClose,
  supplierId,
}: SupplierDetailDrawerProps) {
  if (!open || !supplierId) return null
  return (
    <Modal open onClose={onClose} title="Supplier Details" maxWidth="lg">
      <DrawerBody key={supplierId} supplierId={supplierId} />
    </Modal>
  )
}

function DrawerBody({ supplierId }: { supplierId: string }) {
  const [supplier, setSupplier] = useState<SupplierWithProducts | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    mockSuppliersService
      .getById(supplierId)
      .then((s) => {
        if (!cancelled) setSupplier(s)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load supplier')
      })
    return () => {
      cancelled = true
    }
  }, [supplierId])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-40 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  const products = supplier.products ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <TruckIcon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {supplier.supplierName}
          </h3>
          <p className="text-sm text-gray-500">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-gray-100 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MailIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="break-all">{supplier.email ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <PhoneIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{supplier.phonenumber ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPinIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{supplier.address ?? '—'}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          Provided Products
        </h4>
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-8 text-gray-400">
            <BoxIcon className="h-8 w-8" />
            <span className="text-sm">No products from this supplier</span>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {products.map((product) => (
              <li
                key={product.productId}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.productName}
                  </p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}