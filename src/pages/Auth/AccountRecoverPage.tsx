import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import type { ApiError } from '../../types/api'

type Step = 'request' | 'confirm' | 'done'

function EmailIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  )
}

export function AccountRecoverPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<Step>('request')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    code?: string
  }>({})

  function validateEmail(value: string) {
    const errors: { email?: string } = {}
    if (!value.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.email = 'Enter a valid email address'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleRequest(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!validateEmail(email)) {
      return
    }
    setIsSubmitting(true)
    try {
      await authService.requestAccountRestore({ email })
      setStep('confirm')
    } catch (err) {
      const apiError = err as ApiError
      setError(
        apiError.message ||
          'Unable to request account recovery. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirm(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!code.trim()) {
      setValidationErrors({ code: 'Verification code is required' })
      return
    }
    setIsSubmitting(true)
    try {
      await authService.confirmAccountRestore({ email, verificationCode: code.trim() })
      setStep('done')
    } catch (err) {
      const apiError = err as ApiError
      setError(
        apiError.message ||
          'Unable to confirm recovery. Please check the code and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Recover account</h1>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'request'
              ? 'Enter the email on your account to receive a recovery code'
              : step === 'confirm'
                ? 'Enter the verification code we emailed you'
                : 'Your account has been recovered'}
          </p>
        </div>

        <div className="rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-gray-200 sm:px-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequest} className="space-y-5" noValidate aria-busy={isSubmitting}>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={<EmailIcon />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={validationErrors.email}
                required
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full py-2.5">
                Send recovery code
              </Button>
            </form>
          )}

          {step === 'confirm' && (
            <form key={email} onSubmit={handleConfirm} className="space-y-5" noValidate aria-busy={isSubmitting}>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                readOnly
                disabled
              />
              <Input
                label="Verification code"
                placeholder="Enter the code"
                icon={<KeyIcon />}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={validationErrors.code}
                required
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full py-2.5">
                Confirm recovery
              </Button>
              <button
                type="button"
                onClick={() => setStep('request')}
                className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Use a different email
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Your account has been recovered. You can now sign in with your
                credentials.
              </p>
              <Link
                to="/login"
                className="block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}