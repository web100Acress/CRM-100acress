    import React, { useState, useEffect } from 'react';
import '../../../styles/DeveloperContent.css'
import '../../../styles/sidebar.css'
import '../styles/DeveloperHeader.css'
import '../styles/DeveloperLayout.css'
import { 
  Code, 
  Database, 
  Server, 
  Shield, 
  Activity, 
  Terminal, 
  FileText,
  Globe,
  Key,
  Zap,
  Monitor,
  GitBranch,
  Package,
  Bug,
  Wrench,
  Users,
  UserCheck,
  Crown,
  LogOut,
  Briefcase,
  Clock,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  UserPlus,
  Info,
  Menu,
  X,
  Moon,
  Sun,
  Building2,
  Home,
  PhoneCall,
  Settings,
  Mail,
  MessageCircle,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Button } from '@/layout/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

// Developer-specific imports
import DeveloperHeader from './DeveloperHeader';
import DeveloperChat from './DeveloperChat';
import RoleAssignment from './RoleAssignment';
import ActivityCredentials from './ActivityCredentials';
import DeveloperTools from './DeveloperTools';
import SystemMonitor from './SystemMonitor';
import DatabaseManager from './DatabaseManager';
import ApiTester from './ApiTester';
import LogViewer from './LogViewer';
import PerformanceMetrics from './PerformanceMetrics';
import DeploymentPanel from './DeploymentPanel';
import SecurityAudit from './SecurityAudit';
import BackupManager from './BackupManager';
import CacheManager from './CacheManager';
import QueueMonitor from './QueueMonitor';
import ErrorHandler from './ErrorHandler';

import { useTheme } from '@/context/ThemeContext';

const DeveloperContent = ({ userRole }) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false); // <-- Hamburger state
  const [systemStats, setSystemStats] = useState({
    serverStatus: 'Online',
    dbConnections: '0/0',
    memoryUsage: '0GB / 0GB',
    cpuUsage: '0%',
    apiCalls: '0, today',
    errorRate: '0.02%'
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

      const { toast } = useToast();
      const navigate = useNavigate();

      const handleLogout = () => {
        localStorage.removeItem('isDeveloperLoggedIn');
        localStorage.removeItem('developerEmail');
        localStorage.removeItem('developerName');
        localStorage.removeItem('developerRole');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        navigate('/login');
        window.location.reload();
      };

      const developerName = localStorage.getItem('developerName') || 'Developer';

      const tabs = [
    { id: 'overview', label: 'System Overview', icon: Monitor },
    { id: 'role-assignment', label: 'Role Assignment', icon: Users },
    { id: 'create-employee', label: 'Create Employee', icon: UserPlus },
    { id: 'activity', label: 'Activity Hub', icon: Activity },
    { id: 'chat', label: 'Chat', icon: Info },
    { id: 'tools', label: 'Developer Tools', icon: Wrench },
    { id: 'monitor', label: 'System Monitor', icon: Server },
    { id: 'database', label: 'Database Manager', icon: Database },
    { id: 'api-tester', label: 'API Tester', icon: Globe },
    { id: 'logs', label: 'Log Viewer', icon: FileText },
    { id: 'performance', label: 'Performance Metrics', icon: BarChart3 },
    { id: 'deployment', label: 'Deployment Panel', icon: GitBranch },
    { id: 'security', label: 'Security Audit', icon: Shield },
    { id: 'backup', label: 'Backup Manager', icon: HardDrive },
    { id: 'cache', label: 'Cache Manager', icon: Zap },
    { id: 'queue', label: 'Queue Monitor', icon: RefreshCw },
    { id: 'errors', label: 'Error Handler', icon: AlertTriangle },
  ];

      const handleAction = (action) => {
        toast({
          title: "Developer Action",
          description: `${action} executed successfully`,
        });
      };

      const handleAccessSection = (section, role) => {
        // Set temporary session for the role
        localStorage.setItem('tempUserRole', role);
        localStorage.setItem('tempUserEmail', 'developer@access.com');
        localStorage.setItem('tempUserName', 'Developer Access');
        localStorage.setItem('isLoggedIn', 'true');
        
        navigate(section);
        toast({
          title: "Access Granted",
          description: `Accessing ${section} as ${role}`,
        });
      };

      const handleEmployeeInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      const handleCreateEmployee = async (e) => {
        e.preventDefault();
        try {
          // Ensure all required fields are present
          const employeeData = {
            name: newEmployee.name,
            email: newEmployee.email,
            role: newEmployee.role,
            department: newEmployee.department,
            password: newEmployee.password
          };
          const token = localStorage.getItem('token');
          console.log('Token used for create employee:', token); // Debug log
          const response = await fetch('https://bcrm.100acress.com/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(employeeData),
          });
          const data = await response.json();
          if (response.ok && data.success) {
            toast({
              title: 'Employee Created',
              description: `Employee ${newEmployee.name} created successfully!`,
            });
            setNewEmployee({ name: '', email: '', role: '', department: '', password: '' });
          } else {
            toast({
              title: 'Creation Failed',
              description: data.message || 'Failed to create employee.',
              variant: 'destructive',
            });
          }
        } catch (err) {
          toast({
            title: 'Network Error',
            description: 'Could not connect to the server to create employee.',
            variant: 'destructive',
          });
        }
      };

      

      const renderAccessControl = () => (
        <div className="content-section">
          <div className="cards-grid">
            <div className="access-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Crown className="card-icon purple" />
                  Super Admin Access
                </h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Full system access with all administrative privileges
                </p>
                <div className="button-list">
                  <button
                    onClick={() => handleAccessSection('/', 'super-admin')}
                    className="access-button"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleAccessSection('/users', 'super-admin')}
                    className="access-button"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => handleAccessSection('/settings', 'super-admin')}
                    className="access-button"
                  >
                    System Settings
                  </button>
                  <button
                    onClick={() => handleAccessSection('/create-admin', 'super-admin')}
                    className="access-button"
                  >
                    Create Admin
                  </button>
                </div>
              </div>
            </div>

            <div className="access-card">
              <div className="card-header">
                <h3 className="card-title">
                  <UserCheck className="card-icon blue" />
                  Head Admin Access
                </h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Administrative access with team management capabilities
                </p>
                <div className="button-list">
                  <button
                    onClick={() => handleAccessSection('/', 'head-admin')}
                    className="access-button"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleAccessSection('/create-leader', 'head-admin')}
                    className="access-button"
                  >
                    Create Team Leader
                  </button>
                  <button
                    onClick={() => handleAccessSection('/team', 'head-admin')}
                    className="access-button"
                  >
                    Team Management
                  </button>
                </div>
              </div>
            </div>

            <div className="access-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Briefcase className="card-icon green" />
                  Team Leader Access
                </h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Team leadership with employee management capabilities
                </p>
                <div className="button-list">
                  <button
                    onClick={() => handleAccessSection('/', 'team-leader')}
                    className="access-button"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleAccessSection('/create-employee', 'team-leader')}
                    className="access-button"
                  >
                    Create Employee
                  </button>
                  <button
                    onClick={() => handleAccessSection('/employees', 'team-leader')}
                    className="access-button"
                  >
                    My Employees
                  </button>
                </div>
              </div>
            </div>

            <div className="access-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Users className="card-icon orange" />
                  Employee Access
                </h3>
              </div>
              <div className="card-content">
                <p className="card-description">
                  Standard employee access with basic functionality
                </p>
                <div className="button-list">
                  <button
                    onClick={() => handleAccessSection('/', 'employee')}
                    className="access-button"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleAccessSection('/leads', 'employee')}
                    className="access-button"
                  >
                    Leads Management
                  </button>
                  <button
                    onClick={() => handleAccessSection('/tickets', 'employee')}
                    className="access-button"
                  >
                    Support Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-switch-card">
            <div className="card-header">
              <h3 className="card-title">Quick Role Switch</h3>
            </div>
            <div className="card-content">
              <div className="quick-buttons">
                <button
                  onClick={() => handleAccessSection('/', 'super-admin')}
                  className="quick-button"
                >
                  <Crown className="quick-icon purple" />
                  <span>Super Admin</span>
                </button>
                <button
                  onClick={() => handleAccessSection('/', 'head-admin')}
                  className="quick-button"
                >
                  <UserCheck className="quick-icon blue" />
                  <span>Head Admin</span>
                </button>
                <button
                  onClick={() => handleAccessSection('/', 'team-leader')}
                  className="quick-button"
                >
                  <Briefcase className="quick-icon green" />
                  <span>Team Leader</span>
                </button>
                <button
                  onClick={() => handleAccessSection('/', 'employee')}
                  className="quick-button"
                >
                  <Users className="quick-icon orange" />
                  <span>Employee</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );

      const renderOverview = () => (
        <div className="overview-container">
          {/* Header with avatar and name */}
          <div className="overview-header">
            <div className="overview-avatar">
              <div className="avatar-initial">
                {developerName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="overview-welcome">
              <h2 className="overview-greeting">
                Welcome, <span className="developer-name">{developerName}</span>!
              </h2>
              <p className="overview-subtext">Here is your system overview and quick actions.</p>
            </div>
          </div>
      
          {/* Stats Grid */}
          <div className="overview-stats">
            <div className="stat-box">
              <div className="stat-title"><Server className="icon" /> Server Status</div>
              <div className="stat-value green">{systemStats.serverStatus}</div>
              <p className="stat-description">Last checked: 0 mins ago</p>
            </div>
      
            <div className="stat-box">
              <div className="stat-title"><Database className="icon" /> DB Connections</div>
              <div className="stat-value">{systemStats.dbConnections}</div>
              <p className="stat-description">Active connections</p>
            </div>
      
            <div className="stat-box">
              <div className="stat-title"><Activity className="icon" /> Memory Usage</div>
              <div className="stat-value">{systemStats.memoryUsage}</div>
              <p className="stat-description">System memory</p>
            </div>
      
            <div className="stat-box">
              <div className="stat-title"><Zap className="icon" /> CPU Usage</div>
              <div className="stat-value">{systemStats.cpuUsage}</div>
              <p className="stat-description">Current load</p>
            </div>
      
            <div className="stat-box">
              <div className="stat-title"><Globe className="icon" /> API Calls</div>
              <div className="stat-value">{systemStats.apiCalls}</div>
              <p className="stat-description">Request count</p>
            </div>
      
            
          
          </div>
      
          {/* Quick Actions and Activities */}
          <div className="overview-actions">
            {/* <div className="action-card">
              <h3 className="card-title">Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => handleAction('Cache Clear')} className="btn primary">
                  <Zap className="btn-icon" /> Clear System Cache
                </button>
                <button onClick={() => handleAction('DB Optimize')} className="btn">
                  <Database className="btn-icon" /> Optimize Database
                </button>
                <button onClick={() => handleAction('Backup Create')} className="btn">
                  <Package className="btn-icon" /> Create System Backup
                </button>
              </div>
            </div> */}
      
            <div className="activity-card">
              <h3 className="card-title">Recent Activities</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span>Database backup completed</span>
                  <span className="time">0 hours ago</span>
                </div>
                <div className="activity-item">
                  <span>Security scan passed</span>
                  <span className="time">0 hours ago</span>
                </div>
                <div className="activity-item">
                  <span>System update deployed</span>
                  <span className="time">0 day ago</span>
                </div>
                <div className="activity-item">
                  <span>Performance optimization</span>
                  <span className="time">0 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      

       
      const renderCreateEmployee = () => (
        <div className="create-employee-section">
          <div className="create-employee-card">
            <div className="card-header">
              <h3 className="card-title">
                <UserPlus className="card-icon" />
                Create New Employee
              </h3>
              <p className="card-subtitle">Fill in the details to create a new employee account</p>
            </div>
            
            <form onSubmit={handleCreateEmployee} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleEmployeeInputChange}
                    placeholder="write your name"
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleEmployeeInputChange}
                    placeholder="email@gmail.com"
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={newEmployee.role}
                    onChange={handleEmployeeInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="team-leader">Team Leader</option>
                    <option value="head-admin">Admin</option>
                    <option value="super-admin">BOSS</option>
                    <option value="developer">Developer</option>
                    <option value="hr_finance">HR/Finance</option>
                    <option value="it_infrastructure">IT Infrastructure</option>
                  </select>
                </div>  

                  {/* Department */}
                  <div className="form-group">
                  <label htmlFor="employeeDepartment" className="form-label">
                    Department
                  </label>
                  <select
                    id="employeeDepartment"
                    name="department"
                    value={newEmployee.department}
                    onChange={handleEmployeeInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">-- Select Department --</option>
                    <option value="hr">HR</option>
                    <option value="engineering">Engineering</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                    <option value="it">IT</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newEmployee.password}
                    onChange={handleEmployeeInputChange}
                    placeholder="Create a password"
                    className="form-input"
                    required
                  />
                </div>
                  
                <div className="form-actions">
      <button type="submit" className="create-button">
        <UserPlus className="button-icon" />
        Create Employee
      </button>
    </div>


                {/* <button type="button" onClick={() => setNewEmployee({ name: '', email: '', role: '', password: '', password: '' })} className="create-button">
                  Clear Form
                </button> */}
              {/* </div> */}
              </div>
          

            </form>
          </div>
          
          <div className="employee-notes">
            <div className="note-card">
              <h4 className="note-title">
                <Info className="note-icon" />
                Employee Creation Guidelines
              </h4>
              <ul className="note-list">
                <li>Ensure email is unique and valid</li>
                <li>Passwords must be at least 8 characters</li>
                <li>Team Leaders can manage employees</li>
                <li>Admins have system access</li>
              </ul>
            </div>
          </div>
        </div>
      );

      const [search, setSearch] = useState("");
      const [data, setData] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [loading, setLoading] = useState(false);
      const pageSize = 100;
      const [downloadProgress, setDownloadProgress] = useState(0);
      const token = localStorage.getItem("token");
      console.log("[ProjectEnquiries] Token:", token);

      const fetchData = async () => {
        setLoading(true);
        if (!token) {
          console.log("[ProjectEnquiries] No token found");
          return;
        }
        try {
          const response = await fetch("https://api.100acress.com/userViewAll?limit=2000", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });
          const json = await response.json();
          console.log("[ProjectEnquiries] API response:", json);
          setData(json.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      };

      useEffect(() => {
        fetchData();
        // eslint-disable-next-line
      }, []);

      const downloadExelFile = async () => {
        try {
          const response = await fetch("https://api.100acress.com/userViewAll/dowloadData", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
          const contentLength = response.headers.get('Content-Length');
          const contentDisposition = response.headers.get('Content-Disposition');
          if (!contentLength) {
            console.error('Content-Length header is missing. Progress cannot be tracked.');
            return;
          }
          const total = parseInt(contentLength, 10);
          const reader = response.body.getReader();
          const chunks = [];
          let receivedLength = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            const progress = Math.round((receivedLength / total) * 100);
            setDownloadProgress(progress);
          }
          const blob = new Blob(chunks, { type: response.headers.get('Content-Type') });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
            : 'download.xlsx';
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setDownloadProgress(0);
        } catch (error) {
          console.error('Error downloading the file:', error);
          setDownloadProgress(0);
        }
      };

      const renderProjectEnquiries = () => {
        const filteredData = data.filter(
          (item) =>
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.mobile?.includes(search) ||
            item.projectName?.toLowerCase().includes(search.toLowerCase())
        );
        console.log("[ProjectEnquiries] Filtered data:", filteredData);

        const currentData = filteredData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

        const totalPages = Math.ceil(filteredData.length / pageSize);

        const loadMore = () => {
          if (currentPage * pageSize < filteredData.length) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        };

        const loadBack = () => {
          if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          }
        };

        const handleClick = (pageNumber) => {
          setCurrentPage(pageNumber);
        };

        return (
          <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #e5e7eb", outline: "none", minWidth: 180 }}
                />
                <button
                  style={{ background: "#e11d48", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => {}}
                >
                  Search
                </button>
              </div>
              {downloadProgress > 0 ? (
                <button className="bg-red-400 p-2 rounded-lg text-white ml-4">
                  {/* You can use a spinner here if you want */}
                  {downloadProgress}%
                </button>
              ) : (
                <button
                  className="bg-blue-700 p-2 rounded-lg text-white ml-4"
                  onClick={downloadExelFile}
                >
                  Download Data
                </button>
              )}
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead>
                  <tr>
                    {[
                      "Sr.No",
                      "Name",
                      "Mobile",
                      "Project Name",
                      "Status",
                      "Assign",
                      "Date",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {currentData.length !== 0 ? (
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {index + 1 + (currentPage - 1) * pageSize}
                        </td>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {item.name}
                        </td>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {item.mobile}
                        </td>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {item.projectName}
                        </td>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {item.status ? "Complete" : "Not Complete"}
                        </td>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {item.assign}
                        </td>
                        <td className="px-6 py-2 text-center text-sm text-gray-800">
                          {new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No data available.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
              {loading && <p>Loading...</p>}
              <div className="flex  my-4">
                <button
                  className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-700 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={loadBack}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handleClick(index + 1)}
                    disabled={currentPage === index + 1}
                    className={`px-4 py-2 mx-1 rounded ${
                      currentPage === index + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-700 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={loadMore}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      };

      const [usersData, setUsersData] = useState([]);
      const [usersLoading, setUsersLoading] = useState(false);
      const [usersSearch, setUsersSearch] = useState("");
      const [usersCurrentPage, setUsersCurrentPage] = useState(1);
      const usersPageSize = 10;

      const fetchUsersData = async () => {
        setUsersLoading(true);
        try {
          // Replace with your real API endpoint for users
          const response = await fetch("https://100acress.com/api/users");
          const json = await response.json();
          setUsersData(json.data || json.users || []);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsersData([]);
        }
        setUsersLoading(false);
      };

      // Optionally, fetch on mount or when tab is active
      // useEffect(() => { fetchUsersData(); }, []);

      const renderRegisteredUsers = () => {
        const filteredUsers = usersData.filter(
          (user) =>
            user.name?.toLowerCase().includes(usersSearch.toLowerCase()) ||
            user.email?.toLowerCase().includes(usersSearch.toLowerCase()) ||
            user.mobile?.includes(usersSearch)
        );

        const totalUsersPages = Math.ceil(filteredUsers.length / usersPageSize);
        const usersCurrentData = filteredUsers.slice(
          (usersCurrentPage - 1) * usersPageSize,
          usersCurrentPage * usersPageSize
        );

        const handleUsersPageClick = (pageNumber) => {
          setUsersCurrentPage(pageNumber);
        };

        const handleUsersPrev = () => {
          if (usersCurrentPage > 1) setUsersCurrentPage(usersCurrentPage - 1);
        };

        const handleUsersNext = () => {
          if (usersCurrentPage < totalUsersPages) setUsersCurrentPage(usersCurrentPage + 1);
        };

        const downloadUsersCSV = () => {
          const headers = ["S NO.", "NAME", "EMAIL", "MOBILE NUMBER", "DATE"];
          const rows = usersCurrentData.map((user, idx) => [
            idx + 1 + (usersCurrentPage - 1) * usersPageSize,
            user.name,
            user.email,
            user.mobile,
            user.date ? new Date(user.date).toLocaleDateString("en-GB") : ""
          ]);
          let csvContent = headers.join(",") + "\n" + rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "registered_users.csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        };

        return (
          <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
            <h2 style={{ textAlign: "center", color: "#e11d48", marginBottom: 16 }}>Registered User's</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, gap: 8 }}>
              <input
                type="text"
                placeholder="Search..."
                value={usersSearch}
                onChange={e => setUsersSearch(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #e5e7eb", outline: "none", minWidth: 180, marginRight: 8 }}
              />
              <button
                style={{ background: "#e11d48", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}
                onClick={fetchUsersData}
              >
                Search
              </button>
              <button
                style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}
                onClick={downloadUsersCSV}
              >
                Download CSV
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th>S NO.</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>MOBILE NUMBER</th>
                    <th>DATE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {usersCurrentData.length > 0 ? (
                    usersCurrentData.map((user, idx) => (
                      <tr key={user.id || idx}>
                        <td>{idx + 1 + (usersCurrentPage - 1) * usersPageSize}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.date ? new Date(user.date).toLocaleDateString("en-GB") : ""}</td>
                        <td>
                          <button
                            style={{
                              background: "#e11d48",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 16px",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                            onClick={() => {/* handle view property */}}
                          >
                            View Property
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {usersLoading && <p>Loading...</p>}
              {/* Pagination Controls */}
              <div className="flex my-4" style={{ justifyContent: "center", gap: 4 }}>
                <button
                  className={`px-4 py-2 mx-1 rounded ${usersCurrentPage === 1 ? "bg-gray-200 text-gray-700 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={handleUsersPrev}
                  disabled={usersCurrentPage === 1 || usersLoading}
                >
                  Previous
                </button>
                {Array.from({ length: totalUsersPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handleUsersPageClick(index + 1)}
                    disabled={usersCurrentPage === index + 1}
                    className={`px-4 py-2 mx-1 rounded ${
                      usersCurrentPage === index + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`px-4 py-2 mx-1 rounded ${usersCurrentPage === totalUsersPages ? "bg-gray-200 text-gray-700 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={handleUsersNext}
                  disabled={usersCurrentPage === totalUsersPages || usersLoading}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      };

      const renderBlogManagement = () => (
        <div className="blog-management-section">
          <div className="section-header">
            <h3 className="section-title">Blog Management</h3>
            <p className="section-desc">Manage blog content, analytics, and publishing</p>
          </div>
          
          <div className="blog-actions-grid">
            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <BarChart3 className="action-icon" />
                  <h4>Blog Dashboard</h4>
                </div>
                <p>View analytics, performance metrics, and blog statistics</p>
                <Button 
                  onClick={() => navigate('/blog-dashboard')}
                  className="action-btn"
                >
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <FileText className="action-icon" />
                  <h4>Blog Management</h4>
                </div>
                <p>Create, edit, and manage all blog posts</p>
                <Button 
                  onClick={() => navigate('/blog-management')}
                  className="action-btn"
                >
                  Manage Blogs
                </Button>
              </CardContent>
            </Card>

            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <Clock className="action-icon" />
                  <h4>Draft Management</h4>
                </div>
                <p>Manage draft posts and unpublished content</p>
                <Button 
                  onClick={() => navigate('/draft-management')}
                  className="action-btn"
                >
                  Manage Drafts
                </Button>
              </CardContent>
            </Card>

            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <Globe className="action-icon" />
                  <h4>Blog Section</h4>
                </div>
                <p>View public blog section and published posts</p>
                <Button 
                  onClick={() => navigate('/blog-section')}
                  className="action-btn"
                >
                  View Blog Section
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );

      const renderAdminAccess = () => (
        <div className="admin-access-section">
          <div className="section-header">
            <h3 className="section-title">Admin Access Control</h3>
            <p className="section-desc">Manage administrative access and permissions</p>
          </div>
          
          <div className="admin-actions-grid">
            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <Crown className="action-icon" />
                  <h4>Super Admin Access</h4>
                </div>
                <p>Full system access with all administrative privileges</p>
                <Button 
                  onClick={() => {
                    localStorage.setItem('userRole', 'super-admin');
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.reload();
                  }}
                  className="action-btn admin-btn"
                >
                  Switch to Super Admin
                </Button>
              </CardContent>
            </Card>

            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <UserCheck className="action-icon" />
                  <h4>Head Admin Access</h4>
                </div>
                <p>Team management and administrative oversight</p>
                <Button 
                  onClick={() => {
                    localStorage.setItem('userRole', 'head-admin');
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.reload();
                  }}
                  className="action-btn admin-btn"
                >
                  Switch to Head Admin
                </Button>
              </CardContent>
            </Card>

            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <Users className="action-icon" />
                  <h4>Team Leader Access</h4>
                </div>
                <p>Employee management and team coordination</p>
                <Button 
                  onClick={() => {
                    localStorage.setItem('userRole', 'team-leader');
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.reload();
                  }}
                  className="action-btn admin-btn"
                >
                  Switch to Team Leader
                </Button>
              </CardContent>
            </Card>

            <Card className="action-card">
              <CardContent>
                <div className="action-header">
                  <Briefcase className="action-icon" />
                  <h4>Employee Access</h4>
                </div>
                <p>Standard employee access with limited permissions</p>
                <Button 
                  onClick={() => {
                    localStorage.setItem('userRole', 'employee');
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.reload();
                  }}
                  className="action-btn admin-btn"
                >
                  Switch to Employee
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );

      const renderContent = () => {
        switch (activeTab) {
          case 'overview':
            return renderOverview();
          case 'role-assignment':
            return <RoleAssignment />;
          case 'create-employee':
            return renderCreateEmployee();
          case 'activity':
            return <ActivityCredentials />;
          case 'chat':
            return <DeveloperChat developerName={developerName} />;
          case 'tools':
            return <DeveloperTools />;
          case 'monitor':
            return <SystemMonitor />;
          case 'database':
            return <DatabaseManager />;
          case 'api-tester':
            return <ApiTester />;
          case 'logs':
            return <LogViewer />;
          case 'performance':
            return <PerformanceMetrics />;
          case 'deployment':
            return <DeploymentPanel />;
          case 'security':
            return <SecurityAudit />;
          case 'backup':
            return <BackupManager />;
          case 'cache':
            return <CacheManager />;
          case 'queue':
            return <QueueMonitor />;
          case 'errors':
            return <ErrorHandler />;
          default:
            return (
              <div className="coming-soon">
                <Code className="coming-soon-icon" />
                <h3 className="coming-soon-title">Coming Soon</h3>
                <p className="coming-soon-desc">This developer tool is under development</p>
              </div>
            );
        }
      };
      return (
    <div className={`dashboard-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
      {/* Desktop Sidebar */}
      <div
        className={`crm-sidebar ${isDark ? 'is-dark' : 'is-light'} ${sidebarOpen ? 'is-collapsed' : ''} ${
          false ? 'hidden' : 'flex'
        }`}
      >
        <div className="crm-sidebar-rail">
          <div className="crm-rail-top">
            <div className="crm-rail-logo" title="100acres CRM">
              <Code className="crm-rail-logo-icon" />
            </div>
          </div>

          <div className="crm-rail-nav">
            {tabs.map((tab, idx) => (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`crm-rail-link ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <tab.icon className="crm-rail-icon" />
                </button>
                {idx < tabs.length - 1 && <div className="crm-rail-divider" />}
              </React.Fragment>
            ))}
          </div>

          <div className="crm-rail-bottom">
            <button
              type="button"
              onClick={toggleTheme}
              className="crm-rail-action"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="crm-rail-icon" /> : <Moon className="crm-rail-icon" />}
            </button>
            <button type="button" onClick={handleLogout} className="crm-rail-action" title="Logout">
              <LogOut className="crm-rail-icon" />
            </button>
          </div>
        </div>

        {!sidebarOpen && (
          <div className="crm-sidebar-panel">
            <div className="crm-panel-header">
              <div className="crm-panel-brand">
                <div className="crm-panel-brand-icon">
                  <Code className="crm-panel-brand-icon-svg" />
                </div>
                <div className="crm-panel-brand-text">
                  <div className="crm-panel-brand-title">Developer Console</div>
                  <div className="crm-panel-brand-sub">System Management</div>
                </div>
              </div>
            </div>

            <div className="crm-panel-nav">
              <div className="crm-panel-group">
                <div className="crm-panel-heading">Developer Tools</div>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`crm-panel-link ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span className="crm-panel-link-icon"><tab.icon className="crm-panel-icon" /></span>
                    <span className="crm-panel-link-label">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="crm-panel-footer">
              <div className="crm-panel-user">
                <div className="crm-panel-user-avatar"><Shield className="crm-panel-user-icon" /></div>
                <div className="crm-panel-user-meta">
                  <div className="crm-panel-user-name">{developerName}</div>
                  <div className="crm-panel-user-role">Developer</div>
                </div>
              </div>

              <div className="crm-panel-footer-actions">
                <button type="button" onClick={toggleTheme} className="crm-panel-toggle">
                  <span className="crm-panel-toggle-label">Dark Mode</span>
                  <span className={`crm-panel-toggle-pill ${isDark ? 'on' : 'off'}`}>
                    <span className="crm-panel-toggle-dot" />
                  </span>
                </button>

                <button type="button" className="crm-panel-logout" onClick={handleLogout}>
                  <LogOut className="crm-panel-logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {false && (
        <>
          <div className={`crm-mobile-sidebar ${isDark ? 'is-dark' : 'is-light'}`}>
            <div className="crm-mobile-header">
              <div className="crm-mobile-brand">
                <div className="crm-panel-brand-icon">
                  <Code className="crm-panel-brand-icon-svg" />
                </div>
                <div className="crm-panel-brand-text">
                  <div className="crm-panel-brand-title">Developer Console</div>
                  <div className="crm-panel-brand-sub">System Management</div>
                </div>
              </div>
              <button className="crm-mobile-close"><X /></button>
            </div>

            <div className="crm-mobile-nav">
              <div className="crm-panel-group">
                <div className="crm-panel-heading">Developer Tools</div>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`crm-panel-link ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span className="crm-panel-link-icon"><tab.icon className="crm-panel-icon" /></span>
                    <span className="crm-panel-link-label">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="crm-panel-footer">
              <div className="crm-panel-user">
                <div className="crm-panel-user-avatar"><Shield className="crm-panel-user-icon" /></div>
                <div className="crm-panel-user-meta">
                  <div className="crm-panel-user-name">{developerName}</div>
                  <div className="crm-panel-user-role">Developer</div>
                </div>
              </div>

              <div className="crm-panel-footer-actions">
                <button type="button" onClick={toggleTheme} className="crm-panel-toggle">
                  <span className="crm-panel-toggle-label">Dark Mode</span>
                  <span className={`crm-panel-toggle-pill ${isDark ? 'on' : 'off'}`}>
                    <span className="crm-panel-toggle-dot" />
                  </span>
                </button>

                <button type="button" className="crm-panel-logout" onClick={handleLogout}>
                  <LogOut className="crm-panel-logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <div className="crm-sidebar-backdrop"></div>
        </>
      )}

      {/* Main Content Area */}
      <div className="main-content">
        <DeveloperHeader 
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          developerName={developerName}
        />

        <main className="developer-main">
          <Card className="content-card">
            <CardHeader>
              <CardTitle className="content-title">
                {(() => {
                  const activeTabData = tabs.find(t => t.id === activeTab);
                  const IconComponent = activeTabData?.icon;
                  return IconComponent ? <IconComponent className="title-icon" /> : null;
                })()}
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DeveloperContent;
