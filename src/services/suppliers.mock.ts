import type {
  SupplierResponse,
  SupplierWithProducts,
  CreateSupplierRequest,
} from '../types/suppliers'
import type { ProductResponse } from '../types/products'
import { mockProductsService } from './products.mock'

let nextId = 1000
function uid(): string {
  return `s1-0000-0000-0000-${String(nextId++).padStart(12, '0')}`
}

const suppliers: SupplierResponse[] = [
  { supplierId: 's1-0000-0000-0000000000000001', supplierName: 'TechSource Ltd', email: 'sales@techsource.com', phoneNumber: '+1-555-0101', address: '100 Tech Park, San Francisco, CA' },
  { supplierId: 's1-0000-0000-0000000000000002', supplierName: 'DisplayWorld Inc', email: 'orders@displayworld.com', phoneNumber: '+1-555-0202', address: '250 Monitor Ave, Austin, TX' },
  { supplierId: 's1-0000-0000-0000000000000003', supplierName: 'CableMasters', email: 'info@cablemasters.com', phoneNumber: '+1-555-0303', address: '75 Cable Rd, Portland, OR' },
  { supplierId: 's1-0000-0000-0000000000000004', supplierName: 'OfficeComfort Co', email: 'sales@officecomfort.com', phoneNumber: '+1-555-0404', address: '180 Comfort Blvd, Denver, CO' },
  { supplierId: 's1-0000-0000-0000000000000005', supplierName: 'PaperPlus', email: 'hello@paperplus.com', phoneNumber: '+1-555-0505', address: '90 Paper St, Seattle, WA' },
]

const MOCK_DELAY = 200

async function productsForSupplier(supplierId: string): Promise<ProductResponse[]> {
  const products = await mockProductsService.getAll()
  return products.filter((p) => p.supplierId === supplierId)
}

export const mockSuppliersService = {
  async getAll(): Promise<SupplierResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return [...suppliers]
  },

  async getById(supplierId: string): Promise<SupplierWithProducts> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const supplier = suppliers.find((s) => s.supplierId === supplierId)
    if (!supplier) throw new Error('Supplier not found')
    const products = await productsForSupplier(supplierId)
    return {
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      email: supplier.email,
      phonenumber: supplier.phoneNumber,
      address: supplier.address,
      products,
    }
  },

  async create(data: CreateSupplierRequest): Promise<string> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const id = uid()
    suppliers.push({
      supplierId: id,
      supplierName: data.supplierName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
    })
    return id
  },

  async update(
    supplierId: string,
    data: CreateSupplierRequest,
  ): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = suppliers.findIndex((s) => s.supplierId === supplierId)
    if (idx === -1) throw new Error('Supplier not found')
    suppliers[idx] = {
      ...suppliers[idx],
      supplierName: data.supplierName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
    }
  },

  async delete(supplierId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = suppliers.findIndex((s) => s.supplierId === supplierId)
    if (idx === -1) throw new Error('Supplier not found')
    const products = await productsForSupplier(supplierId)
    if (products.length > 0) {
      throw new Error('Cannot delete a supplier that still provides products')
    }
    suppliers.splice(idx, 1)
  },
}