import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ProductResponse } from '../types/products'
import { catalogService } from '../services/catalog.service'

const PAGE_SIZE = 8
const SEARCH_DEBOUNCE_MS = 350

export function useCatalog() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = search.trim()
        ? await catalogService.search(search.trim())
        : await catalogService.list()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const delay = search.trim() ? SEARCH_DEBOUNCE_MS : 0
    const id = setTimeout(() => {
      void refresh()
    }, delay)
    return () => clearTimeout(id)
  }, [refresh, search])

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of products) {
      const name = (product.category ?? '').trim()
      if (!name) continue
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

  const categoryFiltered = useMemo(
    () =>
      category === null
        ? products
        : products.filter(
            (p) => (p.category ?? '').trim().toLowerCase() === category.toLowerCase(),
          ),
    [products, category],
  )

  const totalPages = Math.max(1, Math.ceil(categoryFiltered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = categoryFiltered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleCategoryChange = useCallback((next: string | null) => {
    setCategory(next)
    setPage(1)
  }, [])

  return {
    products: paginated,
    allProducts: products,
    categories,
    activeCategory: category,
    loading,
    error,
    search,
    page: safePage,
    totalPages,
    totalItems: categoryFiltered.length,
    handleSearch,
    handleCategoryChange,
    setPage,
    refresh,
  }
}