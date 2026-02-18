import { createStore, validateStoreData } from '../../services/storeService'
import { apiPost } from '@/servies/api'

jest.mock('@/servies/api', () => ({
  apiPost: jest.fn(),
}))

describe('storeService', () => {
  const validStoreData = {
    name: 'My Store',
    phone: '9876543210',
    email: 'store@example.com',
    address: {
      fullAddress: 'MG Road, Bengaluru, Karnataka, 560001, India',
    },
    description: 'Demo description',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createStore', () => {
    it('calls apiPost with correct endpoint and payload', async () => {
      const mockResponse = { data: { _id: 'store-1' } }
      apiPost.mockResolvedValue(mockResponse)

      const result = await createStore(validStoreData)

      expect(apiPost).toHaveBeenCalledWith('/store/create', validStoreData)
      expect(result).toEqual(mockResponse)
    })

    it('rethrows api errors', async () => {
      const error = new Error('API failed')
      apiPost.mockRejectedValue(error)

      await expect(createStore(validStoreData)).rejects.toThrow('API failed')
    })
  })

  describe('validateStoreData', () => {
    it('returns valid for correct store data', () => {
      const result = validateStoreData(validStoreData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('returns errors for missing required fields', () => {
      const result = validateStoreData({
        name: '',
        phone: '',
        email: '',
        address: { fullAddress: '' },
      })

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual(
        expect.objectContaining({
          name: 'Store name is required',
          phone: 'Phone number is required',
          fullAddress: 'Full address is required',
        })
      )
    })

    it('validates phone and email formats', () => {
      const result = validateStoreData({
        ...validStoreData,
        phone: '12345',
        email: 'invalid-email',
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBe('Please provide a valid 10-digit phone number')
      expect(result.errors.email).toBe('Please provide a valid email address')
    })

    it('validates max length for name and description', () => {
      const result = validateStoreData({
        ...validStoreData,
        name: 'a'.repeat(101),
        description: 'd'.repeat(501),
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Store name cannot exceed 100 characters')
      expect(result.errors.description).toBe('Description cannot exceed 500 characters')
    })
  })
})

