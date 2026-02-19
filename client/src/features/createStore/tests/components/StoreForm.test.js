import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import StoreForm from '../../components/StoreForm'
import { useCreateStoreContext } from '../../context/CreateStoreContext'

jest.mock('../../context/CreateStoreContext', () => ({
  useCreateStoreContext: jest.fn(),
}))

jest.mock('../../components/FormStepIndicator', () => ({
  __esModule: true,
  default: ({ currentStep }) => <div data-testid="step-indicator">Step {currentStep}</div>,
}))

jest.mock('../../components/FormNavigation', () => ({
  __esModule: true,
  default: ({ currentStep, totalSteps, onNext, onPrevious, onSubmit }) => (
    <div data-testid="form-navigation">
      <button type="button" onClick={onPrevious}>
        Previous
      </button>
      <button type="button" onClick={currentStep === totalSteps ? onSubmit : onNext}>
        {currentStep === totalSteps ? 'Create Store' : 'Next'}
      </button>
    </div>
  ),
}))

jest.mock('../../components/steps/BasicInfoStep', () => ({
  __esModule: true,
  default: () => <div>Mock Basic Step</div>,
}))

jest.mock('../../components/steps/AddressStep', () => ({
  __esModule: true,
  default: () => <div>Mock Address Step</div>,
}))

jest.mock('../../components/steps/BusinessDetailsStep', () => ({
  __esModule: true,
  default: () => <div>Mock Business Step</div>,
}))

jest.mock('../../components/steps/ReviewStep', () => ({
  __esModule: true,
  default: () => <div>Mock Review Step</div>,
}))

jest.mock('../../components/SuccessModal', () => ({
  __esModule: true,
  default: ({ isOpen }) => <div data-testid="success-modal">{isOpen ? 'open' : 'closed'}</div>,
}))

describe('StoreForm', () => {
  const mockContext = {
    step: 1,
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    handleSubmit: jest.fn().mockResolvedValue({ success: true }),
    loading: false,
    submitSuccess: false,
    formData: { name: 'My Test Store' },
    createdStore: { _id: 'store-1' },
    submitError: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useCreateStoreContext.mockReturnValue(mockContext)
  })

  it('renders step indicator and current step content', () => {
    render(<StoreForm />)

    expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 1')
    expect(screen.getByText('Mock Basic Step')).toBeInTheDocument()
  })

  it('renders corresponding step component based on active step', () => {
    const { rerender } = render(<StoreForm />)
    expect(screen.getByText('Mock Basic Step')).toBeInTheDocument()

    useCreateStoreContext.mockReturnValue({ ...mockContext, step: 2 })
    rerender(<StoreForm />)
    expect(screen.getByText('Mock Address Step')).toBeInTheDocument()

    useCreateStoreContext.mockReturnValue({ ...mockContext, step: 3 })
    rerender(<StoreForm />)
    expect(screen.getByText('Mock Business Step')).toBeInTheDocument()

    useCreateStoreContext.mockReturnValue({ ...mockContext, step: 4 })
    rerender(<StoreForm />)
    expect(screen.getByText('Mock Review Step')).toBeInTheDocument()
  })

  it('submitting form via enter moves to next step when not on last step', () => {
    const { container } = render(<StoreForm />)

    fireEvent.submit(container.querySelector('form'))
    expect(mockContext.nextStep).toHaveBeenCalledTimes(1)
    expect(mockContext.handleSubmit).not.toHaveBeenCalled()
  })

  it('does not auto-submit on form submit when on last step', () => {
    useCreateStoreContext.mockReturnValue({
      ...mockContext,
      step: 4,
    })

    const { container } = render(<StoreForm />)
    fireEvent.submit(container.querySelector('form'))

    expect(mockContext.nextStep).not.toHaveBeenCalled()
    expect(mockContext.handleSubmit).not.toHaveBeenCalled()
  })

  it('calls handleSubmit when create store button is clicked on last step', async () => {
    const handleSubmit = jest.fn().mockResolvedValue({ success: true })
    useCreateStoreContext.mockReturnValue({
      ...mockContext,
      step: 4,
      handleSubmit,
    })

    render(<StoreForm />)
    fireEvent.click(screen.getByRole('button', { name: /create store/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('hides navigation when submit is successful', () => {
    useCreateStoreContext.mockReturnValue({
      ...mockContext,
      submitSuccess: true,
    })

    render(<StoreForm />)

    expect(screen.queryByTestId('form-navigation')).not.toBeInTheDocument()
  })

  it('opens success modal for loading/success/error states', () => {
    const { rerender } = render(<StoreForm />)
    expect(screen.getByTestId('success-modal')).toHaveTextContent('closed')

    useCreateStoreContext.mockReturnValue({
      ...mockContext,
      loading: true,
    })
    rerender(<StoreForm />)
    expect(screen.getByTestId('success-modal')).toHaveTextContent('open')

    useCreateStoreContext.mockReturnValue({
      ...mockContext,
      loading: false,
      submitError: 'Something failed',
    })
    rerender(<StoreForm />)
    expect(screen.getByTestId('success-modal')).toHaveTextContent('open')
  })
})

