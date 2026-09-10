import type { ProductResponse } from './products'

export interface CategoryResponse {
  categoryId: string
  categoryName: string | null
  description: string | null
}

export interface CategoryWithProducts {
  categoryId: string
  categoryName: string | null
  categoryDescriptions: string | null
  products: ProductResponse[] | null
}

export interface CreateCategoryRequest {
  categoryName: string
  description?: string | null
}

export interface UpdateCategoryRequest {
  categoryName: string
  description?: string | null
}