import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../components/AdminSidebar';
import api100acress from '../config/api100acressClient';
import { LogOut, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdVisibility, 
  MdVisibilityOff,
  MdSave,
  MdClose,
  MdRefresh,
  MdDragIndicator,
  MdCategory,
  MdTrendingUp,
  MdHome,
  MdBusiness,
  MdAttachMoney,
  MdStar,
  MdImage
} from 'react-icons/md';

const ProjectOrderManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // State for different project categories
  const [projectOrders, setProjectOrders] = useState({
    luxury: [],
    trending: [],
    affordable: [],
    sco: [],
    commercial: [],
    budget: [],
    recommended: [],
    desiredLuxury: [],
    budgetPlots: []
  });
  
  const [activeTab, setActiveTab] = useState('luxury');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    image: '',
    order: 0,
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);

  // Tab configuration
  const tabs = [
    { key: 'luxury', label: 'Luxury Projects', icon: MdStar, color: 'text-yellow-600' },
    { key: 'trending', label: 'Trending Projects', icon: MdTrendingUp, color: 'text-blue-600' },
    { key: 'affordable', label: 'Affordable Projects', icon: MdAttachMoney, color: 'text-green-600' },
    { key: 'sco', label: 'SCO Projects', icon: MdBusiness, color: 'text-purple-600' },
    { key: 'commercial', label: 'Commercial Projects', icon: MdBusiness, color: 'text-indigo-600' },
    { key: 'budget', label: 'Budget Projects', icon: MdAttachMoney, color: 'text-orange-600' },
    { key: 'recommended', label: 'Recommended Projects', icon: MdStar, color: 'text-pink-600' },
    { key: 'desiredLuxury', label: 'Desired Luxury', icon: MdStar, color: 'text-red-600' },
    { key: 'budgetPlots', label: 'Budget Plots', icon: MdHome, color: 'text-teal-600' }
  ];

  // Load data from localStorage or API
  useEffect(() => {
    loadProjectOrders();
  }, []);

  useEffect(() => {
    const userName = localStorage.getItem('userName') || localStorage.getItem('adminName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole') || 'admin';
    setUserInfo({ name: userName, email: userEmail, role: userRole });
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('sourceSystem');
    localStorage.removeItem('originalRole');
    localStorage.removeItem('myToken');
    localStorage.removeItem('isDeveloperLoggedIn');
    localStorage.removeItem('isHrFinanceLoggedIn');
    localStorage.removeItem('isSalesHeadLoggedIn');
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('isItLoggedIn');
    window.location.href = '/login';
  };

  const loadProjectOrders = async () => {
    try {
      // First try to fetch from backend API
      console.log('Attempting to fetch project orders...');
      const response = await api100acress.get(`/api/admin/project-orders`);

      if (response.data) {
        if (response.data.success && response.data.data) {
          setProjectOrders(response.data.data);
          // Also save to localStorage as backup
          localStorage.setItem('projectOrders', JSON.stringify(response.data.data));
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching project orders from API:', error);
      if (error.response?.status === 401) {
        console.error('Authentication failed - checking available tokens...');
        console.log('myToken:', localStorage.getItem('myToken') ? 'exists' : 'missing');
        console.log('token:', localStorage.getItem('token') ? 'exists' : 'missing');
        console.log('userEmail:', localStorage.getItem('userEmail'));
        console.log('userRole:', localStorage.getItem('userRole'));
      }
    }

    // Fallback to localStorage if API fails
    try {
      const saved = localStorage.getItem('projectOrders');
      if (saved) {
        setProjectOrders(JSON.parse(saved));
        return;
      }
    } catch (error) {
      console.error('Error loading project orders from localStorage:', error);
    }

    // Load default data if both API and localStorage fail
    setProjectOrders({
      luxury: [
        { id: 1, name: "Elan The Emperor", order: 1, isActive: true },
        { id: 2, name: "Experion The Trillion", order: 2, isActive: true },
        { id: 3, name: "Birla Arika", order: 3, isActive: true },
        { id: 4, name: "DLF Privana North", order: 4, isActive: true }
      ],
      trending: [
        { id: 5, name: "Indiabulls Estate Club", order: 1, isActive: true },
        { id: 6, name: "Signature Global Twin Tower DXP", order: 2, isActive: true },
        { id: 7, name: "Tarc Ishva", order: 3, isActive: true }
      ],
      affordable: [
        { id: 8, name: "Wal 92", order: 1, isActive: true },
        { id: 9, name: "TLC The First Acre", order: 2, isActive: true }
      ],
      sco: [
        { id: 10, name: "Reach The Bazaria", order: 1, isActive: true },
        { id: 11, name: "BPTP The Oval", order: 2, isActive: true },
        { id: 12, name: "Aarize South Drive", order: 3, isActive: true },
        { id: 13, name: "Adani Downtown Avenue", order: 4, isActive: true }
      ],
      commercial: [
        { id: 14, name: "Elan Imperial", order: 1, isActive: true },
        { id: 15, name: "Trehan IRIS Broadway", order: 2, isActive: true },
        { id: 16, name: "Aarize The Tessoro", order: 3, isActive: true },
        { id: 17, name: "Omaxe State Dwarka", order: 4, isActive: true }
      ],
      budget: [
        { id: 18, name: "Signature Global City 81", order: 1, isActive: true },
        { id: 19, name: "adore-the-select-premia", order: 2, isActive: true },
        { id: 20, name: "M3M Soulitude", order: 3, isActive: true },
        { id: 21, name: "ROF Pravasa", order: 4, isActive: true }
      ],
      recommended: [
        { id: 22, name: "ROF Pravasa", order: 1, isActive: true },
        { id: 23, name: "Signature Global Cloverdale SPR", order: 2, isActive: true },
        { id: 24, name: "Experion One 42", order: 3, isActive: true },
        { id: 25, name: "Experion The Trillion", order: 4, isActive: true }
      ],
      desiredLuxury: [
        { id: 26, name: "Experion One 42", order: 1, isActive: true },
        { id: 27, name: "Trump Towers Delhi NCR", order: 2, isActive: true },
        { id: 28, name: "Godrej Miraya", order: 3, isActive: true },
        { id: 29, name: "Birla Arika", order: 4, isActive: true },
        { id: 30, name: "Shapoorji Pallonji Dualis", order: 5, isActive: true },
        { id: 31, name: "Trevoc Royal Residences", order: 6, isActive: true },
        { id: 32, name: "Experion Windchants Nova", order: 7, isActive: true }
      ],
      budgetPlots: [
        { id: 33, name: "Reliance Met City", link: "/reliance-met-city/", image: "https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/100acre/banner/reliance-met-city.webp", order: 1, isActive: true },
        { id: 34, name: "Signature Sidhrawali", link: "/signature-global-plots/", image: "https://d16gdc5rm7f21b.cloudfront.net/100acre/budgetplots/colors.jpg", order: 2, isActive: true },
        { id: 35, name: "BPTP Limited", link: "/bptp-plots-gurugram/", image: "https://d16gdc5rm7f21b.cloudfront.net/100acre/budgetplots/bptp.webp", order: 3, isActive: true },
        { id: 36, name: "ORRIS Group", link: "/orris-plots-gurugram/", image: "https://d16gdc5rm7f21b.cloudfront.net/100acre/budgetplots/Orris.jpg", order: 4, isActive: true }
      ]
    });
  };

  const saveProjectOrders = async (newOrders) => {
    try {
      // Save to backend API
      const response = await api100acress.put(`/api/admin/project-orders`, { data: newOrders });

      if (response.data) {
        
        setProjectOrders(newOrders);
        // Also save to localStorage as backup
        localStorage.setItem('projectOrders', JSON.stringify(newOrders));
        toast.success('Project orders saved successfully!');
      } else {
        throw new Error('Failed to save project orders');
      }
    } catch (error) {
      console.error('Error saving project orders:', error);
      toast.error('Error saving project orders');
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      link: '',
      image: '',
      order: projectOrders[activeTab].length + 1,
      isActive: true
    });
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    const newOrders = { ...projectOrders };
    const currentTabData = [...newOrders[activeTab]];

    if (editingItem) {
      // Update existing item
      const index = currentTabData.findIndex(item => item.id === editingItem.id);
      if (index !== -1) {
        currentTabData[index] = { ...formData, id: editingItem.id };
      }
    } else {
      // Add new item
      const newId = Math.max(...currentTabData.map(item => item.id), 0) + 1;
      currentTabData.push({ ...formData, id: newId });
    }

    // Sort by order
    currentTabData.sort((a, b) => a.order - b.order);
    newOrders[activeTab] = currentTabData;

    saveProjectOrders(newOrders);
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const newOrders = { ...projectOrders };
      newOrders[activeTab] = newOrders[activeTab].filter(item => item.id !== itemId);
      saveProjectOrders(newOrders);
    }
  };

  const handleToggleStatus = (itemId) => {
    const newOrders = { ...projectOrders };
    const item = newOrders[activeTab].find(item => item.id === itemId);
    if (item) {
      item.isActive = !item.isActive;
      saveProjectOrders(newOrders);
    }
  };

  const handleReorder = (dragIndex, dropIndex) => {
    const newOrders = { ...projectOrders };
    const currentTabData = [...newOrders[activeTab]];
    
    const draggedItem = currentTabData[dragIndex];
    currentTabData.splice(dragIndex, 1);
    currentTabData.splice(dropIndex, 0, draggedItem);
    
    // Update order values
    currentTabData.forEach((item, index) => {
      item.order = index + 1;
    });
    
    newOrders[activeTab] = currentTabData;
    saveProjectOrders(newOrders);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(projectOrders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-orders.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setProjectOrders(data);
          localStorage.setItem('projectOrders', JSON.stringify(data));
          toast.success('Data imported successfully!');
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const currentTabData = projectOrders[activeTab] || [];
  const activeTabConfig = tabs.find(tab => tab.key === activeTab);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden font-sans">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Order</span>
                  <span className="hidden lg:inline">Project Order Management</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs sm:text-sm">{getUserInitials(userInfo?.name)}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{userInfo?.name}</p>
                    <p className="text-xs text-gray-600 truncate max-w-[120px]">{userInfo?.email}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors" type="button">
                      <User size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors" type="button">
                      <SettingsIcon size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      type="button"
                    >
                      <LogOut size={16} />
                      <span className="text-xs sm:text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* <div className="flex items-center gap-3">
                  <MdCategory className="text-2xl text-blue-600" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                      Project Order Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Manage project ordering and categorization
                    </p>
                  </div>
                </div> */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={exportData}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    type="button"
                  >
                    <MdSave className="text-lg" />
                    Export
                  </button>
                  <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer">
                    <MdRefresh className="text-lg" />
                    Import
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                  <button
                    onClick={handleAdd}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    <MdAdd className="text-lg" />
                    Add Project
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 -mx-1 px-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                      activeTab === tab.key
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    type="button"
                  >
                    <Icon className={`text-lg ${tab.color}`} />
                    {tab.label}
                    <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      {projectOrders[tab.key]?.length || 0}
                    </span>
                  </button>
                );
              })}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {currentTabData.length === 0 ? (
            <div className="p-8 text-center">
              <activeTabConfig.icon className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No {activeTabConfig.label.toLowerCase()} found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by adding your first project
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MdAdd className="text-lg" />
                Add Project
              </button>
            </div>
          ) : (
            <div className="overflow-x-hidden sm:overflow-x-auto">
              <table className="w-full table-fixed sm:table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project Name
                    </th>
                    {activeTab === 'budgetPlots' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Link
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Image
                        </th>
                      </>
                    )}
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentTabData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MdDragIndicator className="text-gray-400 cursor-move" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.order}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap overflow-hidden">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className="block truncate">{item.name}</span>
                        </div>
                      </td>
                      {activeTab === 'budgetPlots' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {item.link || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-12 w-16 object-cover rounded" />
                            ) : (
                              <span className="text-sm text-gray-400">No image</span>
                            )}
                          </td>
                        </>
                      )}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.isActive 
                                ? 'text-red-600 hover:bg-red-100' 
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                            type="button"
                          >
                            {item.isActive ? <MdVisibilityOff /> : <MdVisibility />}
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                            type="button"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                            type="button"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {editingItem ? 'Edit' : 'Add'} Project
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    type="button"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>

                  {activeTab === 'budgetPlots' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Link
                        </label>
                        <input
                          type="url"
                          value={formData.link}
                          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        />
                        {formData.image && (
                          <div className="mt-2">
                            <img src={formData.image} alt="Preview" className="h-24 w-auto rounded" />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MdSave className="text-lg" />
                      {editingItem ? 'Update' : 'Add'} Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectOrderManagement;
