
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Briefcase, BarChart3, Users, Menu, Activity } from 'lucide-react';

const roleNavItems = {
  'super-admin': [
    { label: 'Home', path: '/super-admin-dashboard', icon: Home },
    { label: 'Leads', path: '/leads', icon: Activity },
    { label: 'Users', path: '/users', icon: Users },
  ],
  'head-admin': [
    { label: 'Home', path: '/super-admin-dashboard', icon: Home },
    { label: 'Leads', path: '/leads', icon: Activity },
    { label: 'Users', path: '/users', icon: Users },
  ],
  admin: [
    { label: 'Home', path: '/admin-dashboard', icon: Home },
    { label: 'Tasks', path: '/leads', icon: Briefcase },
    { label: 'Analytics', path: '/admin/bd-analytics', icon: BarChart3 },
    { label: 'Users', path: '/users', icon: Users },
  ],
  boss: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Tasks', path: '/leads', icon: Briefcase },
    { label: 'Analytics', path: '/admin/bd-analytics', icon: BarChart3 },
    { label: 'Users', path: '/users', icon: Users },
  ],
  hod: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Tasks', path: '/leads', icon: Briefcase },
    { label: 'Analytics', path: '/admin/bd-analytics', icon: BarChart3 },
    { label: 'Users', path: '/users', icon: Users },
  ],

  'team-leader': [
    { label: 'Home', path: '/employee-dashboard', icon: Home },
    { label: 'Tasks', path: '/leads', icon: Briefcase },
    { label: 'Team', path: '/team', icon: Users },
  ],
  bd: [
    { label: 'Home', path: '/employee-dashboard', icon: Home },
    { label: 'Tasks', path: '/leads', icon: Briefcase },
    { label: 'Team', path: '/team', icon: Users },
  ],
  employee: [
    { label: 'Home', path: '/employee-dashboard', icon: Home },
    { label: 'Tasks', path: '/leads', icon: Briefcase },
    { label: 'Team', path: '/team', icon: Users },
  ],
};

const MobileBottomNav = ({ userRole, onMenuToggle, activePath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleKey = (userRole || '').toString();
  const items = roleNavItems[roleKey] || roleNavItems.employee;
  const currentPath = activePath || location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center py-2">
        {items.map(({ label, path, icon: Icon }) => {
          const isActive = currentPath === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-2 transition-colors ${isActive ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          );
        })}
        <button
          onClick={onMenuToggle}
          className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Menu size={20} />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
