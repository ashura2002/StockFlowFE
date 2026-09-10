import { useCallback, useState } from 'react'
import type { CreateCategoryRequest } from '../types/categories'
import { mockCategoriesService } from '../services/categories.mock'

export function useCategoryMutations(onSuccess: () => void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: CreateCategoryRequest) => {
      setSaving(true)
      setError(null)
      try {
        await mockCategoriesService.create(data)
        onSuccess()
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
    async (categoryId: string, data: CreateCategoryRequest) => {
      setSaving(true)
      setError(null)
      try {
        await mockCategoriesService.update(categoryId, data)
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
        await mockCategoriesService.delete(categoryId)
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