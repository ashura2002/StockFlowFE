export interface ProductResponse {
  productId: string
  productName: string | null
  price: number
  stock: number
  category: string | null
  supplier: string | null
  productDescriptions: string | null
  productImageUrl: string | null
  productImagePublicId: string | null
}

export interface ProductRow extends ProductResponse {
  categoryId: string
  supplierId: string
}

export interface CreateProductRequest {
  productName: string
  price: number
  stock: number
  categoryId: string
  supplierId: string
  productDescriptions?: string | null
}

export interface UpdateProductRequest {
  productName: string
  price: number
  stock: number
  descriptions?: string | null
}

export interface DeletedProductResponse extends ProductResponse {
  deletedAt: string | null
}