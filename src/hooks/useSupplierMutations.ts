import { useCallback, useState } from 'react'
import type { CreateSupplierRequest } from '../types/suppliers'
import { mockSuppliersService } from '../services/suppliers.mock'

export function useSupplierMutations(onSuccess: () => void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: CreateSupplierRequest) => {
      setSaving(true)
      setError(null)
      try {
        await mockSuppliersService.create(data)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create supplier')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  const update = useCallback(
    async (supplierId: string, data: CreateSupplierRequest) => {
      setSaving(true)
      setError(null)
      try {
        await mockSuppliersService.update(supplierId, data)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update supplier')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  const remove = useCallback(
    async (supplierId: string) => {
      setSaving(true)
      setError(null)
      try {
        await mockSuppliersService.delete(supplierId)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete supplier')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  return { create, update, remove, saving, error }
}