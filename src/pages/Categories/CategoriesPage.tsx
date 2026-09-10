import { useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useCategories } from '../../hooks/useCategories'
import { useCategoryMutations } from '../../hooks/useCategoryMutations'
import type { CategoryResponse } from '../../types/categories'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { IconButton } from '../../components/ui/IconButton'
import { Card } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import {
  SearchIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
} from '../../components/ui/icons'
import { CategoryForm } from '../../components/categories/CategoryForm'
import { CategoryDetailDrawer } from '../../components/categories/CategoryDetailDrawer'
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog'

type FormMode =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; category: CategoryResponse }

export function CategoriesPage() {
  const { categories, loading, error, refresh } = useCategories()
  const { create, update, remove, saving } = useCategoryMutations(refresh)

  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) =>
      c.categoryName?.toLowerCase().includes(q),
    )
  }, [categories, search])

  const columns: Column<CategoryResponse>[] = useMemo(
    () => [
      {
        key: 'categoryName',
        header: 'Category',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TagIcon className="h-4 w-4" />
            </div>
            <p className="font-medium text-gray-900">{row.categoryName}</p>
          </div>
        ),
      },
      {
        key: 'description',
        header: 'Description',
        render: (row) => (
          <span className="block max-w-md truncate text-gray-500">
            {row.description ?? '—'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Action',
        align: 'right',
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            <IconButton
              label="Edit"
              onClick={(e) => {
                e.stopPropagation()
                setFormMode({ type: 'edit', category: row })
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </IconButton>
            <IconButton
              label="Delete"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteError(null)
                setDeleteTarget(row)
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4" />
            </IconButton>
          </div>
        ),
      },
    ],
    [],
  )

  async function handleFormSubmit(data: {
    categoryName: string
    description: string | null
  }) {
    if (formMode.type === 'create') {
      await create(data)
    } else if (formMode.type === 'edit' && formMode.category) {
      await update(formMode.category.categoryId, data)
    }
    setFormMode({ type: 'closed' })
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await remove(deleteTarget.categoryId)
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete category',
      )
    }
  }

  return (
    <PageContainer
      title="Categories"
      description={`${categories.length} categor${
        categories.length !== 1 ? 'ies' : 'y'
      } total`}
      actions={
        <Button onClick={() => setFormMode({ type: 'create' })}>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Add Category
        </Button>
      }
    >
      <Card>
        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            icon={<SearchIcon className="h-4 w-4" />}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-3">
                <div className="h-9 w-9 rounded-lg bg-gray-200" />
                <div className="h-4 w-40 flex-1 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            data={filtered}
            emptyMessage="No categories found"
            onRowClick={(row) => setDetailId(row.categoryId)}
          />
        )}
      </Card>

      <CategoryForm
        open={formMode.type !== 'closed'}
        onClose={() => setFormMode({ type: 'closed' })}
        onSubmit={handleFormSubmit}
        category={formMode.type === 'edit' ? formMode.category : undefined}
        saving={saving}
      />

      <CategoryDetailDrawer
        open={detailId !== null}
        categoryId={detailId}
        onClose={() => setDetailId(null)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onClose={() => {
          setDeleteTarget(null)
          setDeleteError(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.categoryName}"? This action cannot be undone.`
            : ''
        }
        isLoading={saving}
        error={deleteError}
      />
    </PageContainer>
  )
}