import { useState, type FormEvent } from 'react'
import type { CreateProfileRequest } from '../../types/profiles'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface ProfileCreateFormProps {
  onSave: (data: CreateProfileRequest) => Promise<void>
  saving: boolean
}

export function ProfileCreateForm({
  onSave,
  saving,
}: ProfileCreateFormProps) {
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fields.firstName.trim()) errs.firstName = 'First name is required'
    if (!fields.lastName.trim()) errs.lastName = 'Last name is required'
    if (!fields.dateOfBirth) errs.dateOfBirth = 'Date of birth is required'
    if (!fields.address.trim()) errs.address = 'Address is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave({
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      dateOfBirth: fields.dateOfBirth,
      address: fields.address.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          value={fields.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          error={errors.firstName}
          placeholder="e.g. Alex"
        />
        <Input
          label="Last Name"
          value={fields.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          error={errors.lastName}
          placeholder="e.g. Morgan"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Date of Birth"
          type="date"
          value={fields.dateOfBirth}
          onChange={(e) => updateField('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
        />
      </div>

      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          rows={3}
          value={fields.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Your address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={saving}>
          Create Profile
        </Button>
      </div>
    </form>
  )
}