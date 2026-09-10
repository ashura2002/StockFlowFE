import type {
  CategoryResponse,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/categories'
import type { ProductResponse } from '../types/products'
import { mockProductsService } from './products.mock'

let nextId = 1000
function uid(): string {
  return `c1-0000-0000-0000-${String(nextId++).padStart(12, '0')}`
}

const categories: CategoryResponse[] = [
  { categoryId: 'c1-0000-0000-0000000000000001', categoryName: 'Electronics', description: 'Monitors, headsets, webcams, docks' },
  { categoryId: 'c1-0000-0000-0000000000000002', categoryName: 'Accessories', description: 'Keyboards, mice, cables, stands' },
  { categoryId: 'c1-0000-0000-0000000000000003', categoryName: 'Furniture', description: 'Chairs, desks, lamps' },
  { categoryId: 'c1-0000-0000-0000000000000004', categoryName: 'Stationery', description: 'Notebooks, pens, paper' },
  { categoryId: 'c1-0000-0000-0000000000000005', categoryName: 'Networking', description: 'Cables, switches, routers' },
]

const MOCK_DELAY = 200

async function productsForCategory(categoryId: string): Promise<ProductResponse[]> {
  const products = await mockProductsService.getAll()
  return products.filter((p) => p.categoryId === categoryId)
}

export const mockCategoriesService = {
  async getAll(): Promise<CategoryResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return [...categories]
  },

  async getById(categoryId: string): Promise<CategoryWithProducts> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const category = categories.find((c) => c.categoryId === categoryId)
    if (!category) throw new Error('Category not found')
    const products = await productsForCategory(categoryId)
    return {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      categoryDescriptions: category.description,
      products,
    }
  },

  async create(data: CreateCategoryRequest): Promise<string> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const id = uid()
    categories.push({
      categoryId: id,
      categoryName: data.categoryName,
      description: data.description ?? null,
    })
    return id
  },

  async update(categoryId: string, data: UpdateCategoryRequest): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = categories.findIndex((c) => c.categoryId === categoryId)
    if (idx === -1) throw new Error('Category not found')
    categories[idx] = {
      ...categories[idx],
      categoryName: data.categoryName,
      description: data.description ?? null,
    }
  },

  async delete(categoryId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = categories.findIndex((c) => c.categoryId === categoryId)
    if (idx === -1) throw new Error('Category not found')
    const products = await productsForCategory(categoryId)
    if (products.length > 0) {
      throw new Error('Cannot delete a category that still has products')
    }
    categories.splice(idx, 1)
  },
}