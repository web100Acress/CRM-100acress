import React, { useState, useEffect } from "react";
import api100acress from "../config/api100acressClient";
import Modal from "react-modal";
import AdminSidebar from "../components/AdminSidebar";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { MdStar, MdAddCircle, MdTableRows, MdEdit, MdDelete, MdExpandMore, MdExpandLess } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { LogOut, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';

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
    width: 'min(92vw, 520px)',
    maxHeight: '90vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000
  }
};

const ProjectAddHighlights = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewAll, setViewAll] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [modalSectionOpen, setModalSectionOpen] = useState(true);
  const [editFormOpen, setEditFormOpen] = useState(true);
  const [editingHighlightId, setEditingHighlightId] = useState(null);

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
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sourceSystem');
    window.location.href = '/login';
  };

  const [highlights, setHighlights] = useState({
    highlight_Point: "",
  });

  const [editingHighlightData, setEditingHighlightData] = useState({
    highlight_Point: "",
  });

  const resetData = () => {
    setHighlights({
      highlight_Point: "",
    });
  };

  const { id } = useParams();

  const handleHighlightChange = (e) => {
    const { name, value } = e.target;
    setHighlights({ ...highlights, [name]: value });
  };

  const handleEditHighlightChange = (e) => {
    const { name, value } = e.target;
    setEditingHighlightData({ ...editingHighlightData, [name]: value });
  };

  // Function to fetch highlight data
  const ViewHighLights = async () => {
    try {
      const fetchData = await api100acress.get(`/highlight/view/${id}`);
      const data = fetchData?.data?.data;
      setViewAll(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching highlights:", error.message);
      messageApi.open({
        type: 'error',
        content: 'Failed to load highlights.',
        duration: 2,
      });
    }
  };

  useEffect(() => {
    ViewHighLights();
  }, [id]);

  const submitAddHighlight = async (e) => {
    e.preventDefault();

    messageApi.open({
      key: "insertingHighlight",
      type: 'loading',
      content: 'Adding highlight...',
    });

    try {
      const res = await api100acress.post(`/highlight/${id}`, highlights);
      if (res.status >= 200 && res.status < 300) {
        messageApi.destroy('insertingHighlight');
        messageApi.open({
          type: 'success',
          content: 'Highlight added successfully!',
          duration: 2,
        });
        resetData();
        closeModal();
        ViewHighLights();
      } else {
        messageApi.destroy('insertingHighlight');
        messageApi.open({
          type: 'error',
          content: 'Something went wrong while adding the highlight.',
          duration: 2,
        });
      }
    } catch (error) {
      messageApi.destroy('insertingHighlight');
      messageApi.open({
        type: 'error',
        content: 'An error occurred while adding the highlight.',
        duration: 2,
      });
      console.error("Error inserting highlight:", error.message);
    }
  };

  const submitEditHighlight = async (e) => {
    e.preventDefault();

    messageApi.open({
      key: "updatingHighlight",
      type: 'loading',
      content: 'Updating highlight...',
    });

    try {
      const res = await api100acress.post(`/highlight/update/${editingHighlightId}`, editingHighlightData);
      if (res.status >= 200 && res.status < 300) {
        messageApi.destroy('updatingHighlight');
        messageApi.open({
          type: 'success',
          content: 'Highlight updated successfully!',
          duration: 2,
        });
        closeEditModal();
        ViewHighLights();
      } else {
        messageApi.destroy('updatingHighlight');
        messageApi.open({
          type: 'error',
          content: 'Something went wrong while updating the highlight.',
          duration: 2,
        });
      }
    } catch (error) {
      messageApi.destroy('updatingHighlight');
      messageApi.open({
        type: 'error',
        content: 'An error occurred while updating the highlight.',
        duration: 2,
      });
      console.error("Error updating highlight:", error.message);
    }
  };

  function openModal() {
    resetData();
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const openEditModal = (highlightItem) => {
    setEditingHighlightId(highlightItem._id);
    setEditingHighlightData({
      highlight_Point: highlightItem.highlight_Point || "",
    });
    setEditFormOpen(true);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEditingHighlightId(null);
    setEditingHighlightData({
      highlight_Point: "",
    });
  };

  const handleDeleteUser = async (_id) => {
    messageApi.open({
      key: "deletingHighlight",
      type: 'loading',
      content: 'Deleting highlight...',
    });

    try {
      const response = await api100acress.delete(`/highlight/delete/${_id}`);
      if (response.status >= 200 && response.status < 300) {
        messageApi.destroy('deletingHighlight');
        messageApi.open({
          type: 'success',
          content: 'Highlight deleted successfully!',
          duration: 2,
        });
        ViewHighLights();
      } else {
        messageApi.destroy('deletingHighlight');
        messageApi.open({
          type: 'error',
          content: 'Failed to delete highlight. Server returned an error.',
          duration: 2,
        });
        console.error("Failed to delete highlight. Server returned an error.");
      }
    } catch (error) {
      messageApi.destroy('deletingHighlight');
      messageApi.open({
        type: 'error',
        content: 'An error occurred while deleting highlight.',
        duration: 2,
      });
      console.error("An error occurred while deleting highlight:", error.message);
    }
  };

  const handleDeleteButtonClick = (_id) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this highlight?"
    );
    if (confirmDeletion) {
      handleDeleteUser(_id);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        {contextHolder}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Highlights</span>
                  <span className="hidden lg:inline">Project Highlights</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <MdStar className="text-3xl text-yellow-500 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Project Highlights</h2>
              </div>
              <Tippy content={<span>Add new highlight</span>} animation="scale" theme="light-border">
                <button
                  onClick={openModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  type="button"
                >
                  <MdAddCircle className="text-xl" /> Add Highlights
                </button>
              </Tippy>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-l-4 border-yellow-400 mb-10">
          <div className="flex items-center gap-2 px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-xl">
            <MdTableRows className="text-2xl text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex-1 text-left">Highlights List</h2>
          </div>
          <div className="overflow-x-hidden sm:overflow-x-auto p-4 sm:p-8">
            <table className="w-full table-fixed sm:table-auto divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">S No.</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Highlight Points</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(() => {
                  const list = Array.isArray(viewAll) ? viewAll : [];
                  return list.length > 0 ? (
                    list.map((item, index) => {
                      const id1 = item._id;
                      return (
                        <tr
                          key={index}
                          className="group even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-800 dark:text-gray-300 max-w-[180px] sm:max-w-lg">
                            <span className="block truncate whitespace-nowrap sm:whitespace-normal">
                              {item.highlight_Point}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center text-sm font-medium">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              <Tippy content={<span>Edit highlight</span>} animation="scale" theme="light-border">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(item)}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 group"
                                >
                                  <MdEdit className="text-lg group-hover:animate-bounce" /> Edit
                                </button>
                              </Tippy>
                              <Tippy content={<span>Delete highlight</span>} animation="scale" theme="light-border">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteButtonClick(id1)}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 group"
                                >
                                  <MdDelete className="text-lg group-hover:animate-pulse" /> Delete
                                </button>
                              </Tippy>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <MdTableRows className="text-4xl text-gray-300 dark:text-gray-600 mb-2 animate-pulse" />
                          No highlights found.
                        </div>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customModalStyles}
              contentLabel="Add Highlights"
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
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-wide flex-1 text-left">Add Highlights</h2>
                  {modalSectionOpen ? <MdExpandLess className="text-2xl text-white transition-transform duration-300" /> : <MdExpandMore className="text-2xl text-white transition-transform duration-300" />}
                </button>
                <div
                  id="modal-form-section"
                  className={`transition-all duration-300 ${modalSectionOpen ? 'max-h-[1000px] opacity-100 p-4 sm:p-8' : 'max-h-0 opacity-0 p-0'}`}
                  style={{ willChange: 'max-height, opacity, padding' }}
                  aria-hidden={!modalSectionOpen}
                >
                  <form onSubmit={submitAddHighlight} className="space-y-5">
                <div>
                  <label htmlFor="highlight_Point" className="sr-only">Highlight Point</label>
                  <Tippy content={<span>Enter the highlight point (e.g., "Near Metro Station")</span>} animation="scale" theme="light-border">
                    <textarea
                      id="highlight_Point"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-blue-500 focus:ring-1 shadow-sm transition duration-200 min-h-[100px]"
                      placeholder="Add Highlight Point"
                      name="highlight_Point"
                      value={highlights.highlight_Point}
                      onChange={handleHighlightChange}
                      required
                    ></textarea>
                  </Tippy>
                </div>

                <Tippy content={<span>Insert new highlight</span>} animation="scale" theme="light-border">
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

            <Modal
              isOpen={editModalIsOpen}
              onRequestClose={closeEditModal}
              style={customModalStyles}
              contentLabel="Edit Highlight"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl">
                <button
                  className="w-full flex items-center gap-2 bg-green-600 dark:bg-green-700 rounded-t-xl px-6 py-4 text-center text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  onClick={() => setEditFormOpen((open) => !open)}
                  aria-expanded={editFormOpen}
                  aria-controls="edit-form-section"
                  type="button"
                  style={{ borderBottomLeftRadius: editFormOpen ? 0 : '0.75rem', borderBottomRightRadius: editFormOpen ? 0 : '0.75rem' }}
                >
                  <MdEdit className={`text-2xl transition-transform duration-300 ${editFormOpen ? 'rotate-0' : 'rotate-90 scale-110'}`} />
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-wide flex-1 text-left">Edit Highlight</h2>
                  {editFormOpen ? <MdExpandLess className="text-2xl text-white transition-transform duration-300" /> : <MdExpandMore className="text-2xl text-white transition-transform duration-300" />}
                </button>
                <div
                  id="edit-form-section"
                  className={`transition-all duration-300 ${editFormOpen ? 'max-h-[1000px] opacity-100 p-4 sm:p-8' : 'max-h-0 opacity-0 p-0'}`}
                  style={{ willChange: 'max-height, opacity, padding' }}
                  aria-hidden={!editFormOpen}
                >
                  <form onSubmit={submitEditHighlight} className="space-y-5">
                <div>
                  <label htmlFor="edit_highlight_Point" className="sr-only">Highlight Point</label>
                  <Tippy content={<span>Edit the highlight point</span>} animation="scale" theme="light-border">
                    <textarea
                      id="edit_highlight_Point"
                      className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:text-white px-4 py-2 outline-none ring-green-500 focus:ring-1 shadow-sm transition duration-200 min-h-[100px]"
                      placeholder="Edit Highlight Point"
                      name="highlight_Point"
                      value={editingHighlightData.highlight_Point}
                      onChange={handleEditHighlightChange}
                      required
                    ></textarea>
                  </Tippy>
                </div>

                <Tippy content={<span>Update highlight</span>} animation="scale" theme="light-border">
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
        </main>
      </div>
    </div>
  );
};

export default ProjectAddHighlights;
