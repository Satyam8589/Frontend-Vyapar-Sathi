import React from 'react'
import { render, screen, fireEvent } from '@/test/test-utils'
import BusinessDetailsStep from '../../../components/steps/BusinessDetailsStep'
import { useCreateStoreContext } from '../../../context/CreateStoreContext'

jest.mock('../../../context/CreateStoreContext', () => ({
  useCreateStoreContext: jest.fn(),
}))

describe('BusinessDetailsStep', () => {
  const mockUpdateField = jest.fn()
  const baseContext = {
    formData: {
      businessType: 'retail',
      description: '',
      settings: {
        lowStockThreshold: 10,
        expiryAlertDays: 7,
        currency: 'INR',
      },
    },
    updateField: mockUpdateField,
    errors: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useCreateStoreContext.mockReturnValue(baseContext)
  })

  it('updates business type and description fields', () => {
    render(<BusinessDetailsStep />)

    fireEvent.change(screen.getByLabelText(/business type/i), {
      target: { value: 'wholesale' },
    })
    fireEvent.change(screen.getByLabelText(/store description/i), {
      target: { value: 'We sell groceries' },
    })

    expect(mockUpdateField).toHaveBeenCalledWith('businessType', 'wholesale')
    expect(mockUpdateField).toHaveBeenCalledWith('description', 'We sell groceries')
  })

  it('updates numeric settings and falls back to 0 for invalid number', () => {
    render(<BusinessDetailsStep />)

    fireEvent.change(screen.getByLabelText(/low stock threshold/i), {
      target: { value: '25' },
    })
    fireEvent.change(screen.getByLabelText(/expiry alert days/i), {
      target: { value: '' },
    })

    expect(mockUpdateField).toHaveBeenCalledWith('settings.lowStockThreshold', 25)
    expect(mockUpdateField).toHaveBeenCalledWith('settings.expiryAlertDays', 0)
  })

  it('updates currency setting', () => {
    render(<BusinessDetailsStep />)

    fireEvent.change(screen.getByLabelText(/currency/i), {
      target: { value: 'USD' },
    })

    expect(mockUpdateField).toHaveBeenCalledWith('settings.currency', 'USD')
  })

  it('renders field errors', () => {
    useCreateStoreContext.mockReturnValue({
      ...baseContext,
      errors: {
        businessType: 'Business type is required',
        lowStockThreshold: 'Must be a positive number',
      },
    })

    render(<BusinessDetailsStep />)

    expect(screen.getByText('Business type is required')).toBeInTheDocument()
    expect(screen.getByText('Must be a positive number')).toBeInTheDocument()
  })
})

