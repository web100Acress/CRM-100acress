
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/HrFinance.css'
import { 
  Users, 
  DollarSign, 
  UserPlus, 
  FileText, 
  Calendar, 
  TrendingUp,
  Building,
  LogOut,
  UserCheck,
  CreditCard,
  PieChart,
  Clock,
  Award,
  AlertCircle,
  Settings
} from 'lucide-react';
import EmployeeManagement from '../components/hr/EmployeeManagement';
import Recruitment from '../components/hr/Recruitment';
import SalaryManagement from '../components/hr/SalaryManagement';
import Attendance from '../components/hr/Attendance';
import PerformanceReview from '../components/hr/PerformanceReview';
import ExpenseManagement from '../components/hr/ExpenseManagement';
import Reports from '../components/hr/Reports';
import HrSettings from '../components/hr/HrSettings';

const HrFinance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isHrFinanceLoggedIn");
    localStorage.removeItem("hrFinanceEmail");
    localStorage.removeItem("hrFinanceName");
    localStorage.removeItem("hrFinanceRole");
    navigate("/login");
    window.location.reload();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
    { id: 'salary', label: 'Salary Management', icon: DollarSign },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'performance', label: 'Performance Review', icon: Award },
    { id: 'expenses', label: 'Expense Management', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'employees':
        return <EmployeeManagement />;
      case 'recruitment':
        return <Recruitment />;
      case 'salary':
        return <SalaryManagement />;
      case 'attendance':
        return <Attendance />;
      case 'performance':
        return <PerformanceReview />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <HrSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="hr-finance-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <Building className="company-icon" />
          <h2>100acres.com</h2>
          <p>HR & Finance Portal</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>{menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}</h1>
          <div className="user-info">
            <span>Welcome, HR/Finance Team</span>
          </div>
        </div>

        <div className="content-body">
          {renderContent()}
        </div>
      </div>

      <style>{`
        .hr-finance-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .company-icon {
          color: #ef4444;
          margin-bottom: 1rem;
        }

        .sidebar-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ef4444;
        }

        .sidebar-header p {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
          background: #ef4444;
          border-right: 4px solid #dc2626;
        }

        .nav-icon {
          margin-right: 0.75rem;
          opacity: 0.8;
        }

        .nav-item.active .nav-icon {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(239,68,68,0.2);
          border: 1px solid #ef4444;
          color: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #ef4444;
        }

        .logout-btn svg {
          margin-right: 0.5rem;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .content-header {
          background: white;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .content-header h1 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .user-info {
          color: #64748b;
          font-size: 0.9rem;
        }

        .content-body {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .hr-finance-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }
          
          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 1rem 0;
          }
          
          .nav-item {
            min-width: 120px;
            flex-direction: column;
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          
          .nav-icon {
            margin-right: 0;
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const stats = [
    { title: 'Total Employees', value: '125', icon: Users, color: '#3b82f6', trend: '+5%' },
    { title: 'Active Recruitments', value: '8', icon: UserPlus, color: '#10b981', trend: '+2' },
    { title: 'Monthly Payroll', value: '₹45,67,890', icon: DollarSign, color: '#f59e0b', trend: '+8%' },
    { title: 'Pending Approvals', value: '12', icon: AlertCircle, color: '#ef4444', trend: '-3' }
  ];

  const recentActivities = [
    { type: 'hire', message: 'New employee Rajesh Kumar joined as Sales Executive', time: '2 hours ago' },
    { type: 'salary', message: 'Monthly salary processed for 125 employees', time: '1 day ago' },
    { type: 'review', message: 'Performance reviews completed for Marketing team', time: '2 days ago' },
    { type: 'expense', message: 'Travel expense approved for Amit Sharma', time: '3 days ago' }
  ];

  return (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{backgroundColor: stat.color + '20', color: stat.color}}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className="stat-trend" style={{color: stat.trend.includes('+') ? '#10b981' : '#ef4444'}}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="dashboard-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn">
            <UserPlus size={20} />
            <span>Add New Employee</span>
          </button>
          <button className="action-btn">
            <DollarSign size={20} />
            <span>Process Payroll</span>
          </button>
          <button className="action-btn">
            <FileText size={20} />
            <span>Generate Report</span>
          </button>
          <button className="action-btn">
            <Calendar size={20} />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default HrFinance;