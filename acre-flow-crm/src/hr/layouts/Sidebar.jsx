import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiOutlineHome,
  HiOutlineChatAlt2,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineMenu,
  // HiOutlineChevronDown,
  // HiOutlineChevronRight,
  HiOutlineUser
} from 'react-icons/hi';

const HrSidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);

  const userName = localStorage.getItem('hrName') || localStorage.getItem('userName') || user?.name || 'HR User';
  const userEmail = localStorage.getItem('hrEmail') || localStorage.getItem('userEmail') || user?.email || 'hr@company.com';

  const menuItems = [
    {
      section: 'Features',
      items: [
        { title: 'Dashboard', icon: HiOutlineHome, path: '/hr/dashboard' },
        { title: 'Messages', icon: HiOutlineChatAlt2, path: '/hr/messages' },
      ]
    },
    {
      section: 'Recruitment',
      items: [
        { title: 'Jobs', icon: HiOutlineBriefcase, path: '/hr/recruitment/jobs' },
        { title: 'Candidates', icon: HiOutlineUsers, path: '/hr/recruitment/candidates' },
        { title: 'Resumes', icon: HiOutlineDocumentText, path: '/hr/recruitment/resumes' },
      ]
    },
    {
      section: 'Organization',
      items: [
        { title: 'Employee Management', icon: HiOutlineUsers, path: '/hr/employees' },
        { title: 'Leave Management', icon: HiOutlineCalendar, path: '/hr/leave' },
        { title: 'Performance Management', icon: HiOutlineChartBar, path: '/hr/performance' },
        { title: 'Payroll Management', icon: HiOutlineCurrencyDollar, path: '/hr/payroll' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { title: 'Settings', icon: HiOutlineCog, path: '/hr/settings' },
      ]
    },
  ];

  const handleLogout = () => {
    try {
      dispatch({ type: 'auth/logout' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('hrEmail');
    localStorage.removeItem('hrName');
    localStorage.removeItem('hrRole');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <style jsx>{`
        .text-sm.font-medium {
          color: white !important;
        }
        .sidebar-section {
          color: #e2e8f0 !important;
        }
      `}</style>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
        style={{ backgroundColor: '#1e3a8a' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
         
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-slate-800"
            >
              <HiOutlineX className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-slate-700 rounded-full flex items-center justify-center">
                <HiOutlineUser className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-slate-300 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {menuItems.map((group) => (
              <div key={group.section} className="mb-6">
                <p className="px-3 mb-2 text-[11px] font-semibold tracking-wide sidebar-section uppercase">
                  {group.section}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? 'bg-yellow-400 text-slate-900'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            active ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-3 w-full px-3 py-2 text-sm font-semibold text-white rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HrSidebar;
