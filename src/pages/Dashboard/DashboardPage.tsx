import { useDashboard } from '../../hooks/useDashboard'
import { PageContainer } from '../../components/layout/PageContainer'
import { StatCardGrid } from '../../components/dashboard/StatCardGrid'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { Card } from '../../components/ui/Card'

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <div className="flex animate-pulse items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-6 w-16 rounded bg-gray-200" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    )
  }

  if (error || !data) {
    return (
      <PageContainer title="Dashboard" description="Something went wrong">
        <Card>
          <div className="py-12 text-center">
            <p className="text-sm text-red-600">{error ?? 'No data available'}</p>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Dashboard"
      description="Overview of your stock operations"
    >
      <StatCardGrid stats={data} />

      <div className="mt-6">
        <QuickActions />
      </div>
    </PageContainer>
  )
}