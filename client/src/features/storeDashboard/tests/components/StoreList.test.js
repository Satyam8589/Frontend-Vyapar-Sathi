import React from 'react'
import { render, screen, fireEvent } from '@/test/test-utils'
import StoreList from '../../components/StoreList'

jest.mock('../../components/StoreCard', () => {
  return function MockStoreCard({ store, onClick }) {
    return <button onClick={() => onClick?.(store)}>{store.name}</button>
  }
})

describe('StoreList', () => {
  const stores = [
    { _id: 's1', name: 'Alpha Retail' },
    { _id: 's2', name: 'Bravo Mart' },
  ]

  it('shows an error panel with retry CTA', () => {
    render(
      <StoreList stores={[]} loading={false} error="Network down" onStoreClick={jest.fn()} />
    )

    expect(screen.getByText(/sync connection lost/i)).toBeInTheDocument()
    expect(screen.getByText('Network down')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry connection/i })).toBeInTheDocument()
  })

  it('shows empty state when there are no stores', () => {
    render(<StoreList stores={[]} loading={false} error={null} onStoreClick={jest.fn()} />)

    expect(screen.getByText(/no active outlets/i)).toBeInTheDocument()
  })

  it('renders grid cards and forwards click events', () => {
    const onStoreClick = jest.fn()

    render(
      <StoreList
        stores={stores}
        loading={false}
        error={null}
        onStoreClick={onStoreClick}
        viewMode="grid"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Alpha Retail' }))
    expect(onStoreClick).toHaveBeenCalledWith(stores[0])
    expect(screen.getByRole('button', { name: 'Bravo Mart' })).toBeInTheDocument()
  })
})

