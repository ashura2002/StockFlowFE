import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useCatalog } from '../../hooks/useCatalog'
import { useMyOrders } from '../../hooks/useMyOrders'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { TrashIcon } from '../../components/ui/icons'
import { formatCurrency } from '../../utils/format'
import type { ProductResponse } from '../../types/products'

export function ShopCartPage() {
  const { lines, updateQuantity, remove, clear, toOrderItems } = useCart()
  const { allProducts } = useCatalog()
  const { createOrder } = useMyOrders()
  const navigate = useNavigate()

  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items = lines
    .map((line) => {
      const product = allProducts.find((p) => p.productId === line.productId)
      return product ? { ...line, product } : null
    })
    .filter((entry): entry is { productId: string; quantity: number; product: ProductResponse } =>
      entry !== null,
    )

  const subtotal = items.reduce(
    (sum, entry) => sum + (entry.product?.price ?? 0) * entry.quantity,
    0,
  )

  async function placeOrder() {
    setError(null)
    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }
    setPlacing(true)
    try {
      const orderId = await createOrder(toOrderItems())
      clear()
      navigate(`/shop/my-orders/${orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white py-16 text-center ring-1 ring-gray-100">
        <p className="text-5xl">🛒</p>
        <p className="text-sm font-medium text-gray-700">Your cart is empty</p>
        <Link
          to="/shop"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <Link to="/shop" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Continue shopping
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
<ul className="divide-y divide-gray-100 rounded-xl bg-white ring-1 ring-gray-100 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <li key={product.productId} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 sm:px-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-300">
                {product.productName?.charAt(0).toUpperCase() ?? 'P'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {product.productName}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(product.price)} each
                </p>
              </div>
              <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
                    onClick={() => updateQuantity(product.productId, quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
                    onClick={() =>
                      updateQuantity(product.productId, quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="w-20 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(product.price * quantity)}
                </div>
                <IconButton
                  label="Remove item"
                  onClick={() => remove(product.productId)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl bg-white p-6 ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Items ({lengthCount(items)})</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mb-4 flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="mb-6 flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button className="w-full" isLoading={placing} onClick={placeOrder}>
            Place Order
          </Button>
        </aside>
      </div>
    </div>
  )
}

function lengthCount(items: { quantity: number }[]): number {
  return items.reduce((sum, entry) => sum + entry.quantity, 0)
}
