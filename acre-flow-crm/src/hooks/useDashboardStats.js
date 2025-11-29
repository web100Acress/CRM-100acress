import { useState, useEffect } from 'react';
import http from '@/api/http';

export function useDashboardStats(userRole, userId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          case 'super-admin':
            
            calculatedStats = {
              totalLeads: leads.length,
              activeUsers: users.filter(u => u.isActive !== false).length,
              openTickets: leads.filter(l => l.status !== 'Closed').length,
              monthlyRevenue: leads.reduce((sum, l) => sum + (l.value || 0), 0)
            };
            break;

          case 'head-admin':
          case 'head':
            // Leads where head is in assignment chain or assigned to
            const managedLeads = leads.filter(lead => 
              lead.assignmentChain?.some(chain => chain.userId === userId) ||
              lead.assignedTo === userId
            );
            
            // Get team members (team-leaders and employees under this head)
            const teamMembers = users.filter(u => 
              u.role === 'team-leader' || u.role === 'employee'
            );
            
            const teams = new Set(teamMembers.map(u => u.team || 'Unassigned')).size;
            
            calculatedStats = {
              managedLeads: managedLeads.length,
              totalTeams: teams,
              pendingApprovals: managedLeads.filter(l => l.status === 'Pending').length,
              overallConversion: leads.length > 0 ? 
                Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) : 0
            };
            break;

          case 'team-leader':
            const teamLeads = leads.filter(lead => 
              lead.assignmentChain?.some(chain => chain.userId === userId)
            );
            const teamSize = users.filter(u => u.reportingTo === userId).length;
            
            calculatedStats = {
              myTeamLeads: teamLeads.length,
              teamSize: teamSize + 1, // +1 for the team leader
              myPendingTasks: teamLeads.filter(l => l.status === 'In Progress').length,
              teamTargetAchieved: teamLeads.reduce((sum, l) => sum + (l.value || 0), 0)
            };
            break;

          case 'employee':
            const assignedLeads = leads.filter(lead => lead.assignedTo === userId);
            
            calculatedStats = {
              assignedLeads: assignedLeads.length,
              todaysFollowups: assignedLeads.filter(l => {
                const today = new Date();
                const followUpDate = new Date(l.nextFollowUp);
                return followUpDate.toDateString() === today.toDateString();
              }).length,
              myOpenTickets: assignedLeads.filter(l => l.status !== 'Closed').length,
              monthlyTargetProgress: assignedLeads.length > 0 ? 
                Math.round((assignedLeads.filter(l => l.status === 'Converted').length / assignedLeads.length) * 100) : 0
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
        
        // Set fallback stats on error
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

    fetchStats();
  }, [userRole, userId]);

  return { stats, loading, error };
}
