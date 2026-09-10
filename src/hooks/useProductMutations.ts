import { useCallback, useState } from 'react'
import { mockProductsService, type MockProductRow } from '../services/products.mock'

export function useProductMutations(onSuccess: () => void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: Omit<MockProductRow, 'productId'>) => {
      setSaving(true)
      setError(null)
      try {
        await mockProductsService.create(data)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create product')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  const update = useCallback(
    async (
      productId: string,
      data: Pick<MockProductRow, 'productName' | 'price' | 'stock' | 'productDescriptions'>,
    ) => {
      setSaving(true)
      setError(null)
      try {
        await mockProductsService.update(productId, data)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update product')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  const remove = useCallback(
    async (productId: string) => {
      setSaving(true)
      setError(null)
      try {
        await mockProductsService.delete(productId)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  return { create, update, remove, saving, error }
}