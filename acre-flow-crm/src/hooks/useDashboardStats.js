import { useState, useEffect } from 'react';
import http from '@/api/http';

export function useDashboardStats(userRole, userId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!userRole || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch leads for the user
      const leadsResponse = await http.get('/api/leads');
      const leads = leadsResponse.data || [];

      // Fetch all users for team stats
      const usersResponse = await http.get('/api/users');
      const users = usersResponse.data || [];

      // Calculate stats based on role
      let calculatedStats = {};

      switch (userRole) {
        case 'boss':
        case 'super-admin':
          calculatedStats = {
            totalLeads: leads.length,
            activeUsers: users.filter(u => u.isActive !== false).length,
            openTickets: leads.filter(l => l.workProgress !== 'done').length,
            monthlyRevenue: leads.reduce((sum, l) => sum + (l.value || 0), 0)
          };
          break;

        case 'head-admin':
        case 'head':
        case 'hod':
          calculatedStats = {
            managedLeads: leads.length,
            totalTeams: new Set(users.filter(u => u.role === 'team-leader' || u.role === 'bd').map(u => u.team || 'Unassigned')).size,
            pendingApprovals: leads.filter(l => l.workProgress === 'pending').length,
            overallConversion: leads.length > 0 ?
              Math.round((leads.filter(l => l.workProgress === 'done').length / leads.length) * 100) : 0
          };
          break;

        case 'team-leader':
          calculatedStats = {
            myTeamLeads: leads.length,
            teamSize: users.filter(u => u.reportingTo === userId).length + 1,
            myPendingTasks: leads.filter(l => l.workProgress === 'inprogress').length,
            teamTargetAchieved: leads.reduce((sum, l) => sum + (l.value || 0), 0)
          };
          break;

        case 'bd':
        case 'employee':
          calculatedStats = {
            assignedLeads: leads.length,
            todaysFollowups: leads.filter(l => {
              const today = new Date();
              const followUpDate = new Date(l.nextFollowUp);
              return followUpDate.toDateString() === today.toDateString();
            }).length,
            myOpenTickets: leads.filter(l => l.workProgress !== 'done').length,
            monthlyTargetProgress: leads.length > 0 ?
              Math.round((leads.filter(l => l.workProgress === 'done').length / leads.length) * 100) : 0
          };
          break;

        default:
          calculatedStats = {
            totalLeads: 0,
            activeUsers: 0,
            openTickets: 0,
            monthlyRevenue: 0
          };
      }

      setStats(calculatedStats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard stats');
      setStats({
        totalLeads: 0,
        activeUsers: 0,
        openTickets: 0,
        monthlyRevenue: 0,
        managedLeads: 0,
        totalTeams: 0,
        pendingApprovals: 0,
        overallConversion: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Listen for dashboard refresh events
    const handleRefresh = () => {
      fetchStats();
    };

    window.addEventListener('dashboard-refresh', handleRefresh);

    return () => {
      window.removeEventListener('dashboard-refresh', handleRefresh);
    };
  }, [userRole, userId]);

  return { stats, loading, error };
}
