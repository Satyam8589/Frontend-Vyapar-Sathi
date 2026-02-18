import React from 'react'
import { renderHook, act } from '@testing-library/react'
import {
  CreateStoreProvider,
  useCreateStoreContext,
} from '../../context/CreateStoreContext'
import { createStore, validateStoreData } from '../../services/storeService'
import { showSuccess, showError, showWarning } from '@/utils/toast'

jest.mock('../../services/storeService', () => ({
  createStore: jest.fn(),
  validateStoreData: jest.fn(),
}))

jest.mock('@/utils/toast', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn(),
}))

const wrapper = ({ children }) => <CreateStoreProvider>{children}</CreateStoreProvider>

describe('CreateStoreContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws when useCreateStoreContext is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useCreateStoreContext())).toThrow(
      'useCreateStoreContext must be used within a CreateStoreProvider'
    )

    spy.mockRestore()
  })

  it('exposes initial form and UI state', () => {
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    expect(result.current.step).toBe(1)
    expect(result.current.loading).toBe(false)
    expect(result.current.submitSuccess).toBe(false)
    expect(result.current.submitError).toBe(null)
    expect(result.current.errors).toEqual({})
    expect(result.current.formData.address.country).toBe('India')
  })

  it('updates simple and nested fields', () => {
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    act(() => {
      result.current.updateField('name', 'My Store')
      result.current.updateField('address.city', 'Delhi')
    })

    expect(result.current.formData.name).toBe('My Store')
    expect(result.current.formData.address.city).toBe('Delhi')
  })

  it('moves to next step when current step is valid', () => {
    validateStoreData.mockReturnValue({ isValid: true, errors: {} })
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    let canMove
    act(() => {
      canMove = result.current.nextStep()
    })

    expect(canMove).toBe(true)
    expect(result.current.step).toBe(2)
  })

  it('does not move to next step when current step is invalid', () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: { name: 'Store name is required' },
    })
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    let canMove
    act(() => {
      canMove = result.current.nextStep()
    })

    expect(canMove).toBe(false)
    expect(result.current.step).toBe(1)
    expect(result.current.errors).toEqual({ name: 'Store name is required' })
    expect(showWarning).toHaveBeenCalledWith('Please fill in all required fields correctly.')
  })

  it('validates step 2 with address-specific error filtering', () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: {
        name: 'Store name is required',
        fullAddress: 'Full address is required',
      },
    })
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    let valid
    act(() => {
      valid = result.current.validateStep(2)
    })

    expect(valid).toBe(false)
    expect(result.current.errors).toEqual({ fullAddress: 'Full address is required' })
    expect(showWarning).toHaveBeenCalledWith('Please provide a valid address.')
  })

  it('submits successfully when data is valid', async () => {
    validateStoreData.mockReturnValue({ isValid: true, errors: {} })
    createStore.mockResolvedValue({ data: { _id: 'store-123' } })
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    act(() => {
      result.current.updateField('name', 'Demo Store')
      result.current.updateField('phone', '9876543210')
      result.current.updateField('address.fullAddress', 'MG Road, Bengaluru')
    })

    let response
    await act(async () => {
      response = await result.current.handleSubmit()
    })

    expect(createStore).toHaveBeenCalledWith(result.current.formData)
    expect(response.success).toBe(true)
    expect(result.current.submitSuccess).toBe(true)
    expect(result.current.createdStore).toEqual({ _id: 'store-123' })
    expect(result.current.loading).toBe(false)
    expect(showSuccess).toHaveBeenCalledWith('Store "Demo Store" created successfully!')
  })

  it('returns validation errors on submit when data is invalid', async () => {
    validateStoreData.mockReturnValue({
      isValid: false,
      errors: { phone: 'Please provide a valid 10-digit phone number' },
    })
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    let response
    await act(async () => {
      response = await result.current.handleSubmit()
    })

    expect(createStore).not.toHaveBeenCalled()
    expect(response).toEqual({
      success: false,
      errors: { phone: 'Please provide a valid 10-digit phone number' },
    })
    expect(result.current.errors).toEqual({
      phone: 'Please provide a valid 10-digit phone number',
    })
    expect(result.current.loading).toBe(false)
    expect(showError).toHaveBeenCalledWith('Please fix the errors before submitting.')
  })

  it('handles API error on submit', async () => {
    validateStoreData.mockReturnValue({ isValid: true, errors: {} })
    createStore.mockRejectedValue(new Error('Network down'))
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    let response
    await act(async () => {
      response = await result.current.handleSubmit()
    })

    expect(response).toEqual({
      success: false,
      error: 'Network down',
    })
    expect(result.current.submitError).toBe('Network down')
    expect(result.current.loading).toBe(false)
    expect(showError).toHaveBeenCalledWith('Network down')
  })

  it('resets the form state to defaults', () => {
    validateStoreData.mockReturnValue({ isValid: false, errors: { name: 'Required' } })
    const { result } = renderHook(() => useCreateStoreContext(), { wrapper })

    act(() => {
      result.current.updateField('name', 'Temporary Name')
      result.current.setStep(3)
      result.current.validateStep(1)
    })

    expect(result.current.formData.name).toBe('Temporary Name')
    expect(result.current.step).toBe(3)
    expect(result.current.errors).toEqual({ name: 'Required' })

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.formData.name).toBe('')
    expect(result.current.formData.address.country).toBe('India')
    expect(result.current.step).toBe(1)
    expect(result.current.errors).toEqual({})
    expect(result.current.submitError).toBe(null)
    expect(result.current.submitSuccess).toBe(false)
  })
})

