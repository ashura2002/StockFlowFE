import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProductDetails } from '../../hooks/useProductDetails'
import { useCart } from '../../context/CartContext'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/format'

export function ShopProductDetailPage() {
  const { productId = '' } = useParams()
  const { product, loading, error } = useProductDetails(productId)
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)

  const inStock = (product?.stock ?? 0) > 0

  function handleAdd() {
    if (!product) return
    add(product.productId, Math.min(quantity, product.stock))
  }

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/shop" className="hover:text-indigo-600">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product?.productName ?? 'Product'}</span>
      </nav>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading || !product ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-72 animate-pulse rounded-xl bg-gray-200" />
          <div className="space-y-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
            {product.productImageUrl ? (
              <img
                src={product.productImageUrl}
                alt={product.productName ?? 'Product'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-7xl font-bold text-gray-300">
                {product.productName?.charAt(0).toUpperCase() ?? 'P'}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={inStock ? 'success' : 'error'}>
                {inStock ? 'In stock' : 'Out of stock'}
              </Badge>
              {product.category && (
                <span className="text-sm text-gray-500">{product.category}</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {product.productName ?? 'Untitled product'}
            </h1>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {formatCurrency(product.price)}
            </p>

            {product.productDescriptions && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {product.productDescriptions}
              </p>
            )}

            {product.supplier && (
              <p className="mt-4 break-words text-xs text-gray-400">
                Supplied by {product.supplier}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
              <div className="sm:w-40">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() =>
                      setQuantity((q) => Math.min(q + 1, product.stock))
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                variant={inStock ? 'primary' : 'secondary'}
                disabled={!inStock}
                onClick={handleAdd}
                className="flex-1"
              >
                {inStock ? 'Add to Cart' : 'Sold Out'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
