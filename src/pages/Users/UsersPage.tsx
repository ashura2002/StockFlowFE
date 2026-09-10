import { useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useUsers } from '../../hooks/useUsers'
import type { UserResponse } from '../../types/users'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { RoleBadge } from '../../components/ui/RoleBadge'
import { SearchIcon } from '../../components/ui/icons'
import { formatDate } from '../../utils/format'
import { UsersTabs } from '../../components/users/UsersTabs'
import { UserDetailDrawer } from '../../components/users/UserDetailDrawer'

export function UsersPage() {
  const {
    activeUsers,
    deletedUsers,
    activeCount,
    deletedCount,
    loading,
    error,
    tab,
    search,
    page,
    totalPages,
    totalItems,
    handleTabChange,
    handleSearch,
    setPage,
  } = useUsers()

  const [detailId, setDetailId] = useState<string | null>(null)

  const displayData = tab === 'active' ? activeUsers : deletedUsers

  const columns: Column<UserResponse>[] = useMemo(
    () => [
      {
        key: 'email',
        header: 'Email',
        render: (row) => (
          <span className="block max-w-xs truncate font-medium text-gray-900">
            {row.email ?? '—'}
          </span>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        render: (row) => <RoleBadge role={row.role} />,
      },
      {
        key: 'createdAt',
        header: 'Joined',
        render: (row) => (
          <span className="text-gray-700">{formatDate(row.createdAt)}</span>
        ),
      },
    ],
    [],
  )

  return (
    <PageContainer
      title="Users"
      description={`${totalItems} user${totalItems !== 1 ? 's' : ''} shown`}
    >
      <Card>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <UsersTabs
            tab={tab}
            activeCount={activeCount}
            deletedCount={deletedCount}
            onChange={handleTabChange}
          />
          {tab === 'active' && (
            <div className="md:w-64">
              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                icon={<SearchIcon className="h-4 w-4" />}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-3">
                <div className="h-4 w-52 flex-1 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            data={displayData}
            emptyMessage={
              tab === 'deleted'
                ? 'No deleted users'
                : 'No users match the current filter'
            }
            onRowClick={(row) => setDetailId(row.userId)}
          />
        )}

        {tab === 'active' && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <UserDetailDrawer
        open={detailId !== null}
        userId={detailId}
        onClose={() => setDetailId(null)}
      />
    </PageContainer>
  )
}