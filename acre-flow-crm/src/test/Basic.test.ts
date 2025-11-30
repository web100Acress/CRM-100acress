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
    const mockFetch = vi.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      url: 'http://example.com',
      clone: () => ({} as Response)
    }))
    
    // Add all fetch properties to the mock
    Object.assign(mockFetch, {
      preconnect: vi.fn(),
      dnsPrefetch: vi.fn(),
      prefetch: vi.fn()
    })
    
    global.fetch = mockFetch as any
    
    fetch('http://example.com')
    expect(mockFetch).toHaveBeenCalledWith('http://example.com')
  })

  it('should handle async operations', async () => {
    const result = await Promise.resolve(42)
    expect(result).toBe(42)
  })
})
