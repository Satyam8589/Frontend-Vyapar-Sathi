import React from 'react'
import { render, screen } from '@/test/test-utils'
import ReviewStep from '../../../components/steps/ReviewStep'
import { useCreateStoreContext } from '../../../context/CreateStoreContext'

jest.mock('../../../context/CreateStoreContext', () => ({
  useCreateStoreContext: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

describe('ReviewStep', () => {
  const baseContext = {
    formData: {
      name: 'Demo Store',
      phone: '9876543210',
      email: 'demo@store.com',
      address: {
        street: 'MG Road',
        city: 'Bengaluru',
        state: 'KA',
        pincode: '560001',
        fullAddress: 'MG Road, Bengaluru, KA, 560001, India',
      },
      businessType: 'retail',
      description: 'Retail grocery store',
      settings: {
        lowStockThreshold: 10,
        expiryAlertDays: 7,
        currency: 'INR',
      },
    },
    submitError: null,
    submitSuccess: false,
    createdStore: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useCreateStoreContext.mockReturnValue(baseContext)
  })

  it('renders store summary details', () => {
    render(<ReviewStep />)

    expect(screen.getByText('Demo Store')).toBeInTheDocument()
    expect(screen.getByText('9876543210')).toBeInTheDocument()
    expect(screen.getByText('demo@store.com')).toBeInTheDocument()
    expect(screen.getByText('Retail')).toBeInTheDocument()
    expect(screen.getByText('Retail grocery store')).toBeInTheDocument()
    expect(screen.getByText('10 units')).toBeInTheDocument()
    expect(screen.getByText('7 days')).toBeInTheDocument()
    expect(screen.getByText(/\(INR\)/)).toBeInTheDocument()
  })

  it('shows N/A for missing optional address fields', () => {
    useCreateStoreContext.mockReturnValue({
      ...baseContext,
      formData: {
        ...baseContext.formData,
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          fullAddress: 'India',
        },
      },
    })

    render(<ReviewStep />)
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0)
  })

  it('falls back to raw business type when label is unknown', () => {
    useCreateStoreContext.mockReturnValue({
      ...baseContext,
      formData: {
        ...baseContext.formData,
        businessType: 'customType',
      },
    })

    render(<ReviewStep />)
    expect(screen.getByText('customType')).toBeInTheDocument()
  })

  it('hides optional email and description when empty', () => {
    useCreateStoreContext.mockReturnValue({
      ...baseContext,
      formData: {
        ...baseContext.formData,
        email: '',
        description: '',
      },
    })

    render(<ReviewStep />)
    expect(screen.queryByText('demo@store.com')).not.toBeInTheDocument()
    expect(screen.queryByText('Retail grocery store')).not.toBeInTheDocument()
  })

  it('renders submit error message when present', () => {
    useCreateStoreContext.mockReturnValue({
      ...baseContext,
      submitError: 'Store creation failed',
    })

    render(<ReviewStep />)
    expect(screen.getByText('Store creation failed')).toBeInTheDocument()
  })
})

