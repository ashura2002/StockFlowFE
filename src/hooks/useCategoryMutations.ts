import { useCallback, useState } from 'react'
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/categories'
import { categoriesService } from '../services/categories.service'

export function useCategoryMutations(onSuccess: () => void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: CreateCategoryRequest): Promise<string> => {
      setSaving(true)
      setError(null)
      try {
        const id = await categoriesService.create(data)
        onSuccess()
        return id
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create category')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  const update = useCallback(
    async (categoryId: string, data: UpdateCategoryRequest) => {
      setSaving(true)
      setError(null)
      try {
        await categoriesService.update(categoryId, data)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update category')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  const remove = useCallback(
    async (categoryId: string) => {
      setSaving(true)
      setError(null)
      try {
        await categoriesService.delete(categoryId)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete category')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [onSuccess],
  )

  return { create, update, remove, saving, error }
}