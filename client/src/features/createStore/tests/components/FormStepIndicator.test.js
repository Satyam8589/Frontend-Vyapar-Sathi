import React from 'react'
import { render, screen } from '@/test/test-utils'
import FormStepIndicator from '../../components/FormStepIndicator'

describe('FormStepIndicator', () => {
  it('renders all form step labels', () => {
    render(<FormStepIndicator currentStep={1} />)

    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('Business Details')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('applies active, completed, and pending label styles based on current step', () => {
    render(<FormStepIndicator currentStep={2} />)

    expect(screen.getByText('Basic Information')).toHaveClass('text-green-600')
    expect(screen.getByText('Address')).toHaveClass('text-blue-600')
    expect(screen.getByText('Business Details')).toHaveClass('text-gray-500')
  })

  it('shows completed check icons for prior steps', () => {
    const { container } = render(<FormStepIndicator currentStep={4} />)
    const icons = container.querySelectorAll('svg')

    expect(icons.length).toBe(3)
  })
})

