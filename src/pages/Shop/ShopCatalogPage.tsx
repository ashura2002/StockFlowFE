import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../hooks/useCatalog'
import { useCart } from '../../context/CartContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { SearchIcon } from '../../components/ui/icons'
import { formatCurrency } from '../../utils/format'
import type { ProductResponse } from '../../types/products'

const PAGE_SIZE = 8

export function ShopCatalogPage() {
  const {
    products,
    categories,
    activeCategory,
    loading,
    error,
    search,
    page,
    totalPages,
    totalItems,
    handleSearch,
    handleCategoryChange,
    setPage,
    allProducts,
  } = useCatalog()
  const { add } = useCart()
  const navigate = useNavigate()

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="text-sm text-gray-500">
            {totalItems} product{totalItems !== 1 ? 's' : ''}
            {activeCategory ? ` in ${activeCategory}` : ''}
          </p>
        </div>
        <div className="md:w-80">
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            icon={<SearchIcon className="h-4 w-4" />}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && totalItems > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <CategoryChip
            label="All"
            count={allProducts.length}
            active={activeCategory === null}
            onClick={() => handleCategoryChange(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.name}
              label={cat.name}
              count={cat.count}
              active={activeCategory === cat.name}
              onClick={() => handleCategoryChange(cat.name)}
            />
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-white p-4 ring-1 ring-gray-100"
            >
              <div className="h-36 rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-white py-16 text-center text-sm text-gray-500 ring-1 ring-gray-100">
          {activeCategory
            ? `No products found in ${activeCategory}.`
            : 'No products match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onView={() => navigate(`/shop/product/${product.productId}`)}
              onAdd={() => add(product.productId, 1)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
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

      {search.trim() && (
        <p className="mt-6 text-xs text-gray-400">
          Searching {allProducts.length} products.
        </p>
      )}
    </div>
  )
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function ProductCard({
  product,
  onView,
  onAdd,
}: {
  product: ProductResponse
  onView: () => void
  onAdd: () => void
}) {
  const inStock = product.stock > 0
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-gray-100 transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onView}
        className="flex h-36 w-full items-center justify-center bg-gray-100 overflow-hidden"
        aria-label={`View ${product.productName ?? 'product'}`}
      >
        {product.productImageUrl ? (
          <img
            src={product.productImageUrl}
            alt={product.productName ?? 'Product'}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-gray-300">
            {product.productName?.charAt(0).toUpperCase() ?? 'P'}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <Badge variant={inStock ? 'success' : 'error'}>
            {inStock ? 'In stock' : 'Out of stock'}
          </Badge>
          {product.category && (
            <span className="text-xs text-gray-400">{product.category}</span>
          )}
        </div>

        <button
          type="button"
          onClick={onView}
          className="truncate text-left text-sm font-semibold text-gray-900 hover:text-indigo-600"
        >
          {product.productName ?? 'Untitled product'}
        </button>

        <p className="mt-auto pt-3 text-lg font-bold text-gray-900">
          {formatCurrency(product.price)}
        </p>

        <Button
          className="mt-3 w-full"
          variant={inStock ? 'primary' : 'secondary'}
          disabled={!inStock}
          onClick={onAdd}
        >
          {inStock ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </div>
    </div>
  )
}
