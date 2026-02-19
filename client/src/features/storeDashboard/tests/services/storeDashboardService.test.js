import {
  fetchAllStores,
  fetchStoreById,
  deleteStore,
} from '../../services/storeDashboardService'
import { apiGet, apiDelete } from '@/servies/api'

jest.mock('@/servies/api', () => ({
  apiGet: jest.fn(),
  apiDelete: jest.fn(),
}))

describe('storeDashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetchAllStores calls the all stores endpoint', async () => {
    const mockResponse = { data: [{ _id: 's1' }] }
    apiGet.mockResolvedValue(mockResponse)

    const result = await fetchAllStores()

    expect(apiGet).toHaveBeenCalledWith('/store/all')
    expect(result).toEqual(mockResponse)
  })

  it('fetchStoreById calls the store details endpoint', async () => {
    const mockResponse = { data: { _id: 'store-22' } }
    apiGet.mockResolvedValue(mockResponse)

    const result = await fetchStoreById('store-22')

    expect(apiGet).toHaveBeenCalledWith('/store/store-22')
    expect(result).toEqual(mockResponse)
  })

  it('deleteStore calls the delete endpoint', async () => {
    const mockResponse = { message: 'deleted' }
    apiDelete.mockResolvedValue(mockResponse)

    const result = await deleteStore('store-11')

    expect(apiDelete).toHaveBeenCalledWith('/store/store-11')
    expect(result).toEqual(mockResponse)
  })

  it('rethrows API errors', async () => {
    const error = new Error('API failed')
    apiGet.mockRejectedValue(error)

    await expect(fetchAllStores()).rejects.toThrow('API failed')
  })
})

