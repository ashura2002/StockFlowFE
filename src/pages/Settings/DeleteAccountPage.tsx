import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AccountSettingsTabs } from '../../components/settings/AccountSettingsTabs'
import { AlertTriangleIcon } from '../../components/ui/icons'
import { usersService } from '../../services/users.service'
import { useAuth } from '../../context/AuthContext'

export function DeleteAccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const expected = user?.email ?? ''
  const matches = confirm.trim().toLowerCase() === expected.toLowerCase()

  async function handleDelete(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!matches) {
      setError('This email does not match your account email.')
      return
    }

    setIsDeleting(true)
    try {
      await usersService.deleteMyAccount()
      logout()
      navigate('/', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete your account',
      )
      setIsDeleting(false)
    }
  }

  return (
    <PageContainer
      title="Delete Account"
      description="Permanently remove your account and all associated data"
    >
      <AccountSettingsTabs />

      <div className="max-w-2xl">
        <Card className="border-red-200 ring-red-100">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangleIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Delete your account
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This action is permanent and cannot be undone. Your profile,
                orders and all associated data will be removed immediately.
              </p>
            </div>
          </div>

          <form onSubmit={handleDelete} className="mt-6 space-y-4" noValidate>
            <Input
              label={`Type ${expected} to confirm`}
              placeholder="Enter your account email"
              autoComplete="email"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                if (error) setError('')
              }}
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={isDeleting}
                disabled={!matches}
                className="w-full sm:w-auto"
              >
                Permanently delete my account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  )
}