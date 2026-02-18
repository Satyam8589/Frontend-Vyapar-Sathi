import React from 'react'
import { render, screen, fireEvent } from '@/test/test-utils'
import AddressStep from '../../../components/steps/AddressStep'
import { useCreateStoreContext } from '../../../context/CreateStoreContext'

jest.mock('../../../context/CreateStoreContext', () => ({
  useCreateStoreContext: jest.fn(),
}))

describe('AddressStep', () => {
  const baseFormData = {
    address: {
      street: 'MG Road',
      city: 'Bengaluru',
      state: 'KA',
      pincode: '560001',
      country: 'India',
      fullAddress: '',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('auto-generates full address when address fields are present', () => {
    const updateField = jest.fn()
    useCreateStoreContext.mockReturnValue({
      formData: baseFormData,
      updateField,
      errors: {},
    })

    render(<AddressStep />)

    expect(updateField).toHaveBeenCalledWith(
      'address.fullAddress',
      'MG Road, Bengaluru, KA, 560001, India'
    )
  })

  it('does not auto-update full address if value is already in sync', () => {
    const updateField = jest.fn()
    useCreateStoreContext.mockReturnValue({
      formData: {
        address: {
          ...baseFormData.address,
          fullAddress: 'MG Road, Bengaluru, KA, 560001, India',
        },
      },
      updateField,
      errors: {},
    })

    render(<AddressStep />)
    expect(updateField).not.toHaveBeenCalledWith('address.fullAddress', expect.anything())
  })

  it('sanitizes pincode to digits and enforces max 6 digits', () => {
    const updateField = jest.fn()
    useCreateStoreContext.mockReturnValue({
      formData: baseFormData,
      updateField,
      errors: {},
    })

    render(<AddressStep />)

    fireEvent.change(screen.getByLabelText(/pincode/i), {
      target: { value: '56A00B' },
    })
    expect(updateField).toHaveBeenCalledWith('address.pincode', '5600')

    updateField.mockClear()

    fireEvent.change(screen.getByLabelText(/pincode/i), {
      target: { value: '56000199' },
    })
    expect(updateField).not.toHaveBeenCalledWith('address.pincode', expect.anything())
  })

  it('updates city and state fields via context updater', () => {
    const updateField = jest.fn()
    useCreateStoreContext.mockReturnValue({
      formData: baseFormData,
      updateField,
      errors: {},
    })

    render(<AddressStep />)

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Mysuru' },
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'TN' },
    })

    expect(updateField).toHaveBeenCalledWith('address.city', 'Mysuru')
    expect(updateField).toHaveBeenCalledWith('address.state', 'TN')
  })
})

