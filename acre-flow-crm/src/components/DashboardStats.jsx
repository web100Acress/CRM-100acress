import React from 'react';
import {
  Users,
  Building2,
  Ticket,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';

const DashboardStats = ({ userRole }) => {
  const baseStats = {
    'super-admin': [
      { label: 'Total Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Active Users', value: '0', change: '+0%', icon: Users, color: 'green' },
      { label: 'Open Tickets', value: '0', change: '-0%', icon: Ticket, color: 'orange' },
      { label: 'Monthly Revenue', value: '₹0L', change: '+0%', icon: DollarSign, color: 'purple' },
    ],
    'head-admin': [
      { label: 'Team Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Team Members', value: '0', change: '+0%', icon: Users, color: 'green' },
      { label: 'Assigned Tickets', value: '0', change: '-0%', icon: Ticket, color: 'orange' },
      { label: 'Conversion Rate', value: '0%', change: '+0%', icon: TrendingUp, color: 'purple' },
    ],
    'team-leader': [
      { label: 'My Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Team Size', value: '6', change: '0%', icon: Users, color: 'green' },
      { label: 'Pending Tasks', value: '0', change: '-0%', icon: Ticket, color: 'orange' },
      { label: 'This Month', value: '₹0L', change: '+0%', icon: DollarSign, color: 'purple' },
    ],
    'employee': [
      { label: 'Assigned Leads', value: '0', change: '+0%', icon: Building2, color: 'blue' },
      { label: 'Follow-ups', value: '0', change: '+0%', icon: Calendar, color: 'green' },
      { label: 'My Tickets', value: '0', change: '-0', icon: Ticket, color: 'orange' },
      { label: 'Target Progress', value: '0%', change: '+0%', icon: TrendingUp, color: 'purple' },
    ],
  };

  const getColorClass = (color) => `icon-box ${color}`;

  const stats = baseStats[userRole] || baseStats['employee'];

  return (
    <>
      <div className="dashboard-stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const changeClass = stat.change.startsWith('+')
            ? 'change-up'
            : stat.change.startsWith('-')
            ? 'change-down'
            : 'change-neutral';

          return (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="label">{stat.label}</p>
                  <p className="value">{stat.value}</p>
                  <p className={`change ${changeClass}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={getColorClass(stat.color)}>
                  <Icon className="icon" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .dashboard-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .stat-card {
          flex: 1;
          min-width: 240px;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stat-info .label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        .stat-info .value {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
          margin-top: 4px;
        }
        .stat-info .change {
          font-size: 14px;
          margin-top: 6px;
        }
        .change-up {
          color: #16a34a;
        }
        .change-down {
          color: #dc2626;
        }
        .change-neutral {
          color: #6b7280;
        }
        .icon-box {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid;
        }
        .icon-box.blue {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }
        .icon-box.green {
          background: #ecfdf5;
          color: #059669;
          border-color: #bbf7d0;
        }
        .icon-box.orange {
          background: #fff7ed;
          color: #ea580c;
          border-color: #fed7aa;
        }
        .icon-box.purple {
          background: #f5f3ff;
          color: #7c3aed;
          border-color: #ddd6fe;
        }
        .icon {
          height: 24px;
          width: 24px;
        }
      `}</style>
    </>
  );
};

export default DashboardStats;
