import React from 'react'
import { render, screen, fireEvent } from '@/test/test-utils'
import FormNavigation from '../../components/FormNavigation'

describe('FormNavigation', () => {
  it('shows next button and hides previous on first step', () => {
    const onNext = jest.fn()

    render(
      <FormNavigation
        currentStep={1}
        totalSteps={4}
        onNext={onNext}
        onPrevious={jest.fn()}
        onSubmit={jest.fn()}
      />
    )

    expect(screen.queryByText(/previous/i)).not.toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('shows previous button on non-first steps and calls handler', () => {
    const onPrevious = jest.fn()

    render(
      <FormNavigation
        currentStep={2}
        totalSteps={4}
        onNext={jest.fn()}
        onPrevious={onPrevious}
        onSubmit={jest.fn()}
      />
    )

    const previousButton = screen.getByRole('button', { name: /previous/i })
    fireEvent.click(previousButton)
    expect(onPrevious).toHaveBeenCalledTimes(1)
  })

  it('shows create store button on last step and calls submit', () => {
    const onSubmit = jest.fn()

    render(
      <FormNavigation
        currentStep={4}
        totalSteps={4}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSubmit={onSubmit}
      />
    )

    const submitButton = screen.getByRole('button', { name: /create store/i })
    fireEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables next button when cannot go next or loading', () => {
    const { rerender } = render(
      <FormNavigation
        currentStep={2}
        totalSteps={4}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSubmit={jest.fn()}
        canGoNext={false}
      />
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()

    rerender(
      <FormNavigation
        currentStep={2}
        totalSteps={4}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSubmit={jest.fn()}
        canGoNext
        loading
      />
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})

