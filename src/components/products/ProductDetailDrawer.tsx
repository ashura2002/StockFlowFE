import { useEffect, useState } from 'react'
import type { ProductResponse } from '../../types/products'
import { productsService } from '../../services/products.service'
import { formatCurrency } from '../../utils/format'
import { Modal } from '../shared/Modal'
import { Badge } from '../ui/Badge'
import { BoxIcon } from '../ui/icons'

interface ProductDetailDrawerProps {
  open: boolean
  onClose: () => void
  productId: string | null
}

export function ProductDetailDrawer({
  open,
  onClose,
  productId,
}: ProductDetailDrawerProps) {
  if (!open || !productId) {
    return null
  }
  return (
    <Modal open onClose={onClose} title="Product Details" maxWidth="lg">
      <DrawerBody key={productId} productId={productId} />
    </Modal>
  )
}

function DrawerBody({ productId }: { productId: string }) {
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    productsService
      .getById(productId)
      .then((p) => {
        if (!cancelled) setProduct(p)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load product')
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <div className="aspect-video animate-pulse rounded-lg bg-gray-200" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {product.productImageUrl ? (
          <img
            src={product.productImageUrl}
            alt={product.productName ?? 'Product'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <BoxIcon className="h-10 w-10" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-900">
            {product.productName}
          </h3>
          {product.category && (
            <Badge variant="neutral">{product.category}</Badge>
          )}
        </div>

        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(product.price)}
        </p>

        <p
          className={`text-sm font-medium ${
            product.stock <= 10 ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          Stock: {product.stock}
          {product.stock <= 10 && ' (Low)'}
        </p>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-500">Supplier</p>
          <p className="text-sm font-medium text-gray-900">
            {product.supplier ?? '—'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p className="text-sm text-gray-700">
            {product.productDescriptions ?? 'No description'}
          </p>
        </div>
      </div>
    </div>
  )
}