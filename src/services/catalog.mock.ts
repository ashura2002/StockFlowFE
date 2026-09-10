import type { ProductResponse } from '../types/products'
import { mockProductsService } from './products.mock'

const MOCK_DELAY = 200

function stripExtras(rows: ProductResponse[]): ProductResponse[] {
  return rows.map((row) => ({
    productId: row.productId,
    productName: row.productName,
    price: row.price,
    stock: row.stock,
    category: row.category,
    supplier: row.supplier,
    productDescriptions: row.productDescriptions,
    productImageUrl: row.productImageUrl,
    productImagePublicId: row.productImagePublicId,
  }))
}

export const mockCatalogService = {
  async list(): Promise<ProductResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const rows = await mockProductsService.getAll()
    return stripExtras(rows)
  },

  async getDetails(productId: string): Promise<ProductResponse> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const row = await mockProductsService.getById(productId)
    return stripExtras([row])[0]
  },

  async search(ProductName: string): Promise<ProductResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const rows = await mockProductsService.search(ProductName)
    return stripExtras(rows)
  },
}