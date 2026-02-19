import React from 'react'
import { render, screen, fireEvent } from '@/test/test-utils'
import BasicInfoStep from '../../../components/steps/BasicInfoStep'
import { useCreateStoreContext } from '../../../context/CreateStoreContext'

jest.mock('../../../context/CreateStoreContext', () => ({
  useCreateStoreContext: jest.fn(),
}))

describe('BasicInfoStep', () => {
  const mockUpdateField = jest.fn()

  const mockContext = {
    formData: {
      name: 'My Store',
      phone: '',
      email: '',
    },
    updateField: mockUpdateField,
    errors: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useCreateStoreContext.mockReturnValue(mockContext)
  })

  it('updates store name and email on change', () => {
    render(<BasicInfoStep />)

    fireEvent.change(screen.getByLabelText(/store name/i), {
      target: { value: 'New Store Name' },
    })
    fireEvent.change(screen.getByLabelText(/email \(optional\)/i), {
      target: { value: 'store@example.com' },
    })

    expect(mockUpdateField).toHaveBeenCalledWith('name', 'New Store Name')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'store@example.com')
  })

  it('sanitizes phone number and limits it to 10 digits', () => {
    render(<BasicInfoStep />)

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '(987)65-43210' },
    })

    expect(mockUpdateField).toHaveBeenCalledWith('phone', '9876543210')
  })

  it('does not update phone when sanitized value exceeds 10 digits', () => {
    render(<BasicInfoStep />)

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890123' },
    })

    expect(mockUpdateField).not.toHaveBeenCalledWith('phone', expect.anything())
  })

  it('renders validation errors when provided', () => {
    useCreateStoreContext.mockReturnValue({
      ...mockContext,
      errors: {
        name: 'Name is required',
        phone: 'Invalid phone',
      },
    })

    render(<BasicInfoStep />)

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid phone')).toBeInTheDocument()
  })
})
