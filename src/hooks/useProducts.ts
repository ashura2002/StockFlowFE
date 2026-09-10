import { useCallback, useEffect, useState } from 'react'
import type { SupplierResponse } from '../types/suppliers'
import type { CategoryResponse } from '../types/categories'
import type { MockProductRow } from '../services/products.mock'
import { mockProductsService } from '../services/products.mock'
import { mockCategoriesService } from '../services/categories.mock'
import { mockSuppliersService } from '../services/suppliers.mock'

const PAGE_SIZE = 10

export function useProducts() {
  const [products, setProducts] = useState<MockProductRow[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const [prods, cats, sups] = await Promise.all([
        mockProductsService.getAll(),
        mockCategoriesService.getAll(),
        mockSuppliersService.getAll(),
      ])
      setProducts(prods)
      setCategories(cats)
      setSuppliers(sups)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const filtered = search
    ? products.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      )
    : products

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    products: paginated,
    allProducts: filtered,
    categories,
    suppliers,
    loading,
    error,
    search,
    page: safePage,
    totalPages,
    totalItems: filtered.length,
    handleSearch,
    setPage,
    refresh,
  }
}