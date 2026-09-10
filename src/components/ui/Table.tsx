import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

export function Table<T>({
  columns,
  data,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  const headCells = columns.map((column) => (
    <th
      key={column.key}
      scope="col"
      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${column.align === 'right' ? alignClass.right : alignClass.left}`}
    >
      {column.header}
    </th>
  ))

  const bodyRows = data.map((row, index) => (
    <tr
      key={index}
      onClick={() => onRowClick?.(row)}
      className={`border-t border-gray-100 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={`whitespace-nowrap px-4 py-3 text-sm text-gray-700 ${column.align === 'right' ? alignClass.right : alignClass.left} ${column.className ?? ''}`}
        >
          {column.render ? column.render(row) : String(row[column.key as keyof T])}
        </td>
      ))}
    </tr>
  ))

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      {data.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <table className="w-full min-w-560px border-collapse">
          <thead>
            <tr>{headCells}</tr>
          </thead>
          <tbody>{bodyRows}</tbody>
        </table>
      )}
    </div>
  )
}