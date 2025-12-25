import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import store from '@/store'
import Dashboard from '@/features/users/pages/Dashboard'

// Mock the useDashboardStats hook
vi.mock('@/hooks/useDashboardStats', () => ({
  useDashboardStats: vi.fn(),
}))

import { useDashboardStats } from '@/hooks/useDashboardStats'

// Test wrapper component that provides all required context
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title for head role', () => {
    const mockStats = {
      managedLeads: 10,
      totalTeams: 3,
      pendingApprovals: 5,
      overallConversion: 75
    }

    vi.mocked(useDashboardStats).mockReturnValue({
      stats: mockStats,
      loading: false,
      error: null
    })

    render(
      <TestWrapper>
        <Dashboard userRole="head" />
      </TestWrapper>
    )
    
    expect(screen.getByText('Head Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your teams and track performance')).toBeInTheDocument()
  })

  it('renders dashboard title for head-admin role', () => {
    const mockStats = {
      managedLeads: 15,
      totalTeams: 5,
      pendingApprovals: 8,
      overallConversion: 82
    }

    vi.mocked(useDashboardStats).mockReturnValue({
      stats: mockStats,
      loading: false,
      error: null
    })

    render(
      <TestWrapper>
        <Dashboard userRole="head-admin" />
      </TestWrapper>
    )
    
    expect(screen.getByText('Head Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your teams and track performance')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    vi.mocked(useDashboardStats).mockReturnValue({
      stats: null,
      loading: true,
      error: null
    })

    render(
      <TestWrapper>
        <Dashboard userRole="head" />
      </TestWrapper>
    )
    
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useDashboardStats).mockReturnValue({
      stats: null,
      loading: false,
      error: 'Failed to fetch data'
    })

    render(
      <TestWrapper>
        <Dashboard userRole="head" />
      </TestWrapper>
    )
    
    expect(screen.getByText('Error loading dashboard: Failed to fetch data')).toBeInTheDocument()
  })

  it('renders correct stats for head role', () => {
    const mockStats = {
      managedLeads: 25,
      totalTeams: 4,
      pendingApprovals: 7,
      overallConversion: 68
    }

    vi.mocked(useDashboardStats).mockReturnValue({
      stats: mockStats,
      loading: false,
      error: null
    })

    render(
      <TestWrapper>
        <Dashboard userRole="head" />
      </TestWrapper>
    )
    
    expect(screen.getByText('25')).toBeInTheDocument() // Managed Leads
    expect(screen.getByText('4')).toBeInTheDocument()  // Total Teams
    expect(screen.getByText('7')).toBeInTheDocument()  // Pending Approvals
    expect(screen.getByText('68%')).toBeInTheDocument() // Overall Conversion
  })
})
