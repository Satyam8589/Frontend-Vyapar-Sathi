/**
 * Example test to verify the testing setup is working
 * Run: npm test
 */

describe('Testing Framework Setup', () => {
  it('should successfully run basic tests', () => {
    expect(true).toBe(true)
  })

  it('should perform basic arithmetic', () => {
    const result = 2 + 2
    expect(result).toBe(4)
  })

  it('should handle string operations', () => {
    const message = 'Hello, World!'
    expect(message).toContain('World')
    expect(message.length).toBe(13)
  })
})
