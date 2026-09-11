import { useCallback, useEffect, useState } from 'react'
import type { ProductResponse } from '../types/products'
import { catalogService } from '../services/catalog.service'

export function useProductDetails(productId: string) {
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await catalogService.getDetails(productId)
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  return { product, loading, error, refresh }
}
