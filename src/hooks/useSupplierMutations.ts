import { useCallback, useState } from 'react'
import type {
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../types/suppliers'
import { suppliersService } from '../services/suppliers.service'

export function useSupplierMutations(onSuccess: () => void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: CreateSupplierRequest): Promise<string> => {
      setSaving(true)
      setError(null)
      try {
        const id = await suppliersService.create(data)
        onSuccess()
        return id
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
    async (supplierId: string, data: UpdateSupplierRequest) => {
      setSaving(true)
      setError(null)
      try {
        await suppliersService.update(supplierId, data)
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
        await suppliersService.delete(supplierId)
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