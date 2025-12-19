import React, { useState, useEffect } from "react";
import api100acress from "../config/api100acressClient";
import Modal from "react-modal";
import AdminSidebar from "../components/AdminSidebar";
import { Link, useParams } from "react-router-dom";
import { message } from "antd";
import { MdHome, MdAddCircle, MdTableRows, MdSearch, MdEdit, MdDelete, MdExpandMore, MdExpandLess, MdArrowBack, MdVisibility } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { LogOut, Menu, X, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';

// Set app element for react-modal to prevent accessibility issues
Modal.setAppElement('#root');

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '0px',
    border: 'none',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '450px',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000
  }
};

const ProjectsAddBhk = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedBhk, setSelectedBhk] = useState(null);
  const [editFromData, setEditFromData] = useState({
    bhk_type: "",
    price: "",
    bhk_Area: ""
  });

  useEffect(() => {
    // Get real-time logged-in user data
    const userName = localStorage.getItem('userName') || localStorage.getItem('adminName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole') || 'admin';
    
    setUserInfo({ 
      name: userName, 
      email: userEmail,
      role: userRole
    });
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    // Clear all user-related localStorage items
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sourceSystem');
    
    window.location.href = '/login';
  };

  const resetData = () => {
    setEditFromData({
      bhk_type: "",
      price: "",
      bhk_Area: ""
    });
  };

  const [viewAll, setViewAll] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(true);
  const [editingBhkId, setEditingBhkId] = useState(null);
  const [editingBhkData, setEditingBhkData] = useState({
    bhk_type: "",
    price: "",
    bhk_Area: ""
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [bhkListOpen, setBhkListOpen] = useState(true);
  const [modalSectionOpen, setModalSectionOpen] = useState(true);

  const { id } = useParams();

  // Function to fetch BHK data
  const fetchBhkData = async () => {
    if (!id || id === 'undefined') {
      messageApi.open({
        type: 'error',
        content: 'Project ID is missing or invalid.',
        duration: 2,
      });
      return;
    }
    try {
      const res = await api100acress.get(`bhk_view/${id}`);
      setViewAll(res.data.data || []);
    } catch (error) {
      console.error("Error fetching BHK details:", error);
      messageApi.open({
        type: 'error',
        content: 'Failed to fetch BHK details.',
        duration: 2,
      });
    }
  };

  useEffect(() => {
    fetchBhkData();
  }, [id]);

  const handleEditChangeFrom = (e) => {
    const { name, value } = e.target;
    setEditFromData({ ...editFromData, [name]: value });
  };

  const submitBHKFromData = async (e) => {
    e.preventDefault();
    messageApi.open({
      key: "insertingBHK",
      type: 'loading',
      content: 'Inserting...',
    });
    try {
      const response = await api100acress.post(`bhk_insert/${id}`, editFromData);
      if (response.status >= 200 && response.status < 300) {
        messageApi.destroy('insertingBHK');
        messageApi.open({
          type: 'success',
          content: 'BHK has been inserted successfully.',
          duration: 2,
        });
        fetchBhkData();
        resetData();
        closeModal();
      } else {
        messageApi.destroy('insertingBHK');
        messageApi.open({
          type: 'error',
          content: 'Something went wrong while inserting the BHK.',
          duration: 2,
        });
      }
    } catch (error) {
      messageApi.destroy('insertingBHK');
      messageApi.open({
        type: 'error',
        content: 'Something went wrong while inserting the BHK.',
        duration: 2,
      });
      console.error('Error inserting BHK data:', error.message);
    }
  };

  function openModal() {
    resetData();
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDeleteUser = async (_id) => {
    try {
      messageApi.open({
        key: "deletingBHK",
        type: 'loading',
        content: 'Deleting...',
      });
      const response = await api100acress.delete(`bhk_delete/${_id}`);
      if (response.status >= 200 && response.status < 300) {
        messageApi.destroy('deletingBHK');
        messageApi.open({
          type: 'success',
          content: 'BHK has been deleted successfully.',
          duration: 2,
        });
        fetchBhkData();
      } else {
        messageApi.destroy('deletingBHK');
        messageApi.open({
          type: 'error',
          content: 'Failed to delete BHK. Server returned an error.',
          duration: 2,
        });
      }
    } catch (error) {
      messageApi.destroy('deletingBHK');
      messageApi.open({
        type: 'error',
        content: 'An error occurred while deleting BHK.',
        duration: 2,
      });
      console.error('An error occurred while deleting BHK:', error.message);
    }
  };

  const handleDeleteButtonClick = (_id) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this BHK?');
    if (confirmDeletion) {
      handleDeleteUser(_id);
    }
  };

  // Edit BHK handlers
  const openEditModal = (bhkItem) => {
    setEditingBhkId(bhkItem._id);
    setEditingBhkData({
      bhk_type: bhkItem.bhk_type || "",
      price: bhkItem.price || "",
      bhk_Area: bhkItem.bhk_Area || ""
    });
    setEditFormOpen(true);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEditingBhkId(null);
    setEditingBhkData({
      bhk_type: "",
      price: "",
      bhk_Area: ""
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBhkData({ ...editingBhkData, [name]: value });
  };

  const submitEditBHKData = async (e) => {
    e.preventDefault();
    messageApi.open({
      key: "updatingBHK",
      type: 'loading',
      content: 'Updating BHK...',
    });
    try {
      const response = await api100acress.post(`bhk_update/${editingBhkId}`, editingBhkData);
      if (response.status >= 200 && response.status < 300) {
        messageApi.destroy('updatingBHK');
        messageApi.open({
          type: 'success',
          content: 'BHK updated successfully.',
          duration: 2,
        });
        fetchBhkData();
        closeEditModal();
      } else {
        messageApi.destroy('updatingBHK');
        messageApi.open({
          type: 'error',
          content: 'Something went wrong while updating the BHK.',
          duration: 2,
        });
      }
    } catch (error) {
      messageApi.destroy('updatingBHK');
      messageApi.open({
        type: 'error',
        content: 'Something went wrong while updating the BHK.',
        duration: 2,
      });
      console.error('Error updating BHK data:', error.message);
    }
  };

  // Filter `viewAll` based on `searchTerm`
  const filteredBHKs = viewAll.filter(item =>
    item.bhk_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.bhk_Area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen">
      <AdminSidebar/>
      <div className="flex-1 p-8 ml-0 overflow-auto">
        {contextHolder}

        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <MdHome className="text-3xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage BHKs</h1>
          </div>
          <div className="flex space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search BHKs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Add new BHK floor plan"
            >
              <MdAddCircle className="text-xl" /> Add Floor Plan
            </button>
          </div>
        </div>

        {/* BHK Table (Collapsible) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-l-4 border-blue-400 mb-10">
          <button
            className="w-full flex items-center gap-2 px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onClick={() => setBhkListOpen((open) => !open)}
            aria-expanded={bhkListOpen}
            aria-controls="bhk-list-section"
            type="button"
            title={bhkListOpen ? 'Collapse BHK List' : 'Expand BHK List'}
          >
            <MdTableRows className={`text-2xl text-blue-500 transition-transform duration-300 ${bhkListOpen ? 'rotate-0' : 'rotate-12 scale-110'}`} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex-1 text-left">BHK List</h2>
            {bhkListOpen ? <MdExpandLess className="text-2xl text-gray-500 transition-transform duration-300" /> : <MdExpandMore className="text-2xl text-gray-500 transition-transform duration-300" />}
          </button>
          <div
            id="bhk-list-section"
            className={`overflow-x-auto transition-all duration-300 ${bhkListOpen ? 'max-h-[1000px] opacity-100 p-8' : 'max-h-0 opacity-0 p-0'} bg-white dark:bg-gray-800`}
            style={{ willChange: 'max-height, opacity, padding' }}
            aria-hidden={!bhkListOpen}
          >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">S No.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">BHK Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">BHK Area</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBHKs.length > 0 ? (
                  filteredBHKs.map((item, index) => (
                    <tr key={item._id} className="group even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{item.bhk_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{item.bhk_Area}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <Tippy content="Edit BHK" animation="scale" theme="light-border">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 group"
                          >
                            <MdEdit className="text-lg group-hover:animate-bounce" /> Edit
                          </button>
                        </Tippy>
                        <Tippy content="Delete BHK" animation="scale" theme="light-border">
                          <button
                            type="button"
                            onClick={() => handleDeleteButtonClick(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 group"
                          >
                            <MdDelete className="text-lg group-hover:animate-pulse" /> Delete
                          </button>
                        </Tippy>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <MdTableRows className="text-4xl text-gray-300 dark:text-gray-600 mb-2 animate-pulse" />
                        No BHK details found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Floor Plan Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
          contentLabel="Add Floor Plan"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl">
            <button
              className="w-full flex items-center gap-2 bg-blue-600 dark:bg-blue-700 rounded-t-xl px-6 py-4 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onClick={() => setModalSectionOpen((open) => !open)}
              aria-expanded={modalSectionOpen}
              aria-controls="modal-form-section"
              type="button"
              style={{ borderBottomLeftRadius: modalSectionOpen ? 0 : '0.75rem', borderBottomRightRadius: modalSectionOpen ? 0 : '0.75rem' }}
            >
              <MdAddCircle className={`text-2xl transition-transform duration-300 ${modalSectionOpen ? 'rotate-0' : 'rotate-90 scale-110'}`} />
              <h2 className="font-serif text-2xl font-semibold tracking-wide flex-1 text-left">Add Floor Plan</h2>
              {modalSectionOpen ? <MdExpandLess className="text-2xl text-white transition-transform duration-300" /> : <MdExpandMore className="text-2xl text-white transition-transform duration-300" />}
            </button>
            <div
              id="modal-form-section"
              className={`transition-all duration-300 ${modalSectionOpen ? 'max-h-[1000px] opacity-100 p-8' : 'max-h-0 opacity-0 p-0'}`}
              style={{ willChange: 'max-height, opacity, padding' }}
              aria-hidden={!modalSectionOpen}
            >
              <form onSubmit={submitBHKFromData} className="space-y-5">
                <div>
                  <label htmlFor="bhk_Area" className="sr-only">BHK Area</label>
                  <Tippy content={<span>Enter the area for this BHK (e.g., 1200 sqft)</span>} animation="scale" theme="light-border">
                    <input
                      id="bhk_Area"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-blue-500 focus:ring-1 shadow-sm transition duration-200"
                      type="text"
                      placeholder="Add BHK Area (e.g., 1200 sqft)"
                      name="bhk_Area"
                      value={editFromData.bhk_Area}
                      onChange={handleEditChangeFrom}
                      required
                    />
                  </Tippy>
                </div>
                <div>
                  <label htmlFor="bhk_type" className="sr-only">BHK Type</label>
                  <Tippy content={<span>Enter the type for this BHK (e.g., 2BHK)</span>} animation="scale" theme="light-border">
                    <input
                      id="bhk_type"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-blue-500 focus:ring-1 shadow-sm transition duration-200"
                      type="text"
                      placeholder="Add BHK Type (e.g., 2BHK)"
                      name="bhk_type"
                      value={editFromData.bhk_type}
                      onChange={handleEditChangeFrom}
                      required
                    />
                  </Tippy>
                </div>
                <div>
                  <label htmlFor="price" className="sr-only">Price</label>
                  <Tippy content={<span>Enter the price for this BHK (e.g., ₹50 Lacs)</span>} animation="scale" theme="light-border">
                    <input
                      id="price"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-blue-500 focus:ring-1 shadow-sm transition duration-200"
                      type="text"
                      placeholder="Price (e.g., ₹50 Lacs)"
                      name="price"
                      value={editFromData.price}
                      onChange={handleEditChangeFrom}
                      required
                    />
                  </Tippy>
                </div>

                <Tippy content={<span>Insert new BHK floor plan</span>} animation="scale" theme="light-border">
                  <button
                    type="submit"
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-semibold text-white shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                  >
                    <MdAddCircle className="text-xl group-hover:animate-bounce" /> Insert
                  </button>
                </Tippy>
              </form>
            </div>
          </div>
        </Modal>

        {/* Edit BHK Modal */}
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          style={customModalStyles}
          contentLabel="Edit Floor Plan"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl">
            <button
              className="w-full flex items-center gap-2 bg-green-600 dark:bg-green-700 rounded-t-xl px-6 py-4 text-center text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              onClick={() => setEditFormOpen((open) => !open)}
              aria-expanded={editFormOpen}
              aria-controls="edit-bhk-form-section"
              type="button"
              style={{ borderBottomLeftRadius: editFormOpen ? 0 : '0.75rem', borderBottomRightRadius: editFormOpen ? 0 : '0.75rem' }}
            >
              <MdEdit className={`text-2xl transition-transform duration-300 ${editFormOpen ? 'rotate-0' : 'rotate-90 scale-110'}`} />
              <h2 className="font-serif text-2xl font-semibold tracking-wide flex-1 text-left">Edit Floor Plan</h2>
              {editFormOpen ? <MdExpandLess className="text-2xl text-white transition-transform duration-300" /> : <MdExpandMore className="text-2xl text-white transition-transform duration-300" />}
            </button>
            <div
              id="edit-bhk-form-section"
              className={`transition-all duration-300 ${editFormOpen ? 'max-h-[1000px] opacity-100 p-8' : 'max-h-0 opacity-0 p-0'}`}
              style={{ willChange: 'max-height, opacity, padding' }}
              aria-hidden={!editFormOpen}
            >
              <form onSubmit={submitEditBHKData} className="space-y-5">
                <div>
                  <label htmlFor="edit_bhk_Area" className="sr-only">BHK Area</label>
                  <Tippy content={<span>Enter the area for this BHK (e.g., 1200 sqft)</span>} animation="scale" theme="light-border">
                    <input
                      id="edit_bhk_Area"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-green-500 focus:ring-1 shadow-sm transition duration-200"
                      type="text"
                      placeholder="BHK Area (e.g., 1200 sqft)"
                      name="bhk_Area"
                      value={editingBhkData.bhk_Area}
                      onChange={handleEditInputChange}
                      required
                    />
                  </Tippy>
                </div>
                <div>
                  <label htmlFor="edit_bhk_type" className="sr-only">BHK Type</label>
                  <Tippy content={<span>Enter the type for this BHK (e.g., 2BHK)</span>} animation="scale" theme="light-border">
                    <input
                      id="edit_bhk_type"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-green-500 focus:ring-1 shadow-sm transition duration-200"
                      type="text"
                      placeholder="BHK Type (e.g., 2BHK)"
                      name="bhk_type"
                      value={editingBhkData.bhk_type}
                      onChange={handleEditInputChange}
                      required
                    />
                  </Tippy>
                </div>
                <div>
                  <label htmlFor="edit_price" className="sr-only">Price</label>
                  <Tippy content={<span>Enter the price for this BHK (e.g., ₹50 Lacs)</span>} animation="scale" theme="light-border">
                    <input
                      id="edit_price"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-green-500 focus:ring-1 shadow-sm transition duration-200"
                      type="text"
                      placeholder="Price (e.g., ₹50 Lacs)"
                      name="price"
                      value={editingBhkData.price}
                      onChange={handleEditInputChange}
                      required
                    />
                  </Tippy>
                </div>

                <Tippy content={<span>Update BHK floor plan</span>} animation="scale" theme="light-border">
                  <button
                    type="submit"
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 px-6 py-3 font-semibold text-white shadow-md hover:from-green-600 hover:to-green-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
                  >
                    <MdEdit className="text-xl group-hover:animate-bounce" /> Update
                  </button>
                </Tippy>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectsAddBhk;
