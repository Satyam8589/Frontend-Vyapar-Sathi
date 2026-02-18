import { renderHook, act } from '@testing-library/react'
import { useCreateStore, useStoreValidation } from '../../hooks/useCreateStore'
import { createStore, validateStoreData } from '../../services/storeService'

jest.mock('../../services/storeService', () => ({
  createStore: jest.fn(),
  validateStoreData: jest.fn(),
}))

describe('useCreateStore hook', () => {
  const validPayload = {
    name: 'My Store',
    phone: '9876543210',
    email: '',
    address: {
      fullAddress: 'MG Road, Bengaluru',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('starts with default state', () => {
    const { result } = renderHook(() => useCreateStore())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)
  })

  it('handles successful create flow', async () => {
    validateStoreData.mockReturnValue({ isValid: true, errors: {} })
    createStore.mockResolvedValue({ data: { _id: 'store-1' } })

    const { result } = renderHook(() => useCreateStore())
    let response

    await act(async () => {
      response = await result.current.createStore(validPayload)
    })

    expect(validateStoreData).toHaveBeenCalledWith(validPayload)
    expect(createStore).toHaveBeenCalledWith(validPayload)
    expect(response).toEqual({ success: true, data: { data: { _id: 'store-1' } } })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(true)
  })

  it('returns validation error and skips API call when data is invalid', async () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: { name: 'Store name is required' },
    })

    const { result } = renderHook(() => useCreateStore())
    let response

    await act(async () => {
      response = await result.current.createStore(validPayload)
    })

    expect(createStore).not.toHaveBeenCalled()
    expect(response).toEqual({
      success: false,
      error: 'Store name is required',
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Store name is required')
    expect(result.current.success).toBe(false)
  })

  it('handles API failure and exposes error state', async () => {
    validateStoreData.mockReturnValue({ isValid: true, errors: {} })
    createStore.mockRejectedValue(new Error('Network issue'))

    const { result } = renderHook(() => useCreateStore())
    let response

    await act(async () => {
      response = await result.current.createStore(validPayload)
    })

    expect(response).toEqual({
      success: false,
      error: 'Network issue',
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Network issue')
    expect(result.current.success).toBe(false)
  })

  it('resets state with resetState', async () => {
    validateStoreData.mockReturnValue({ isValid: false, errors: { name: 'Invalid' } })
    const { result } = renderHook(() => useCreateStore())

    await act(async () => {
      await result.current.createStore(validPayload)
    })
    expect(result.current.error).toBe('Invalid')

    act(() => {
      result.current.resetState()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)
  })
})

describe('useStoreValidation hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('starts with empty errors', () => {
    const { result } = renderHook(() => useStoreValidation())
    expect(result.current.errors).toEqual({})
  })

  it('sets errors and returns validation result', () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: { phone: 'Invalid phone' },
    })

    const { result } = renderHook(() => useStoreValidation())
    let isValid

    act(() => {
      isValid = result.current.validate({ phone: '123' })
    })

    expect(isValid).toBe(false)
    expect(result.current.errors).toEqual({ phone: 'Invalid phone' })
  })

  it('clears one error by field', () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: { phone: 'Invalid phone', name: 'Required' },
    })

    const { result } = renderHook(() => useStoreValidation())

    act(() => {
      result.current.validate({ phone: '1' })
    })
    expect(result.current.errors).toEqual({
      phone: 'Invalid phone',
      name: 'Required',
    })

    act(() => {
      result.current.clearError('phone')
    })
    expect(result.current.errors).toEqual({ name: 'Required' })
  })

  it('clears all errors', () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: { phone: 'Invalid phone' },
    })

    const { result } = renderHook(() => useStoreValidation())

    act(() => {
      result.current.validate({ phone: '1' })
    })
    expect(result.current.errors).toEqual({ phone: 'Invalid phone' })

    act(() => {
      result.current.clearAllErrors()
    })
    expect(result.current.errors).toEqual({})
  })
})

