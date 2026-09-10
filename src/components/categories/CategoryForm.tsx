import React, { useState } from 'react'
import type { CategoryResponse } from '../../types/categories'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../shared/Modal'

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { categoryName: string; description: string | null }) => Promise<void>
  category?: CategoryResponse | null
  saving: boolean
}

function getDefaultFields(category?: CategoryResponse | null) {
  return {
    categoryName: category?.categoryName ?? '',
    description: category?.description ?? '',
  }
}

export function CategoryFormInner({
  onClose,
  onSubmit,
  category,
  saving,
}: CategoryFormProps) {
  const isEdit = Boolean(category)
  const [fields, setFields] = useState(() => getDefaultFields(category))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fields.categoryName.trim()) errs.categoryName = 'Name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({
      categoryName: fields.categoryName.trim(),
      description: fields.description.trim() || null,
    })
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add Category'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={fields.categoryName}
          onChange={(e) => updateField('categoryName', e.target.value)}
          error={errors.categoryName}
          placeholder="e.g. Electronics"
        />

        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            value={fields.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional description"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            {isEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function CategoryForm({ open, category, ...rest }: CategoryFormProps) {
  if (!open) return null
  const key = category?.categoryId ?? 'create'
  return <CategoryFormInner key={key} open={open} category={category} {...rest} />
}