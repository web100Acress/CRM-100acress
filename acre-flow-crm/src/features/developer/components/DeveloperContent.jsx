    import React, { useState } from 'react';
    import '../../../styles/DeveloperContent.css'
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
      X
    } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
    import { Button } from '@/layout/button';
    import { useToast } from '@/hooks/use-toast';
    import { useNavigate } from 'react-router-dom';
    import DeveloperChat from './DeveloperChat'; // Import the chat component (to be created)

    const DeveloperContent = ({ userRole }) => {
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
        { id: 'access-control', label: 'Access Control', icon: Users },
        // { id: 'database', label: 'Database', icon: Database },
        // { id: 'api', label: 'API Management', icon: Server },
        // { id: 'security', label: 'Security', icon: Shield },
        // { id: 'logs', label: 'System Logs', icon: FileText },
        { id: 'create-employee', label: 'Create Employee', icon: UserPlus },
        // { id: 'performance', label: 'Performance', icon: Activity },
        // { id: 'deployment', label: 'Deployment', icon: GitBranch },
        // { id: 'tools', label: 'Dev Tools', icon: Wrench },
        { id: 'chat', label: 'Chat', icon: Info }, // New Chat tab
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
          const response = await fetch('https://crm.100acress.com/api/users', {
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
      

        // const renderDatabase = () => (
        //   <div className="content-section">
        //     <div className="db-cards">
        //       <div className="db-card">
        //         <div className="card-header">
        //           <h3 className="card-title">Database Management</h3>
        //         </div>
        //         <div className="card-content">
        //           <div className="form-group">
        //             <label className="form-label">Database URL</label>
        //             <input
        //               type="password"
        //               defaultValue="mongodb://localhost:27017/100acres"
        //               className="form-input"
        //               readOnly
        //             />
        //           </div>
        //           <div className="button-group">
        //             <button onClick={() => handleAction('DB Test Connection')} className="db-button primary">
        //               <Database className="button-icon" />
        //               Test Connection
        //             </button>
        //             <button onClick={() => handleAction('DB Migrate')} className="db-button">
        //               <GitBranch className="button-icon" />
        //               Run Migrations
        //             </button>
        //           </div>
        //         </div>
        //       </div>

        //       <div className="db-card">
        //         <div className="card-header">
        //           <h3 className="card-title">Database Statistics</h3>
        //         </div>
        //         <div className="card-content">
        //           <div className="db-stats">
        //             <div className="db-stat">
        //               <span>Total Collections:</span>
        //               <span className="stat-number">12</span>
        //             </div>
        //             <div className="db-stat">
        //               <span>Total Documents:</span>
        //               <span className="stat-number">15,847</span>
        //             </div>
        //             <div className="db-stat">
        //               <span>Database Size:</span>
        //               <span className="stat-number">245 MB</span>
        //             </div>
        //             <div className="db-stat">
        //               <span>Index Size:</span>
        //               <span className="stat-number">12 MB</span>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>

        //     <div className="query-card">
        //       <div className="card-header">
        //         <h3 className="card-title">Database Query Console</h3>
        //       </div>
        //       <div className="card-content">
        //         <textarea
        //           placeholder="Enter your MongoDB query here..."
        //           className="query-textarea"
        //           defaultValue="db.users.find({status: 'active'}).limit(10)"
        //         />
        //         <div className="query-buttons">
        //           <button onClick={() => handleAction('Query Execute')} className="query-button primary">
        //             <Terminal className="button-icon" />
        //             Execute Query
        //           </button>
        //           <button onClick={() => handleAction('Query Explain')} className="query-button">
        //             Explain Query
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // );

      // const renderAPI = () => (
      //   <div className="content-section">
      //     <div className="api-cards">
      //       <div className="api-card">
      //         <div className="card-header">
      //           <h3 className="card-title">API Configuration</h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="form-group">
      //             <label className="form-label">Base URL</label>
      //             <input
      //               type="text"
      //               defaultValue="https://crm.100acress.com/api"
      //               className="form-input"
      //             />
      //           </div>
      //           <div className="form-group">
      //             <label className="form-label">Rate Limit</label>
      //             <select className="form-select">
      //               <option>100 requests/minute</option>
      //               <option>500 requests/minute</option>
      //               <option>1000 requests/minute</option>
      //             </select>
      //           </div>
      //           <button onClick={() => handleAction('API Config Save')} className="api-button primary">
      //             Save Configuration
      //           </button>
      //         </div>
      //       </div>

      //       <div className="api-card">
      //         <div className="card-header">
      //           <h3 className="card-title">API Endpoints</h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="endpoint-list">
      //             <div className="endpoint-item">
      //               <span className="endpoint-path">GET /api/users</span>
      //               <span className="status-badge active">Active</span>
      //             </div>
      //             <div className="endpoint-item">
      //               <span className="endpoint-path">POST /api/leads</span>
      //               <span className="status-badge active">Active</span>
      //             </div>
      //             <div className="endpoint-item">
      //               <span className="endpoint-path">PUT /api/tickets</span>
      //               <span className="status-badge active">Active</span>
      //             </div>
      //             <div className="endpoint-item">
      //               <span className="endpoint-path">DELETE /api/users/:id</span>
      //               <span className="status-badge limited">Limited</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="api-test-card">
      //       <div className="card-header">
      //         <h3 className="card-title">API Testing Console</h3>
      //       </div>
      //       <div className="card-content">
      //         <div className="test-form">
      //           <div className="form-row">
      //             <div className="form-group">
      //               <label className="form-label">Method</label>
      //               <select className="form-select">
      //                 <option>GET</option>
      //                 <option>POST</option>
      //                 <option>PUT</option>
      //                 <option>DELETE</option>
      //               </select>
      //             </div>
      //             <div className="form-group">
      //               <label className="form-label">Endpoint</label>
      //               <input
      //                 type="text"
      //                 placeholder="/api/users"
      //                 className="form-input"
      //               />
      //             </div>
      //           </div>
      //           <div className="form-group">
      //             <label className="form-label">Request Body (JSON)</label>
      //             <textarea
      //               placeholder='{"name": "Test User", "email": "test@example.com"}'
      //               className="form-textarea"
      //             />
      //           </div>
      //           <button onClick={() => handleAction('API Test')} className="test-button primary">
      //             <Globe className="button-icon" />
      //             Send Request
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // );

      // const renderSecurity = () => (
      //   <div className="content-section">
      //     <div className="security-cards">
      //       <div className="security-card">
      //         <div className="card-header">
      //           <h3 className="card-title">Security Settings</h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="security-setting">
      //             <div className="setting-info">
      //               <h4 className="setting-name">JWT Token Expiry</h4>
      //               <p className="setting-desc">Current: 24 hours</p>
      //             </div>
      //             <select className="setting-select">
      //               <option>1 hour</option>
      //               <option>12 hours</option>
      //               <option>24 hours</option>
      //               <option>7 days</option>
      //             </select>
      //           </div>
      //           <div className="security-setting">
      //             <div className="setting-info">
      //               <h4 className="setting-name">Password Policy</h4>
      //               <p className="setting-desc">Minimum requirements</p>
      //             </div>
      //             <select className="setting-select">
      //               <option>Basic (6 chars)</option>
      //               <option>Medium (8 chars + numbers)</option>
      //               <option>Strong (12 chars + special)</option>
      //             </select>
      //           </div>
      //           <button onClick={() => handleAction('Security Update')} className="security-button primary">
      //             Update Security Settings
      //           </button>
      //         </div>
      //       </div>

      //       <div className="security-card">
      //         <div className="card-header">
      //           <h3 className="card-title">API Keys</h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="key-group">
      //             <label className="form-label">Master API Key</label>
      //             <div className="key-input">
      //               <input
      //                 type="password"
      //                 defaultValue="sk_live_abc123def456ghi789"
      //                 className="key-field"
      //                 readOnly
      //               />
      //               <button onClick={() => handleAction('API Key Regenerate')} className="key-button">
      //                 <Key className="key-icon" />
      //               </button>
      //             </div>
      //           </div>
      //           <div className="key-group">
      //             <label className="form-label">Webhook Secret</label>
      //             <div className="key-input">
      //               <input
      //                 type="password"
      //                 defaultValue="whsec_xyz789abc123def456"
      //                 className="key-field"
      //                 readOnly
      //               />
      //               <button onClick={() => handleAction('Webhook Secret Regenerate')} className="key-button">
      //                 <Key className="key-icon" />
      //               </button>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="audit-card">
      //       <div className="card-header">
      //         <h3 className="card-title">Security Audit</h3>
      //       </div>
      //       <div className="card-content">
      //         <div className="audit-buttons">
      //           <button onClick={() => handleAction('Vulnerability Scan')} className="audit-button primary">
      //             <Shield className="button-icon" />
      //             Run Vulnerability Scan
      //           </button>
      //           <button onClick={() => handleAction('Penetration Test')} className="audit-button">
      //             <Bug className="button-icon" />
      //             Penetration Test
      //           </button>
      //           <button onClick={() => handleAction('Security Report')} className="audit-button">
      //             <FileText className="button-icon" />
      //             Generate Report
      //           </button>
      //         </div>
      //         <div className="audit-info">
      //           <h4 className="audit-title">Last Security Scan</h4>
      //           <p className="audit-desc">Completed 2 hours ago - No vulnerabilities found</p>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // );
    // const renderLogs = () => (
    //     <div className="content-section">
    //       <div className="logs-header">
    //         <div className="logs-controls">
    //           <select className="log-filter">
    //             <option>All Logs</option>
    //             <option>Error Logs</option>
    //             <option>Warning Logs</option>
    //             <option>Info Logs</option>
    //             <option>Debug Logs</option>
    //           </select>
    //           <button onClick={() => handleAction('Logs Refresh')} className="log-button">
    //             <RefreshCw className="button-icon" />
    //             Refresh
    //           </button>
    //           <button onClick={() => handleAction('Logs Clear')} className="log-button">
    //             <XCircle className="button-icon" />
    //             Clear
    //           </button>
    //           <button onClick={() => handleAction('Logs Export')} className="log-button">
    //             <Download className="button-icon" />
    //             Export
    //           </button>
    //         </div>
    //       </div>

    //       <div className="logs-container">
    //         <div className="log-entry error">
    //           <span className="log-time">2025-01-07 11:42:07</span>
    //           <span className="log-level error">ERROR</span>
    //           <span className="log-message">Database connection timeout after 30 seconds</span>
    //           <span className="log-source">db.connection.js:45</span>
    //         </div>
    //         <div className="log-entry warning">
    //           <span className="log-time">2025-01-07 11:41:52</span>
    //           <span className="log-level warning">WARN</span>
    //           <span className="log-message">High memory usage detected: 85% of available RAM</span>
    //           <span className="log-source">monitor.js:123</span>
    //         </div>
    //         <div className="log-entry info">
    //           <span className="log-time">2025-01-07 11:41:30</span>
    //           <span className="log-level info">INFO</span>
    //           <span className="log-message">User authentication successful for admin@100acres.com</span>
    //           <span className="log-source">auth.controller.js:67</span>
    //         </div>
    //         <div className="log-entry info">
    //           <span className="log-time">2025-01-07 11:41:15</span>
    //           <span className="log-level info">INFO</span>
    //           <span className="log-message">API request processed: GET /api/leads - 200ms response</span>
    //           <span className="log-source">api.router.js:234</span>
    //         </div>
    //         <div className="log-entry debug">
    //           <span className="log-time">2025-01-07 11:40:58</span>
    //           <span className="log-level debug">DEBUG</span>
    //           <span className="log-message">Cache hit for user session: session_abc123def456</span>
    //           <span className="log-source">cache.service.js:89</span>
    //         </div>
    //       </div>

    //       <div className="logs-stats">
    //         <div className="stat-item">
    //           <XCircle className="stat-icon error" />
    //           <div className="stat-info">
    //             <span className="stat-value">12</span>
    //             <span className="stat-label">Errors (24h)</span>
    //           </div>
    //         </div>
    //         <div className="stat-item">
    //           <AlertTriangle className="stat-icon warning" />
    //           <div className="stat-info">
    //             <span className="stat-value">28</span>
    //             <span className="stat-label">Warnings (24h)</span>
    //           </div>
    //         </div>
    //         <div className="stat-item">
    //           <CheckCircle className="stat-icon success" />
    //           <div className="stat-info">
    //             <span className="stat-value">1,247</span>
    //             <span className="stat-label">Info Messages (24h)</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );

      // const renderPerformance = () => (
      //   <div className="content-section">
      //     <div className="performance-grid">
      //       <div className="perf-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Cpu className="card-icon" />
      //             CPU Performance
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="perf-metric">
      //             <span className="metric-label">Current Load</span>
      //             <div className="metric-bar">
      //               <div className="metric-fill" style={{width: '23%'}}></div>
      //             </div>
      //             <span className="metric-value">23%</span>
      //           </div>
      //           <div className="perf-metric">
      //             <span className="metric-label">Peak Load (24h)</span>
      //             <div className="metric-bar">
      //               <div className="metric-fill" style={{width: '67%'}}></div>
      //             </div>
      //             <span className="metric-value">67%</span>
      //           </div>
      //           <div className="perf-stats">
      //             <div className="perf-stat">
      //               <span>Cores:</span>
      //               <span>8</span>
      //             </div>
      //             <div className="perf-stat">
      //               <span>Threads:</span>
      //               <span>16</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="perf-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <HardDrive className="card-icon" />
      //             Memory Usage
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="perf-metric">
      //             <span className="metric-label">RAM Usage</span>
      //             <div className="metric-bar">
      //               <div className="metric-fill" style={{width: '30%'}}></div>
      //             </div>
      //             <span className="metric-value">2.4GB / 8GB</span>
      //           </div>
      //           <div className="perf-metric">
      //             <span className="metric-label">Disk Usage</span>
      //             <div className="metric-bar">
      //               <div className="metric-fill" style={{width: '45%'}}></div>
      //             </div>
      //             <span className="metric-value">225GB / 500GB</span>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="perf-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Network className="card-icon" />
      //             Network Performance
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="perf-metric">
      //             <span className="metric-label">Bandwidth Usage</span>
      //             <div className="metric-bar">
      //               <div className="metric-fill" style={{width: '35%'}}></div>
      //             </div>
      //             <span className="metric-value">350 Mbps</span>
      //           </div>
      //           <div className="perf-stats">
      //             <div className="perf-stat">
      //               <span>Latency:</span>
      //               <span>45ms</span>
      //             </div>
      //             <div className="perf-stat">
      //               <span>Packet Loss:</span>
      //               <span>0.1%</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="perf-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <BarChart3 className="card-icon" />
      //             API Performance
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="perf-stats">
      //             <div className="perf-stat">
      //               <span>Avg Response Time:</span>
      //               <span>245ms</span>
      //             </div>
      //             <div className="perf-stat">
      //               <span>Requests/sec:</span>
      //               <span>127</span>
      //             </div>
      //             <div className="perf-stat">
      //               <span>Success Rate:</span>
      //               <span>99.8%</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="performance-actions">
      //       <button onClick={() => handleAction('Performance Benchmark')} className="perf-button primary">
      //         <Activity className="button-icon" />
      //         Run Performance Test
      //       </button>
      //       <button onClick={() => handleAction('Memory Cleanup')} className="perf-button">
      //         <RefreshCw className="button-icon" />
      //         Clear Memory Cache
      //       </button>
      //       <button onClick={() => handleAction('Performance Report')} className="perf-button">
      //         <FileText className="button-icon" />
      //         Generate Report
      //       </button>
      //     </div>
      //   </div>
      // );

      // const renderDeployment = () => (
      //   <div className="content-section">
      //     <div className="deployment-grid">
      //       <div className="deploy-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <GitBranch className="card-icon" />
      //             Current Deployment
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="deploy-info">
      //             <div className="deploy-item">
      //               <span className="deploy-label">Version:</span>
      //               <span className="deploy-value">v2.1.4</span>
      //             </div>
      //             <div className="deploy-item">
      //               <span className="deploy-label">Branch:</span>
      //               <span className="deploy-value">main</span>
      //             </div>
      //             <div className="deploy-item">
      //               <span className="deploy-label">Commit:</span>
      //               <span className="deploy-value">a1b2c3d</span>
      //             </div>
      //             <div className="deploy-item">
      //               <span className="deploy-label">Deployed:</span>
      //               <span className="deploy-value">2 hours ago</span>
      //             </div>
      //           </div>
      //           <div className="deploy-status">
      //             <CheckCircle className="status-icon success" />
      //             <span className="status-text">Deployment Successful</span>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="deploy-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Server className="card-icon" />
      //             Environment Status
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="env-list">
      //             <div className="env-item">
      //               <span className="env-name">Production</span>
      //               <span className="env-status active">Active</span>
      //               <span className="env-version">v2.1.4</span>
      //             </div>
      //             <div className="env-item">
      //               <span className="env-name">Staging</span>
      //               <span className="env-status active">Active</span>
      //               <span className="env-version">v2.1.5-beta</span>
      //             </div>
      //             <div className="env-item">
      //               <span className="env-name">Development</span>
      //               <span className="env-status active">Active</span>
      //               <span className="env-version">v2.2.0-dev</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="deployment-actions">
      //       <div className="action-section">
      //         <h4 className="action-title">Quick Deploy</h4>
      //         <div className="action-buttons">
      //           <button onClick={() => handleAction('Deploy to Staging')} className="deploy-button">
      //             <Upload className="button-icon" />
      //             Deploy to Staging
      //           </button>
      //           <button onClick={() => handleAction('Deploy to Production')} className="deploy-button primary">
      //             <Upload className="button-icon" />
      //             Deploy to Production
      //           </button>
      //         </div>
      //       </div>

      //       <div className="action-section">
      //         <h4 className="action-title">Rollback</h4>
      //         <div className="action-buttons">
      //           <button onClick={() => handleAction('Rollback Previous')} className="deploy-button warning">
      //             <RefreshCw className="button-icon" />
      //             Rollback to v2.1.3
      //           </button>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="deployment-history">
      //       <div className="card-header">
      //         <h3 className="card-title">Deployment History</h3>
      //       </div>
      //       <div className="card-content">
      //         <div className="history-list">
      //           <div className="history-item">
      //             <div className="history-info">
      //               <span className="history-version">v2.1.4</span>
      //               <span className="history-time">2 hours ago</span>
      //               <span className="history-user">admin@100acres.com</span>
      //             </div>
      //             <span className="history-status success">Success</span>
      //           </div>
      //           <div className="history-item">
      //             <div className="history-info">
      //               <span className="history-version">v2.1.3</span>
      //               <span className="history-time">1 day ago</span>
      //               <span className="history-user">dev@100acres.com</span>
      //             </div>
      //             <span className="history-status success">Success</span>
      //           </div>
      //           <div className="history-item">
      //             <div className="history-info">
      //               <span className="history-version">v2.1.2</span>
      //               <span className="history-time">3 days ago</span>
      //               <span className="history-user">admin@100acres.com</span>
      //             </div>
      //             <span className="history-status failed">Failed</span>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // );

      // const renderTools = () => (
      //   <div className="content-section">
      //     <div className="tools-grid">
      //       <div className="tool-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Terminal className="card-icon" />
      //             Command Console
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="console-output">
      //             <div className="console-line">$ npm run build</div>
      //             <div className="console-line output">Building application...</div>
      //             <div className="console-line output">✓ Build completed successfully</div>
      //             <div className="console-line">$ </div>
      //           </div>
      //           <div className="console-input">
      //             <input
      //               type="text"
      //               placeholder="Enter command..."
      //               className="command-input"
      //             />
      //             <button onClick={() => handleAction('Execute Command')} className="execute-button">
      //               <Play className="button-icon" />
      //             </button>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="tool-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Package className="card-icon" />
      //             Package Manager
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="package-actions">
      //             <button onClick={() => handleAction('Check Updates')} className="package-button">
      //               <RefreshCw className="button-icon" />
      //               Check Updates
      //             </button>
      //             <button onClick={() => handleAction('Install Dependencies')} className="package-button">
      //               <Download className="button-icon" />
      //               Install Dependencies
      //             </button>
      //             <button onClick={() => handleAction('Audit Security')} className="package-button">
      //               <Shield className="button-icon" />
      //               Security Audit
      //             </button>
      //           </div>
      //           <div className="package-info">
      //             <div className="package-stat">
      //               <span>Total Packages:</span>
      //               <span>247</span>
      //             </div>
      //             <div className="package-stat">
      //               <span>Outdated:</span>
      //               <span>12</span>
      //             </div>
      //             <div className="package-stat">
      //               <span>Vulnerabilities:</span>
      //               <span>0</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="tool-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Code className="card-icon" />
      //             Code Analysis
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="analysis-actions">
      //             <button onClick={() => handleAction('Lint Code')} className="analysis-button">
      //               <Bug className="button-icon" />
      //               Run Linter
      //             </button>
      //             <button onClick={() => handleAction('Format Code')} className="analysis-button">
      //               <Wrench className="button-icon" />
      //               Format Code
      //             </button>
      //             <button onClick={() => handleAction('Test Coverage')} className="analysis-button">
      //               <BarChart3 className="button-icon" />
      //               Test Coverage
      //             </button>
      //           </div>
      //           <div className="analysis-results">
      //             <div className="result-item">
      //               <span>Code Quality:</span>
      //               <span className="result-score good">A+</span>
      //             </div>
      //             <div className="result-item">
      //               <span>Test Coverage:</span>
      //               <span className="result-score good">89%</span>
      //             </div>
      //             <div className="result-item">
      //               <span>Maintainability:</span>
      //               <span className="result-score good">A</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="tool-card">
      //         <div className="card-header">
      //           <h3 className="card-title">
      //             <Monitor className="card-icon" />
      //             System Monitor
      //           </h3>
      //         </div>
      //         <div className="card-content">
      //           <div className="monitor-controls">
      //             <button onClick={() => handleAction('Start Monitoring')} className="monitor-button primary">
      //               <Play className="button-icon" />
      //               Start Monitor
      //             </button>
      //             <button onClick={() => handleAction('Stop Monitoring')} className="monitor-button">
      //               <Pause className="button-icon" />
      //               Stop Monitor
      //             </button>
      //           </div>
      //           <div className="monitor-status">
      //             <div className="status-item">
      //               <Clock className="status-icon" />
      //               <span>Uptime: 5d 12h 34m</span>
      //             </div>
      //             <div className="status-item">
      //               <Activity className="status-icon" />
      //               <span>Last Check: 30s ago</span>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // );

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

      const renderContent = () => {
        switch (activeTab) {
          case 'overview':
            return renderOverview();
          case 'access-control':
            return renderAccessControl();
          case 'database':
            return renderDatabase();
          case 'api':
            return renderAPI();
          case 'security':
            return renderSecurity();
          case 'logs':
            return renderLogs();
          case 'create-employee':
            return renderCreateEmployee();
          case 'performance':
            return renderPerformance();
          case 'deployment':
            return renderDeployment();
          case 'tools':
            return renderTools();
          case 'chat':
            return <DeveloperChat developerName={developerName} />;
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
        <>
          <div className="developer-console">
            <div className="console-header">
              {/* Hamburger for mobile */}
              <button
                className="hamburger-btn"
                onClick={() => setSidebarOpen(true)}
                style={{ display: 'none' }}
                aria-label="Open navigation menu"
              >
                <Menu size={28} />
              </button>
            </div>

            <div className="console-layout">
              {/* Sidebar/Nav Panel */}
              <div
                className={`nav-panel${sidebarOpen ? ' open' : ''}`}
                style={{
                  display: sidebarOpen ? 'block' : '',
                }}
              >
                {/* Close button for mobile */}
                <button
                  className="close-sidebar-btn"
                  onClick={() => setSidebarOpen(false)}
                  style={{ display: 'none' }}
                  aria-label="Close navigation menu"
                >
                  <X size={28} />
                </button>
                <CardContent className="nav-content">
                  <nav className="nav-menu">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false); // close sidebar on mobile after nav
                        }}
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                      >
                        <tab.icon className="nav-icon" />
                        <span className="nav-text">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                  <div className="logout-section">
                    <div className="user-info"></div>
                    <button className="logout-btn" onClick={handleLogout}>
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </CardContent>
              </div>
              {/* Overlay for mobile sidebar */}
              {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
              )}
              {/* Main Content */}
              <div className="content-panel">
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
              </div>
            </div>
          </div>

        
        </>
      );
    };

    export default DeveloperContent;
