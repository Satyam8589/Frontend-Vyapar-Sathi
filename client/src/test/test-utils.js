import React from 'react'
import { render } from '@testing-library/react'

// Custom render function that can include providers
const customRender = (ui, options = {}) => {
  return render(ui, { ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }
