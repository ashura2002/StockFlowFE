import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { AccountSettingsTabs } from '../../components/settings/AccountSettingsTabs'
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm'

export function ChangePasswordPage() {
  return (
    <PageContainer
      title="Change Password"
      description="Update the password used to sign in to your account"
    >
      <AccountSettingsTabs />

      <div className="max-w-2xl">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">
            Change Password
          </h3>
          <p className="text-sm text-gray-500">
            Your new password must be at least 6 characters.
          </p>

          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}