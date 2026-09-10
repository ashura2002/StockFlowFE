import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homePathForRole } from '../utils/navigation'
import { Button } from '../components/ui/Button'

export function UnauthorizedPage() {
  const { user } = useAuth()
  const home = homePathForRole(user?.role ?? null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          You do not have permission to view this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={home}>
            <Button variant="primary">Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}