import type { ProductResponse } from './products'

export interface SupplierResponse {
  supplierId: string
  supplierName: string | null
  email: string | null
  phoneNumber: string | null
  address: string | null
}

export interface SupplierWithProducts {
  supplierId: string
  supplierName: string | null
  email: string | null
  phonenumber: string | null
  address: string | null
  products: ProductResponse[] | null
}

export interface CreateSupplierRequest {
  supplierName: string
  email: string
  phoneNumber: string
  address: string
}

export interface UpdateSupplierRequest {
  supplierName: string
  email: string
  phoneNumber: string
  address: string
}