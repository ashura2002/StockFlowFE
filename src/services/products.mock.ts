import type { ProductResponse } from '../types/products'

let nextId = 1
function uid(): string {
  return `a1b2c3d4-0000-0000-0000-${String(nextId++).padStart(12, '0')}`
}

const seedProducts: ProductResponse[] = [
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000001',
    productName: 'Wireless Mouse M280',
    price: 29.99,
    stock: 45,
    category: 'Accessories',
    supplier: 'TechSource Ltd',
    productDescriptions: 'Ergonomic wireless mouse with 2.4GHz connection',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000002',
    productName: 'Mechanical Keyboard K87',
    price: 89.99,
    stock: 12,
    category: 'Accessories',
    supplier: 'TechSource Ltd',
    productDescriptions: '87-key compact mechanical keyboard with Cherry MX switches',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000003',
    productName: '27" IPS Monitor',
    price: 349.99,
    stock: 8,
    category: 'Electronics',
    supplier: 'DisplayWorld Inc',
    productDescriptions: '27-inch IPS panel, 144Hz, 1ms response time',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000004',
    productName: 'USB-C Cable 2m',
    price: 9.99,
    stock: 200,
    category: 'Accessories',
    supplier: 'CableMasters',
    productDescriptions: 'USB-C to USB-C cable, 2 meters, supports 100W PD',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000005',
    productName: 'USB-C Dock 8-in-1',
    price: 59.99,
    stock: 25,
    category: 'Electronics',
    supplier: 'TechSource Ltd',
    productDescriptions: 'USB-C hub with HDMI, USB-A x3, SD, microSD, Ethernet, PD',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000006',
    productName: 'Ergonomic Office Chair',
    price: 299.99,
    stock: 6,
    category: 'Furniture',
    supplier: 'OfficeComfort Co',
    productDescriptions: 'Adjustable lumbar support, armrests, headrest',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000007',
    productName: 'Laptop Stand Pro',
    price: 45.0,
    stock: 30,
    category: 'Accessories',
    supplier: 'OfficeComfort Co',
    productDescriptions: 'Adjustable aluminum laptop stand, supports up to 17"',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000008',
    productName: 'Webcam HD 1080p',
    price: 39.99,
    stock: 18,
    category: 'Electronics',
    supplier: 'TechSource Ltd',
    productDescriptions: 'Full HD webcam with built-in microphone and autofocus',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000009',
    productName: 'Notebook A5 Lined',
    price: 4.99,
    stock: 150,
    category: 'Stationery',
    supplier: 'PaperPlus',
    productDescriptions: 'A5 ruled notebook, 200 pages, hardcover',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000010',
    productName: 'Gaming Headset HS50',
    price: 69.99,
    stock: 14,
    category: 'Electronics',
    supplier: 'TechSource Ltd',
    productDescriptions: '7.1 surround sound gaming headset with noise-cancelling mic',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000011',
    productName: 'Desk Lamp LED',
    price: 24.99,
    stock: 40,
    category: 'Furniture',
    supplier: 'OfficeComfort Co',
    productDescriptions: 'LED desk lamp with adjustable brightness and color temperature',
    productImageUrl: null,
    productImagePublicId: null,
  },
  {
    productId: 'a1b2c3d4-0001-0000-0000-000000000012',
    productName: 'Ethernet Cable Cat6 5m',
    price: 7.99,
    stock: 85,
    category: 'Networking',
    supplier: 'CableMasters',
    productDescriptions: 'Cat6 UTP Ethernet cable, 5 meters, snagless',
    productImageUrl: null,
    productImagePublicId: null,
  },
]

export type MockProductRow = ProductResponse & {
  categoryId: string
  supplierId: string
}

const seedWithIds: MockProductRow[] = [
  { ...seedProducts[0], categoryId: 'c1-0000-0000-0000000000000002', supplierId: 's1-0000-0000-0000000000000001' },
  { ...seedProducts[1], categoryId: 'c1-0000-0000-0000000000000002', supplierId: 's1-0000-0000-0000000000000001' },
  { ...seedProducts[2], categoryId: 'c1-0000-0000-0000000000000001', supplierId: 's1-0000-0000-0000000000000002' },
  { ...seedProducts[3], categoryId: 'c1-0000-0000-0000000000000002', supplierId: 's1-0000-0000-0000000000000003' },
  { ...seedProducts[4], categoryId: 'c1-0000-0000-0000000000000001', supplierId: 's1-0000-0000-0000000000000001' },
  { ...seedProducts[5], categoryId: 'c1-0000-0000-0000000000000003', supplierId: 's1-0000-0000-0000000000000003' },
  { ...seedProducts[6], categoryId: 'c1-0000-0000-0000000000000002', supplierId: 's1-0000-0000-0000000000000003' },
  { ...seedProducts[7], categoryId: 'c1-0000-0000-0000000000000001', supplierId: 's1-0000-0000-0000000000000001' },
  { ...seedProducts[8], categoryId: 'c1-0000-0000-0000000000000004', supplierId: 's1-0000-0000-0000000000000003' },
  { ...seedProducts[9], categoryId: 'c1-0000-0000-0000000000000001', supplierId: 's1-0000-0000-0000000000000001' },
  { ...seedProducts[10], categoryId: 'c1-0000-0000-0000000000000003', supplierId: 's1-0000-0000-0000000000000003' },
  { ...seedProducts[11], categoryId: 'c1-0000-0000-0000000000000005', supplierId: 's1-0000-0000-0000000000000003' },
]

const products = [...seedWithIds]

const MOCK_DELAY = 250

export const mockProductsService = {
  async getAll(): Promise<MockProductRow[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return [...products]
  },

  async search(productName: string): Promise<MockProductRow[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const q = productName.toLowerCase()
    return products.filter((p) =>
      p.productName?.toLowerCase().includes(q),
    )
  },

  async getById(productId: string): Promise<MockProductRow> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const product = products.find((p) => p.productId === productId)
    if (!product) throw new Error('Product not found')
    return product
  },

  async create(
    data: Omit<MockProductRow, 'productId'>,
  ): Promise<string> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const id = uid()
    products.unshift({ ...data, productId: id })
    return id
  },

  async update(
    productId: string,
    data: Pick<MockProductRow, 'productName' | 'price' | 'stock' | 'productDescriptions'>,
  ): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = products.findIndex((p) => p.productId === productId)
    if (idx === -1) throw new Error('Product not found')
    products[idx] = { ...products[idx], ...data }
  },

  async delete(productId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = products.findIndex((p) => p.productId === productId)
    if (idx === -1) throw new Error('Product not found')
    products.splice(idx, 1)
  },
}