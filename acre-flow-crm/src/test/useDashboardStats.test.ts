import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDashboardStats } from '@/hooks/useDashboardStats'

// Mock the http module
vi.mock('@/api/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

import http from '@/api/http'

describe('useDashboardStats Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should return loading state initially', () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [],
    })

    const { result } = renderHook(() => 
      useDashboardStats('head', 'user123')
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.stats).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should fetch and calculate stats for head role', async () => {
    const mockLeads = [
      { 
        _id: '1', 
        assignmentChain: [{ userId: 'user123' }],
        status: 'Converted',
        value: 100000
      },
      { 
        _id: '2', 
        assignedTo: 'user123',
        status: 'Pending',
        value: 50000
      },
      { 
        _id: '3', 
        assignmentChain: [{ userId: 'user123' }],
        status: 'In Progress',
        value: 75000
      }
    ]

    const mockUsers = [
      { _id: '1', role: 'team-leader', team: 'Team A' },
      { _id: '2', role: 'employee', team: 'Team A' },
      { _id: '3', role: 'team-leader', team: 'Team B' },
      { _id: '4', role: 'employee', team: 'Team B' },
    ]

    vi.mocked(http.get)
      .mockResolvedValueOnce({ data: mockLeads })  // First call for leads
      .mockResolvedValueOnce({ data: mockUsers })  // Second call for users

    const { result } = renderHook(() => 
      useDashboardStats('head', 'user123')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stats).toEqual({
      managedLeads: 3,
      totalTeams: 2,
      pendingApprovals: 1,
      overallConversion: 33
    })
  })

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Network error'
    vi.mocked(http.get).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => 
      useDashboardStats('head', 'user123')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.stats).toEqual({
      totalLeads: 0,
      activeUsers: 0,
      openTickets: 0,
      monthlyRevenue: 0,
      managedLeads: 0,
      totalTeams: 0,
      pendingApprovals: 0,
      overallConversion: 0
    })
  })

  it('should return early if userRole or userId is missing', () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] })

    const { result } = renderHook(() => 
      useDashboardStats('', 'user123')
    )

    expect(result.current.loading).toBe(false)
    expect(result.current.stats).toBe(null)
    expect(result.current.error).toBe(null)
    expect(http.get).not.toHaveBeenCalled()
  })

  it('should calculate stats for super-admin role', async () => {
    const mockLeads = [
      { _id: '1', status: 'Converted', value: 100000 },
      { _id: '2', status: 'Closed', value: 50000 },
      { _id: '3', status: 'In Progress', value: 75000 },
    ]

    const mockUsers = [
      { _id: '1', isActive: true },
      { _id: '2', isActive: false },
      { _id: '3', isActive: true },
    ]

    vi.mocked(http.get)
      .mockResolvedValueOnce({ data: mockLeads })
      .mockResolvedValueOnce({ data: mockUsers })

    const { result } = renderHook(() => 
      useDashboardStats('super-admin', 'admin123')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stats).toEqual({
      totalLeads: 3,
      activeUsers: 2,
      openTickets: 2, // Leads that are not 'Closed'
      monthlyRevenue: 225000 // Sum of all lead values
    })
  })
})
