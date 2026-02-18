import {
  formatPhoneNumber,
  cleanPhoneNumber,
  validatePhone,
  validateEmail,
  validatePincode,
  validateLength,
  formatAddress,
  generateFullAddress,
  truncateText,
  capitalizeWords,
  getCurrencySymbol,
  hasUnsavedChanges,
  deepClone,
  removeEmptyFields,
  debounce,
  getFieldError,
  isStepValid,
  getFormProgress,
  sanitizeInput,
  formatDate,
  isOnline,
} from '../../utils/helpers'

describe('createStore helpers', () => {
  describe('phone helpers', () => {
    it('formats a 10-digit phone number', () => {
      expect(formatPhoneNumber('9876543210')).toBe('987-654-3210')
    })

    it('returns cleaned phone when length is not 10', () => {
      expect(formatPhoneNumber('+91 98765-43210')).toBe('919876543210')
    })

    it('cleans non-digit characters from phone', () => {
      expect(cleanPhoneNumber('(987) 654-3210')).toBe('9876543210')
    })

    it('validates phone after cleaning formatting', () => {
      expect(validatePhone('(987) 654-3210')).toBe(true)
      expect(validatePhone('12345')).toBe(false)
    })
  })

  describe('validation helpers', () => {
    it('validates optional email', () => {
      expect(validateEmail('')).toBe(true)
      expect(validateEmail('store@example.com')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
    })

    it('validates pincode format', () => {
      expect(validatePincode('560001')).toBe(true)
      expect(validatePincode('56001')).toBe(false)
      expect(validatePincode('')).toBe(false)
    })

    it('validates value length against max length', () => {
      expect(validateLength('abcd', 5)).toBe(true)
      expect(validateLength('abcdef', 5)).toBe(false)
      expect(validateLength('', 5)).toBe(true)
    })
  })

  describe('format helpers', () => {
    it('formats address from available fields', () => {
      const address = {
        street: 'MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India',
      }

      expect(formatAddress(address)).toBe('MG Road, Bengaluru, Karnataka, 560001, India')
      expect(generateFullAddress(address)).toBe('MG Road, Bengaluru, Karnataka, 560001, India')
    })

    it('truncates text and appends ellipsis', () => {
      expect(truncateText('Hello world', 8)).toBe('Hello...')
      expect(truncateText('Short', 10)).toBe('Short')
    })

    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('hello world store')).toBe('Hello World Store')
      expect(capitalizeWords('')).toBe('')
    })

    it('returns currency symbol for known code or code itself', () => {
      expect(getCurrencySymbol('USD')).toBe('$')
      expect(getCurrencySymbol('ABC')).toBe('ABC')
    })
  })

  describe('object helpers', () => {
    it('detects unsaved changes based on object content', () => {
      const original = { name: 'Store', phone: '9876543210' }
      const updated = { name: 'Store', phone: '9999999999' }

      expect(hasUnsavedChanges(original, { ...original })).toBe(false)
      expect(hasUnsavedChanges(updated, original)).toBe(true)
    })

    it('deep clones objects without reference sharing', () => {
      const original = {
        name: 'Store',
        address: { city: 'Delhi' },
      }

      const copy = deepClone(original)
      copy.address.city = 'Mumbai'

      expect(original.address.city).toBe('Delhi')
      expect(copy.address.city).toBe('Mumbai')
    })

    it('removes empty fields recursively while preserving falsey valid values', () => {
      const input = {
        name: 'Store',
        email: '',
        address: {
          city: 'Delhi',
          state: '',
        },
        isActive: false,
        lowStockThreshold: 0,
        tags: [],
        misc: null,
      }

      expect(removeEmptyFields(input)).toEqual({
        name: 'Store',
        address: {
          city: 'Delhi',
        },
        isActive: false,
        lowStockThreshold: 0,
        tags: [],
      })
    })
  })

  describe('error and step helpers', () => {
    it('gets error for direct and nested fields', () => {
      const errors = {
        name: 'Name is required',
        address: {
          city: 'City is required',
        },
        fullAddress: 'Full address is required',
      }

      expect(getFieldError(errors, 'name')).toBe('Name is required')
      expect(getFieldError(errors, 'address.city')).toBe('City is required')
      expect(getFieldError(errors, 'address.fullAddress')).toBe('Full address is required')
      expect(getFieldError(errors, 'unknown')).toBe(null)
      expect(getFieldError(null, 'name')).toBe(null)
    })

    it('validates form steps with required fields and error state', () => {
      const validFormData = {
        name: 'My Store',
        phone: '9876543210',
        address: {
          fullAddress: 'MG Road, Bengaluru',
        },
        businessType: 'retail',
      }

      expect(isStepValid(1, validFormData, {})).toBe(true)
      expect(isStepValid(1, validFormData, { phone: 'Invalid phone' })).toBe(false)
      expect(isStepValid(2, validFormData, {})).toBe(true)
      expect(isStepValid(2, validFormData, { fullAddress: 'Required' })).toBe(false)
      expect(isStepValid(3, validFormData, {})).toBe(true)
      expect(isStepValid(3, { ...validFormData, businessType: '' }, {})).toBe(false)
    })

    it('calculates rounded form progress percentage', () => {
      expect(getFormProgress(1, 4)).toBe(25)
      expect(getFormProgress(3, 4)).toBe(75)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })

    it('calls function once with latest arguments after delay', () => {
      const fn = jest.fn()
      const debounced = debounce(fn, 300)

      debounced('first')
      debounced('second')

      expect(fn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(299)
      expect(fn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('second')
    })
  })

  describe('browser environment helpers', () => {
    it('sanitizes html-like input safely', () => {
      const input = '<script>alert("xss")</script>'
      const sanitized = sanitizeInput(input)

      expect(sanitized).toContain('&lt;script&gt;')
      expect(sanitized).toContain('&lt;/script&gt;')
      expect(sanitizeInput(123)).toBe(123)
    })

    it('formats date for display', () => {
      const formatted = formatDate('2024-01-15T00:00:00.000Z')
      expect(formatted).toContain('2024')
      expect(formatted.toLowerCase()).toContain('january')
      expect(formatDate('')).toBe('')
    })

    it('returns online status from navigator', () => {
      const originalOnline = navigator.onLine

      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: false,
      })
      expect(isOnline()).toBe(false)

      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: originalOnline,
      })
    })
  })
})
