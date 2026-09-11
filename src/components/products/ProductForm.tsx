import React, { useRef, useState, type ChangeEvent } from 'react'
import type { CategoryResponse } from '../../types/categories'
import type { SupplierResponse } from '../../types/suppliers'
import type { ProductRow } from '../../types/products'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Modal } from '../shared/Modal'
import { CameraIcon, TrashIcon } from '../ui/icons'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  onImageSelected?: (file: File) => void
  product?: ProductRow | null
  categories: CategoryResponse[]
  suppliers: SupplierResponse[]
  saving: boolean
  uploading?: boolean
}

function getDefaultFields(product?: ProductRow | null) {
  if (product) {
    return {
      productName: product.productName ?? '',
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId ?? '',
      supplierId: product.supplierId ?? '',
      productDescriptions: product.productDescriptions ?? '',
    }
  }
  return {
    productName: '',
    price: '',
    stock: '',
    categoryId: '',
    supplierId: '',
    productDescriptions: '',
  }
}

export function ProductFormInner({
  onClose,
  onSubmit,
  onImageSelected,
  product,
  categories,
  suppliers,
  saving,
  uploading = false,
}: ProductFormProps) {
  const isEdit = Boolean(product)
  const [fields, setFields] = useState(() => getDefaultFields(product))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const existingImageUrl = product?.productImageUrl ?? null

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    onImageSelected?.(file)
    e.target.value = ''
  }

  function handleRemoveImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  function updateField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fields.productName.trim()) errs.productName = 'Name is required'
    if (!fields.price || Number(fields.price) <= 0) errs.price = 'Valid price is required'
    if (fields.stock === '' || Number(fields.stock) < 0) errs.stock = 'Stock is required'
    if (!isEdit && !fields.categoryId) errs.categoryId = 'Category is required'
    if (!isEdit && !fields.supplierId) errs.supplierId = 'Supplier is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({
      productName: fields.productName.trim(),
      price: Number(fields.price),
      stock: Number(fields.stock),
      categoryId: fields.categoryId,
      supplierId: fields.supplierId,
      productDescriptions: fields.productDescriptions.trim() || null,
    })
  }

  const categoryOptions = categories.map((c) => ({
    value: c.categoryId,
    label: c.categoryName ?? 'Unnamed',
  }))

  const supplierOptions = suppliers.map((s) => ({
    value: s.supplierId,
    label: s.supplierName ?? 'Unnamed',
  }))

  const showImage = previewUrl ?? existingImageUrl

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add Product'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <div className="flex items-start gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              {showImage ? (
                <img
                  src={showImage}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <CameraIcon className="mr-1.5 h-4 w-4" />
                {existingImageUrl ? 'Change Image' : 'Upload Image'}
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <TrashIcon className="mr-1.5 h-4 w-4" />
                  Remove
                </Button>
              )}
              {uploading && (
                <p className="text-xs text-gray-500">Uploading...</p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <Input
          label="Product Name"
          value={fields.productName}
          onChange={(e) => updateField('productName', e.target.value)}
          error={errors.productName}
          placeholder="e.g. Wireless Mouse M280"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={fields.price}
            onChange={(e) => updateField('price', e.target.value)}
            error={errors.price}
            placeholder="0.00"
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={fields.stock}
            onChange={(e) => updateField('stock', e.target.value)}
            error={errors.stock}
            placeholder="0"
          />
        </div>

        {!isEdit && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              value={fields.categoryId}
              onChange={(e) => updateField('categoryId', e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
              error={errors.categoryId}
            />
            <Select
              label="Supplier"
              value={fields.supplierId}
              onChange={(e) => updateField('supplierId', e.target.value)}
              options={supplierOptions}
              placeholder="Select supplier"
              error={errors.supplierId}
            />
          </div>
        )}

        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            value={fields.productDescriptions}
            onChange={(e) => updateField('productDescriptions', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional product description"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={saving || uploading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving} disabled={uploading}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function ProductForm({ open, product, ...rest }: ProductFormProps) {
  if (!open) return null
  const key = product?.productId ?? 'create'
  return <ProductFormInner key={key} open={open} product={product} {...rest} />
}
