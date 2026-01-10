import React from 'react';
import { FileText, Share2, Lightbulb, BarChart3, Home, X } from 'lucide-react';

const ActivitySidebar = ({ isOpen, activeTab, onTabChange, onClose }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'content', label: 'Content', icon: Share2 },
    { id: 'thoughts', label: 'Thoughts', icon: Lightbulb },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 z-50 lg:z-0 overflow-y-auto`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Activity Hub</h2>
          <button onClick={onClose} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-8 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Department Features</p>
          <div className="space-y-2 text-sm text-gray-300">
            <p>✓ Share Reports</p>
            <p>✓ Upload Files</p>
            <p>✓ Post Content</p>
            <p>✓ Share Thoughts</p>
            <p>✓ Collaborate</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ActivitySidebar;
