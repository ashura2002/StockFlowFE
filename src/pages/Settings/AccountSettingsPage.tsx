import { Link, useLocation } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { AccountSettingsTabs } from '../../components/settings/AccountSettingsTabs'
import { LockIcon, TrashIcon } from '../../components/ui/icons'

const ACCOUNT_SEGMENT = '/settings/account'

function accountBase(pathname: string): string {
  const idx = pathname.indexOf(ACCOUNT_SEGMENT)
  return idx >= 0 ? pathname.slice(0, idx + ACCOUNT_SEGMENT.length) : ''
}

export function AccountSettingsPage() {
  const { pathname } = useLocation()
  const base = accountBase(pathname)

  return (
    <PageContainer
      title="Account Settings"
      description="Manage your account security and preferences"
    >
      <AccountSettingsTabs />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <LockIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Change Password
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update the password used to sign in to your account.
            </p>
          </div>
          <Link
            to={`${base}/password`}
            className="mt-auto inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Change Password
          </Link>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <TrashIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Delete Account
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <Link
            to={`${base}/delete`}
            className="mt-auto inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete Account
          </Link>
        </Card>
      </div>
    </PageContainer>
  )
}