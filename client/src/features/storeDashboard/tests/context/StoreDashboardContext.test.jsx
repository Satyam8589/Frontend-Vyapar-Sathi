import React from 'react'
import { renderHook, act } from '@testing-library/react'
import {
  StoreDashboardProvider,
  useStoreDashboardContext,
} from '../../context/StoreDashboardContext'
import { fetchAllStores } from '../../services/storeDashboardService'
import { showError } from '@/utils/toast'
import { VIEW_MODES } from '../../constants'

jest.mock('../../services/storeDashboardService', () => ({
  fetchAllStores: jest.fn(),
}))

jest.mock('@/utils/toast', () => ({
  showError: jest.fn(),
}))

const wrapper = ({ children }) => (
  <StoreDashboardProvider>{children}</StoreDashboardProvider>
)

const mockStores = [
  {
    _id: 's1',
    name: 'Alpha Retail',
    phone: '9990001111',
    email: 'alpha@example.com',
    businessType: 'retail',
    address: { city: 'Delhi' },
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 's2',
    name: 'Bravo Mart',
    phone: '8880001111',
    email: 'bravo@example.com',
    businessType: 'wholesale',
    address: { city: 'Mumbai' },
    createdAt: '2024-03-01T00:00:00.000Z',
  },
  {
    _id: 's3',
    name: 'City Shop',
    phone: '7771234567',
    email: 'hello@city.com',
    businessType: 'retail',
    address: { city: 'Pune' },
    createdAt: '2024-02-01T00:00:00.000Z',
  },
]

describe('StoreDashboardContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws when used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useStoreDashboardContext())).toThrow(
      'useStoreDashboardContext must be used within StoreDashboardProvider'
    )

    spy.mockRestore()
  })

  it('exposes initial dashboard state', () => {
    const { result } = renderHook(() => useStoreDashboardContext(), { wrapper })

    expect(result.current.stores).toEqual([])
    expect(result.current.allStores).toEqual([])
    expect(result.current.selectedStore).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.filters).toEqual({
      search: '',
      businessType: 'all',
      sortBy: 'created-desc',
    })
    expect(result.current.viewMode).toBe(VIEW_MODES.GRID)
  })

  it('fetches stores and applies default sorting', async () => {
    fetchAllStores.mockResolvedValue({ data: mockStores })
    const { result } = renderHook(() => useStoreDashboardContext(), { wrapper })

    let response
    await act(async () => {
      response = await result.current.fetchStores()
    })

    expect(fetchAllStores).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ success: true, data: mockStores })
    expect(result.current.allStores).toEqual(mockStores)
    expect(result.current.stores.map((store) => store._id)).toEqual(['s2', 's3', 's1'])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('updates filters and recomputes visible stores', async () => {
    fetchAllStores.mockResolvedValue({ data: mockStores })
    const { result } = renderHook(() => useStoreDashboardContext(), { wrapper })

    await act(async () => {
      await result.current.fetchStores()
    })

    act(() => {
      result.current.updateFilters({
        businessType: 'retail',
        sortBy: 'name-asc',
      })
    })

    expect(result.current.filters).toEqual({
      search: '',
      businessType: 'retail',
      sortBy: 'name-asc',
    })
    expect(result.current.stores.map((store) => store._id)).toEqual(['s1', 's3'])

    act(() => {
      result.current.updateFilters({ search: 'shop' })
    })

    expect(result.current.stores.map((store) => store._id)).toEqual(['s3'])
  })

  it('resets filters to defaults and restores full store list', async () => {
    fetchAllStores.mockResolvedValue({ data: mockStores })
    const { result } = renderHook(() => useStoreDashboardContext(), { wrapper })

    await act(async () => {
      await result.current.fetchStores()
    })

    act(() => {
      result.current.updateFilters({ businessType: 'retail' })
    })
    expect(result.current.stores).toHaveLength(2)

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters).toEqual({
      search: '',
      businessType: 'all',
      sortBy: 'created-desc',
    })
    expect(result.current.stores.map((store) => store._id)).toEqual(['s2', 's3', 's1'])
  })

  it('toggles view mode and handles store selection', () => {
    const { result } = renderHook(() => useStoreDashboardContext(), { wrapper })

    act(() => {
      result.current.toggleViewMode()
    })
    expect(result.current.viewMode).toBe(VIEW_MODES.LIST)

    act(() => {
      result.current.selectStore(mockStores[0])
    })
    expect(result.current.selectedStore).toEqual(mockStores[0])

    act(() => {
      result.current.clearSelection()
      result.current.toggleViewMode()
    })
    expect(result.current.selectedStore).toBe(null)
    expect(result.current.viewMode).toBe(VIEW_MODES.GRID)
  })

  it('returns error state and shows toast when fetch fails', async () => {
    fetchAllStores.mockRejectedValue(new Error('Network down'))
    const { result } = renderHook(() => useStoreDashboardContext(), { wrapper })

    let response
    await act(async () => {
      response = await result.current.fetchStores()
    })

    expect(response).toEqual({ success: false, error: 'Network down' })
    expect(result.current.error).toBe('Network down')
    expect(result.current.loading).toBe(false)
    expect(showError).toHaveBeenCalledWith('Network down')
  })
})

