import {
  filterStores,
  sortStores,
  getStoreInitials,
  formatDate,
  getStoreColor,
} from '../../utils/helpers'

const stores = [
  {
    _id: 's1',
    name: 'Alpha Retail',
    phone: '9990001111',
    email: 'alpha@example.com',
    businessType: 'retail',
    address: { city: 'Delhi' },
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 's2',
    name: 'Bravo Mart',
    phone: '8880001111',
    email: 'bravo@example.com',
    businessType: 'wholesale',
    address: { city: 'Mumbai' },
    createdAt: '2024-03-01T00:00:00.000Z',
  },
  {
    _id: 's3',
    name: 'City Shop',
    phone: '7771234567',
    email: 'hello@city.com',
    businessType: 'retail',
    address: { city: 'Pune' },
    createdAt: '2024-02-01T00:00:00.000Z',
  },
]

describe('storeDashboard helpers', () => {
  describe('filterStores', () => {
    it('filters by search across store fields', () => {
      const byCity = filterStores(stores, { search: 'delhi', businessType: 'all' })
      expect(byCity.map((store) => store._id)).toEqual(['s1'])

      const byPhone = filterStores(stores, { search: '1234', businessType: 'all' })
      expect(byPhone.map((store) => store._id)).toEqual(['s3'])
    })

    it('filters by business type', () => {
      const result = filterStores(stores, { search: '', businessType: 'retail' })
      expect(result.map((store) => store._id)).toEqual(['s1', 's3'])
    })
  })

  describe('sortStores', () => {
    it('sorts by newest created date by default option', () => {
      const result = sortStores(stores, 'created-desc')
      expect(result.map((store) => store._id)).toEqual(['s2', 's3', 's1'])
    })

    it('sorts by name ascending', () => {
      const result = sortStores(stores, 'name-asc')
      expect(result.map((store) => store._id)).toEqual(['s1', 's2', 's3'])
    })
  })

  describe('display helpers', () => {
    it('builds store initials with fallback', () => {
      expect(getStoreInitials('Alpha Retail')).toBe('AR')
      expect(getStoreInitials('shop')).toBe('SH')
      expect(getStoreInitials('')).toBe('??')
    })

    it('formats date and handles empty value', () => {
      expect(formatDate('2024-01-15T00:00:00.000Z')).toContain('2024')
      expect(formatDate('')).toBe('')
    })

    it('returns deterministic card colors by index', () => {
      expect(getStoreColor(0)).toBe('#3B82F6')
      expect(getStoreColor(7)).toBe('#3B82F6')
    })
  })
})

