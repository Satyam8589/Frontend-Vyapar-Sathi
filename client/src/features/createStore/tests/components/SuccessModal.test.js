import React from 'react'
import { render, screen, fireEvent } from '@/test/test-utils'
import SuccessModal from '../../components/SuccessModal'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}))

describe('SuccessModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SuccessModal
        isOpen={false}
        onClose={jest.fn()}
        loading={false}
        success={false}
        storeName="Demo Store"
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders loading state', () => {
    render(
      <SuccessModal
        isOpen
        onClose={jest.fn()}
        loading
        success={false}
        storeName="Demo Store"
      />
    )

    expect(screen.getByText(/initializing store/i)).toBeInTheDocument()
  })

  it('navigates to store dashboard when success and storeId exists', () => {
    render(
      <SuccessModal
        isOpen
        onClose={jest.fn()}
        loading={false}
        success
        storeName="Demo Store"
        storeId="store-123"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /enter your store/i }))
    expect(mockPush).toHaveBeenCalledWith('/storeDashboard/store-123')
  })

  it('navigates to dashboard when success and storeId is missing', () => {
    render(
      <SuccessModal
        isOpen
        onClose={jest.fn()}
        loading={false}
        success
        storeName="Demo Store"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /enter your store/i }))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('renders error state and triggers onClose action', () => {
    const onClose = jest.fn()

    render(
      <SuccessModal
        isOpen
        onClose={onClose}
        loading={false}
        success={false}
        storeName="Demo Store"
        error="Failed to create store"
      />
    )

    expect(screen.getByText(/creation failed/i)).toBeInTheDocument()
    expect(screen.getByText('Failed to create store')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /go back & fix/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

