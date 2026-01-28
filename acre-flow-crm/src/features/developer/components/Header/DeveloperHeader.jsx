import { Menu, Bell, Settings, Code, Search} from 'lucide-react';
const DeveloperHeader = ({ onToggleSidebar, developerName }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="menu-button">
          <Menu className="menu-icon" />
        </button>
        <div className="header-title-section">
          <div className="header-brand">
            <Code className="header-brand-icon" />
          </div>
          <div className="user-greeting">
            Hello <span className="user-name">{developerName}</span> <span className="user-role">(Developer)</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
        
        <button className="notification-button" title="Notifications">
          <Bell className="bell-icon" />
          <span className="notification-dot"></span>
        </button>
        
        <button className="settings-button" title="Settings">
          <Settings className="settings-icon" />
        </button>
      </div>
    </header>
  );
};

export default DeveloperHeader;
