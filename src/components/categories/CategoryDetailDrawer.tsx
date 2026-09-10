import { useEffect, useState } from 'react'
import type { CategoryWithProducts } from '../../types/categories'
import { mockCategoriesService } from '../../services/categories.mock'
import { formatCurrency } from '../../utils/format'
import { Modal } from '../shared/Modal'
import { BoxIcon, TagIcon } from '../ui/icons'

interface CategoryDetailDrawerProps {
  open: boolean
  onClose: () => void
  categoryId: string | null
}

export function CategoryDetailDrawer({
  open,
  onClose,
  categoryId,
}: CategoryDetailDrawerProps) {
  if (!open || !categoryId) return null
  return (
    <Modal open onClose={onClose} title="Category Details" maxWidth="lg">
      <DrawerBody key={categoryId} categoryId={categoryId} />
    </Modal>
  )
}

function DrawerBody({ categoryId }: { categoryId: string }) {
  const [category, setCategory] = useState<CategoryWithProducts | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    mockCategoriesService
      .getById(categoryId)
      .then((c) => {
        if (!cancelled) setCategory(c)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load category')
      })
    return () => {
      cancelled = true
    }
  }, [categoryId])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!category) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-40 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  const products = category.products ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <TagIcon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {category.categoryName}
          </h3>
          <p className="text-sm text-gray-500">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-700">
        {category.categoryDescriptions ?? 'No description'}
      </p>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Products</h4>
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-8 text-gray-400">
            <BoxIcon className="h-8 w-8" />
            <span className="text-sm">No products in this category</span>
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
                  <p className="text-xs text-gray-500">
                    Stock: {product.stock}
                  </p>
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