import { useCallback, useState } from 'react'
import type { CreateProductRequest, UpdateProductRequest } from '../types/products'
import { productsService } from '../services/products.service'

export function useProductMutations(onSuccess: () => void) {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: CreateProductRequest): Promise<string> => {
      setSaving(true)
      setError(null)
      try {
        const id = await productsService.create(data)
        onSuccess()
        return id
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
      data: { productName: string; price: number; stock: number; productDescriptions: string | null },
    ) => {
      setSaving(true)
      setError(null)
      try {
        const payload: UpdateProductRequest = {
          productName: data.productName,
          price: data.price,
          stock: data.stock,
          descriptions: data.productDescriptions,
        }
        await productsService.update(productId, payload)
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
        await productsService.delete(productId)
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

  const uploadImage = useCallback(
    async (productId: string, file: File) => {
      setUploading(true)
      setError(null)
      try {
        await productsService.uploadImage(productId, file)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image')
        throw err
      } finally {
        setUploading(false)
      }
    },
    [onSuccess],
  )

  return { create, update, remove, uploadImage, saving, uploading, error }
}
