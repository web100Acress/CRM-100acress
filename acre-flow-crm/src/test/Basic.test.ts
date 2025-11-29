import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Basic Test Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should mock localStorage', () => {
    const mockSetItem = vi.fn()
    global.localStorage.setItem = mockSetItem
    
    localStorage.setItem('test', 'value')
    expect(mockSetItem).toHaveBeenCalledWith('test', 'value')
  })

  it('should mock fetch', () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    
    fetch('http://example.com')
    expect(mockFetch).toHaveBeenCalledWith('http://example.com')
  })

  it('should handle async operations', async () => {
    const result = await Promise.resolve(42)
    expect(result).toBe(42)
  })
})
