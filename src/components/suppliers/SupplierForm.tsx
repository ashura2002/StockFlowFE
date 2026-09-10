import React, { useState } from 'react'
import type { SupplierResponse } from '../../types/suppliers'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../shared/Modal'

interface SupplierFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    supplierName: string
    email: string
    phoneNumber: string
    address: string
  }) => Promise<void>
  supplier?: SupplierResponse | null
  saving: boolean
}

type FieldKey = 'supplierName' | 'email' | 'phoneNumber' | 'address'

function getDefaultFields(supplier?: SupplierResponse | null) {
  return {
    supplierName: supplier?.supplierName ?? '',
    email: supplier?.email ?? '',
    phoneNumber: supplier?.phoneNumber ?? '',
    address: supplier?.address ?? '',
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SupplierFormInner({
  onClose,
  onSubmit,
  supplier,
  saving,
}: SupplierFormProps) {
  const isEdit = Boolean(supplier)
  const [fields, setFields] = useState(() => getDefaultFields(supplier))
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})

  function updateField(key: FieldKey, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const errs: Partial<Record<FieldKey, string>> = {}
    if (!fields.supplierName.trim()) errs.supplierName = 'Name is required'
    if (!fields.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_RE.test(fields.email.trim())) errs.email = 'Enter a valid email'
    if (!fields.phoneNumber.trim()) errs.phoneNumber = 'Phone is required'
    if (!fields.address.trim()) errs.address = 'Address is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({
      supplierName: fields.supplierName.trim(),
      email: fields.email.trim(),
      phoneNumber: fields.phoneNumber.trim(),
      address: fields.address.trim(),
    })
  }

  const inputs: Array<{
    key: FieldKey
    label: string
    placeholder: string
    type?: string
  }> = [
    { key: 'supplierName', label: 'Supplier Name', placeholder: 'e.g. TechSource Ltd' },
    { key: 'email', label: 'Email', placeholder: 'name@company.com', type: 'email' },
    { key: 'phoneNumber', label: 'Phone Number', placeholder: '+1-555-0101' },
    { key: 'address', label: 'Address', placeholder: 'Street, City, State' },
  ]

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isEdit ? 'Edit Supplier' : 'Add Supplier'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputs.map(({ key, label, placeholder, type }) => (
          <Input
            key={key}
            label={label}
            type={type}
            value={fields[key]}
            onChange={(e) => updateField(key, e.target.value)}
            error={errors[key]}
            placeholder={placeholder}
          />
        ))}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            {isEdit ? 'Save Changes' : 'Create Supplier'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function SupplierForm({ open, supplier, ...rest }: SupplierFormProps) {
  if (!open) return null
  const key = supplier?.supplierId ?? 'create'
  return <SupplierFormInner key={key} open={open} supplier={supplier} {...rest} />
}