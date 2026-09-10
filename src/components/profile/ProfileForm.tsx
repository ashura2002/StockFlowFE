import React, { useState } from 'react'
import type { UpdateProfileRequest } from '../../types/profiles'
import type { UserWithProfileResponse } from '../../types/users'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface ProfileFormProps {
  profile: UserWithProfileResponse
  onSave: (data: UpdateProfileRequest) => Promise<void>
  saving: boolean
}

function getDefaultFields(profile: UserWithProfileResponse) {
  return {
    firstName: profile.fistName ?? '',
    lastName: profile.lastName ?? '',
    address: profile.address ?? '',
  }
}

export function ProfileForm({ profile, onSave, saving }: ProfileFormProps) {
  const [fields, setFields] = useState(() => getDefaultFields(profile))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fields.firstName.trim()) errs.firstName = 'First name is required'
    if (!fields.lastName.trim()) errs.lastName = 'Last name is required'
    if (!fields.address.trim()) errs.address = 'Address is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave({
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      address: fields.address.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}