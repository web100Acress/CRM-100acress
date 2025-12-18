import React, { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api100acress from "../config/api100acressClient"; 
import { message, Modal, notification } from "antd";
import { MdSearch, MdVisibility, MdEdit, MdDelete, MdExpandMore, MdExpandLess } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const ViewPropertyAdmin = () => {
  const [viewProperty, setViewAllProperty] = useState([]);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [tableOpen, setTableOpen] = useState(true);
  const [deletingUser, setDeletingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [mobileDetailsItem, setMobileDetailsItem] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loadingPropertyDetails, setLoadingPropertyDetails] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    propertyType: "",
    propertyName: "",
    frontImage: null,
    otherImage: [],
    address: "",
    city: "",
    state: "",
    price: "",
    area: "",
    descripation: "",
    landMark: "",
    amenities: [],
    builtYear: "",
    furnishing: "",
    type: "",
    availableDate: "",
    propertyLooking: "",
    subType: "",
    verify: "unverified",
  });
  const [editingLoading, setEditingLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEmbed = useMemo(() => {
    try {
      const sp = new URLSearchParams(location.search);
      return sp.get('embed') === '1';
    } catch {
      return false;
    }
  }, [location.search]);

  const filteredRows = viewProperty.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (item.propertyName || '').toLowerCase().includes(lowerSearch) ||
      (item.propertyType || '').toLowerCase().includes(lowerSearch) ||
      (item.city || '').toLowerCase().includes(lowerSearch)
    );
  });

  const currentRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const paginate = (page) => setCurrentPage(page);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openMobileDetails = (item) => {
    setMobileDetailsItem(item || null);
    setMobileDetailsOpen(true);
  };

  const closeMobileDetails = () => {
    setMobileDetailsOpen(false);
    setMobileDetailsItem(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        messageApi.error('User ID is missing from URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Fetching property data for user ID:', id);
        
        const myToken = localStorage.getItem("myToken");
        const crmToken = localStorage.getItem("token");
        
        console.log('🔑 Tokens available:', {
          myToken: myToken ? 'Yes' : 'No',
          crmToken: crmToken ? 'Yes' : 'No'
        });

        if (!myToken && !crmToken) {
          messageApi.error('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }

        // Use 100acress client - it will automatically add Authorization header
        try {
          console.log('🌐 Calling endpoint: /postPerson/propertyView/:id');
          const res = await api100acress.get(`/postPerson/propertyView/${id}`);
          
          console.log('✅ API Response:', res.data);
          
          // Handle different response structures
          const responseData = res.data?.data || res.data || res;
          
          // Extract user details
          if (responseData.name || responseData.email || responseData.mobile) {
            setUserDetails({
              name: responseData.name || "N/A",
              email: responseData.email || "N/A",
              mobile: responseData.mobile || "N/A",
            });
          }
          
          // Extract properties array
          const properties = responseData.postProperty || 
                           responseData.properties || 
                           responseData.postProperties ||
                           (Array.isArray(responseData) ? responseData : []);
          
          console.log('📦 Properties found:', properties.length);
          
          if (properties.length > 0) {
            setViewAllProperty(properties);
            messageApi.success(`Loaded ${properties.length} property/properties successfully!`);
          } else {
            setViewAllProperty([]);
            messageApi.info('No properties found for this user.');
          }
          
        } catch (apiError) {
          console.error('❌ API Error:', apiError);
          
          if (apiError.response?.status === 401) {
            messageApi.error('Authentication failed. Please login again.');
          } else if (apiError.response?.status === 404) {
            messageApi.warning('User not found in 100acress backend.');
            setUserDetails({
              name: "User Not Found",
              email: "N/A",
              mobile: "N/A"
            });
            setViewAllProperty([]);
          } else {
            messageApi.error(apiError.response?.data?.message || 'Failed to load property data. Please try again.');
          }
        }
        
      } catch (error) {
        console.error("❌ Critical error fetching data:", error);
        messageApi.error('Critical error loading data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, messageApi]);

  const handleViewProperty = async (propertyId) => {
    try {
      setLoadingPropertyDetails(true);
      setSelectedProperty(propertyId);
      
      // Fetch property details - same as ViewDetails component
      const res = await api100acress.get(`/postPerson/propertyoneView/${propertyId}`);
      
      // Extract the first property from postProperty array
      const propertyData = res.data?.data?.postProperty?.[0];
      
      if (propertyData) {
        setPropertyDetails(propertyData);
        setViewModalVisible(true);
      } else {
        messageApi.warning('No property data received from server');
      }
    } catch (error) {
      console.error('❌ Error fetching property details:', error);
      messageApi.error(error.response?.data?.message || 'Failed to load property details');
    } finally {
      setLoadingPropertyDetails(false);
    }
  };

  const handleCloseModal = () => {
    setViewModalVisible(false);
    setSelectedProperty(null);
    setPropertyDetails(null);
  };

  const handleEditProperty = async (propertyId) => {
    try {
      setEditingLoading(true);
      setEditingPropertyId(propertyId);
      
      // Fetch property details for editing
      const res = await api100acress.get(`/postPerson/propertyoneView/${propertyId}`);
      const propertyData = res.data?.data?.postProperty?.[0];
      
      if (propertyData) {
        // Normalize the data for the edit form
        setEditFormData({
          propertyType: propertyData.propertyType || "",
          propertyName: propertyData.propertyName || "",
          frontImage: propertyData.frontImage || null,
          otherImage: Array.isArray(propertyData.otherImage) ? propertyData.otherImage : [],
          address: propertyData.address || "",
          city: propertyData.city || "",
          state: propertyData.state || "",
          price: propertyData.price || "",
          area: propertyData.area || "",
          descripation: propertyData.descripation || "",
          landMark: propertyData.landMark || "",
          amenities: propertyData.amenities || [],
          builtYear: propertyData.builtYear || "",
          furnishing: propertyData.furnishing || "",
          type: propertyData.type || "",
          availableDate: propertyData.availableDate || "",
          propertyLooking: propertyData.propertyLooking || "",
          subType: propertyData.subType || "",
          verify: propertyData.verify || "unverified",
        });
        setEditModalVisible(true);
      } else {
        messageApi.warning('No property data received from server');
      }
    } catch (error) {
      console.error('❌ Error fetching property for edit:', error);
      messageApi.error(error.response?.data?.message || 'Failed to load property for editing');
    } finally {
      setEditingLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingPropertyId(null);
    setEditFormData({
      propertyType: "",
      propertyName: "",
      frontImage: null,
      otherImage: [],
      address: "",
      city: "",
      state: "",
      price: "",
      area: "",
      descripation: "",
      landMark: "",
      amenities: [],
      builtYear: "",
      furnishing: "",
      type: "",
      availableDate: "",
      propertyLooking: "",
      subType: "",
      verify: "unverified",
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProperty = async () => {
    try {
      setEditingLoading(true);
      messageApi.open({
        key: 'updateProperty',
        type: 'loading',
        content: 'Updating property...',
      });

      const formData = new FormData();
      
      // Append all fields
      for (const key in editFormData) {
        if (editFormData[key] !== undefined && editFormData[key] !== null && key !== 'frontImage' && key !== 'otherImage') {
          formData.append(key, editFormData[key]);
        }
      }

      // Append front image if it's a file
      if (editFormData.frontImage && editFormData.frontImage.file) {
        formData.append('frontImage', editFormData.frontImage.file);
      }

      // Append other images if they are files
      if (Array.isArray(editFormData.otherImage)) {
        editFormData.otherImage.forEach((img) => {
          if (img && img.file) {
            formData.append('otherImage', img.file);
          }
        });
      }

      const res = await api100acress.post(`/postPerson/propertyoneUpdate/${editingPropertyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 200) {
        messageApi.destroy('updateProperty');
        messageApi.success('Property updated successfully');
        
        // Refresh the property list
        setViewAllProperty(prev => prev.map(p => p._id === editingPropertyId ? { ...p, ...editFormData } : p));
        
        handleCloseEditModal();
      }
    } catch (error) {
      console.error('❌ Error updating property:', error);
      messageApi.destroy('updateProperty');
      messageApi.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setEditingLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    messageApi.open({ key: 'deleteProp', type: 'loading', content: 'Deleting property...' });
    try {
      const res = await api100acress.delete(`/postPerson/propertyDelete/${propertyId}`);
      if (res.status >= 200 && res.status < 300) {
        messageApi.destroy('deleteProp');
        messageApi.success('Property deleted successfully');
        setViewAllProperty(prev => prev.filter(p => p._id !== propertyId));
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
      messageApi.destroy('deleteProp');
      messageApi.error(err.response?.data?.message || 'Error deleting property');
    }
  };

  const handleDeleteUser = async () => {
    if (deletingUser) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete this user?\n\nUser: ${userDetails.name}\nEmail: ${userDetails.email}\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      messageApi.info('Deletion cancelled.', 2);
      return;
    }

    setDeletingUser(true);
    messageApi.open({ key: 'deleteUser', type: 'loading', content: 'Deleting user...', duration: 0 });
    try {
      const myToken = localStorage.getItem('myToken');
      if (!myToken) {
        messageApi.destroy('deleteUser');
        notification.error({ 
          message: 'Auth error', 
          description: 'Authentication token not found. Please login again.', 
          placement: 'topRight' 
        });
        setDeletingUser(false);
        return;
      }

      let deleteSuccess = false;
      try {
        const res = await api100acress.delete(`/postPerson/deleteUser/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        });
        deleteSuccess = res.status >= 200 && res.status < 300;
      } catch (endpointError) {
        console.log('❌ Delete failed:', endpointError.response?.status || endpointError.message);
        messageApi.error(endpointError?.response?.data?.message || 'Delete request failed', 2);
      }

      messageApi.destroy('deleteUser');
      if (deleteSuccess) {
        notification.success({ 
          message: 'User deleted', 
          description: 'The user was deleted successfully.', 
          placement: 'topRight' 
        });
        messageApi.success('User deleted successfully.', 2);
        setTimeout(() => {
          navigate('/admin/user-management');
        }, 1500);
      } else {
        notification.error({ 
          message: 'Delete failed', 
          description: 'Backend did not confirm deletion. Please try again or check server logs.', 
          placement: 'topRight' 
        });
        messageApi.error('Delete failed. Please try again.', 2);
      }
    } catch (err) {
      console.error('❌ Critical delete error:', err);
      messageApi.destroy('deleteUser');
      notification.error({ 
        message: 'Delete failed', 
        description: 'Critical error during deletion. Please try again.', 
        placement: 'topRight' 
      });
      messageApi.error('Critical error during deletion.', 2);
    } finally {
      setDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <>
        {contextHolder}
        <div className="flex bg-gray-50 min-h-screen">
          {!isEmbed && <AdminSidebar />}
          <div className={isEmbed ? "flex-1 p-4 overflow-auto" : "flex-1 p-8 ml-0 overflow-auto"}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="flex bg-gray-50 min-h-screen overflow-x-hidden">
        {/* {!isEmbed && <AdminSidebar />} */}
        <div className={isEmbed ? "flex-1 p-4 overflow-auto overflow-x-hidden" : "flex-1 p-8 ml-0 overflow-auto overflow-x-hidden"}>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="relative w-full sm:max-w-lg">
                <Tippy content={<span>Search by name, type, city</span>} animation="scale">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm sm:text-base"
                  />
                </Tippy>
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
             
            </div>

            {viewProperty.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-red-500">
                <div className="text-center py-8">
                  <p className="text-xl font-semibold text-gray-700 mb-4">No properties found for this user.</p>
                  <Link 
                    to={`/admin/add-property/${id}`}
                    className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  >
                    Add First Property
                  </Link>
                </div>
              </div>
            )}

            {/* Property Table - Only show if properties exist */}
            {viewProperty.length > 0 && (
              <div className="bg-white p-1 sm:p-2 rounded-xl shadow-md border-l-4 border-red-500">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <h2 className="text-base sm:text-xl font-bold">
                    Properties Table 
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({viewProperty.length} {viewProperty.length === 1 ? 'property' : 'properties'})
                    </span>
                  </h2>
                  <button 
                    onClick={() => setTableOpen(!tableOpen)} 
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    {tableOpen ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
                  </button>
                </div>
              
                {tableOpen && (
                  <>
                    <div className="overflow-x-auto max-w-full">
                      <div className="w-full min-w-0 px-0">
                        <table className="min-w-full table-fixed">
                          <thead className="bg-gray-100">
                            <tr className="text-xs sm:text-sm">
                              <th className="px-2 sm:px-4 py-2 text-left w-10 hidden sm:table-cell">#</th>
                              <th className="px-2 sm:px-4 py-2 text-left w-24 hidden sm:table-cell">Type</th>
                              <th className="px-1 sm:px-3 py-2 text-left w-44 hidden sm:table-cell">Name</th>
                              <th className="px-1 sm:px-2 py-2 text-left w-20 hidden sm:table-cell">City</th>
                              <th className="px-1 sm:px-2 py-2 text-left w-24 sm:w-28">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs sm:text-sm">
                            {currentRows.map((item, index) => (
                              <tr key={item._id || index} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                                <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">{item.propertyType || 'N/A'}</td>
                                <td className="px-1 sm:px-3 py-2 truncate hidden sm:table-cell" title={item.propertyName || 'N/A'}>
                                  {item.propertyName || 'N/A'}
                                </td>
                                <td className="px-1 sm:px-2 py-2 hidden sm:table-cell truncate" title={item.city || 'N/A'}>{item.city || 'N/A'}</td>
                                <td className="px-1 sm:px-2 py-2 text-left">
                                  <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1.5 sm:gap-1">
                                    <button
                                      type="button"
                                      onClick={() => openMobileDetails(item)}
                                      className="sm:hidden inline-flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded transition-colors text-xs font-semibold w-20"
                                    >
                                      Details
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleViewProperty(item._id)}
                                      disabled={loadingPropertyDetails}
                                      className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold w-20 sm:w-auto"
                                    >
                                      <MdVisibility className="inline mr-1" /> View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditProperty(item._id)}
                                      disabled={editingLoading}
                                      className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold w-20 sm:w-auto"
                                    >
                                      <MdEdit className="inline mr-1" /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProperty(item._id)}
                                      className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors text-xs font-semibold w-20 sm:w-auto"
                                    >
                                      <MdDelete className="inline mr-1" /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                      {/* Pagination */}
                      {Math.ceil(filteredRows.length / rowsPerPage) > 1 && (
                        <div className="flex justify-center mt-4 sm:mt-6 flex-wrap gap-1.5 sm:gap-2 px-2 sm:px-0">
                          {Array.from({ length: Math.ceil(filteredRows.length / rowsPerPage) }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => paginate(i + 1)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded border transition-colors text-xs sm:text-sm ${
                                currentPage === i + 1 
                                  ? 'bg-red-500 text-white border-red-500' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Property Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MdEdit className="text-yellow-500" size={24} />
            <span className="text-xl font-bold">Edit Property</span>
          </div>
        }
        open={editModalVisible}
        onCancel={handleCloseEditModal}
        footer={[
          <button
            key="cancel"
            onClick={handleCloseEditModal}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>,
          <button
            key="update"
            onClick={handleUpdateProperty}
            disabled={editingLoading}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {editingLoading ? 'Updating...' : 'Update'}
          </button>
        ]}
        width={900}
        centered
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Images Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Front Image */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Front Image</label>
                <div className="flex items-center justify-center h-40 w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200 mb-3">
                  {editFormData.frontImage && editFormData.frontImage.url ? (
                    <img 
                      src={editFormData.frontImage.url} 
                      alt="Front" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Front Image</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleEditFormChange('frontImage', {
                          url: event.target.result,
                          file: file
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>

              {/* Other Images */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Other Images</label>
                <div className="flex flex-wrap gap-2 mb-3 max-h-40 overflow-y-auto">
                  {editFormData.otherImage && Array.isArray(editFormData.otherImage) && editFormData.otherImage.length > 0 ? (
                    editFormData.otherImage.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url || img}
                          alt={`Image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditFormData(prev => ({
                              ...prev,
                              otherImage: prev.otherImage.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No Other Images</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      const newImages = files.map((file) => {
                        const reader = new FileReader();
                        let url = '';
                        reader.onload = (event) => {
                          url = event.target.result;
                        };
                        reader.readAsDataURL(file);
                        return { url: '', file };
                      });
                      
                      // Process files with proper async handling
                      Promise.all(files.map(file => {
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            resolve({ url: event.target.result, file });
                          };
                          reader.readAsDataURL(file);
                        });
                      })).then((processedImages) => {
                        setEditFormData(prev => ({
                          ...prev,
                          otherImage: [...(prev.otherImage || []), ...processedImages]
                        }));
                      });
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>
            </div>
            {/* Property Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Property Name</label>
              <input
                type="text"
                value={editFormData.propertyName}
                onChange={(e) => handleEditFormChange('propertyName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Property Type</label>
              <input
                type="text"
                value={editFormData.propertyType}
                onChange={(e) => handleEditFormChange('propertyType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">City</label>
                <input
                  type="text"
                  value={editFormData.city}
                  onChange={(e) => handleEditFormChange('city', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">State</label>
                <input
                  type="text"
                  value={editFormData.state}
                  onChange={(e) => handleEditFormChange('state', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Price & Area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Price</label>
                <input
                  type="text"
                  value={editFormData.price}
                  onChange={(e) => handleEditFormChange('price', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Area (sq.ft)</label>
                <input
                  type="text"
                  value={editFormData.area}
                  onChange={(e) => handleEditFormChange('area', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            {/* LandMark & Built Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">LandMark</label>
                <input
                  type="text"
                  value={editFormData.landMark}
                  onChange={(e) => handleEditFormChange('landMark', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Built Year</label>
                <input
                  type="text"
                  value={editFormData.builtYear}
                  onChange={(e) => handleEditFormChange('builtYear', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Furnishing & Available Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Furnishing</label>
                <input
                  type="text"
                  value={editFormData.furnishing}
                  onChange={(e) => handleEditFormChange('furnishing', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Available Date</label>
                <input
                  type="text"
                  value={editFormData.availableDate}
                  onChange={(e) => handleEditFormChange('availableDate', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Type & Property Looking */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Type</label>
                <input
                  type="text"
                  value={editFormData.type}
                  onChange={(e) => handleEditFormChange('type', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Property Looking</label>
                <input
                  type="text"
                  value={editFormData.propertyLooking}
                  onChange={(e) => handleEditFormChange('propertyLooking', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
              <textarea
                value={editFormData.descripation}
                onChange={(e) => handleEditFormChange('descripation', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                rows="3"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* View Property Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MdVisibility className="text-blue-500" size={24} />
            <span className="text-xl font-bold">Property Details</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <button
            key="close"
            onClick={handleCloseModal}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        ]}
        width={800}
        centered
      >
        {loadingPropertyDetails ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        ) : propertyDetails ? (
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Property Images */}
              {((propertyDetails.frontImage && propertyDetails.frontImage.url) || 
                (propertyDetails.otherImage && propertyDetails.otherImage.length > 0) ||
                (propertyDetails.image && propertyDetails.image.length > 0) || 
                (propertyDetails.images && propertyDetails.images.length > 0) ||
                propertyDetails.imageUrl ||
                propertyDetails.mainImage) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Property Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Front Image */}
                    {propertyDetails.frontImage && propertyDetails.frontImage.url && (
                      <div className="relative group">
                        <img
                          src={propertyDetails.frontImage.url}
                          alt="Front Image"
                          className="w-full h-48 object-cover rounded-lg border shadow-md transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                          onLoad={(e) => {
                            e.target.style.opacity = '1';
                          }}
                          style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                      </div>
                    )}
                    
                    {/* Other Images */}
                    {propertyDetails.otherImage && Array.isArray(propertyDetails.otherImage) && propertyDetails.otherImage.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url || img}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg border shadow-md transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                          onLoad={(e) => {
                            e.target.style.opacity = '1';
                          }}
                          style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                      </div>
                    ))}
                    
                    {/* Fallback: image/images array */}
                    {!(propertyDetails.frontImage || propertyDetails.otherImage) && (propertyDetails.image || propertyDetails.images || []).map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url || img.src || img}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg border shadow-md transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                          onLoad={(e) => {
                            e.target.style.opacity = '1';
                          }}
                          style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Images Available */}
              {!(propertyDetails.frontImage || propertyDetails.otherImage || propertyDetails.image || propertyDetails.images || propertyDetails.imageUrl || propertyDetails.mainImage) && (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No images available for this property</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Property Name</label>
                  <p className="text-lg font-medium">{propertyDetails.propertyName || propertyDetails.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Property Type</label>
                  <p className="text-lg font-medium">{propertyDetails.propertyType || propertyDetails.type || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">City</label>
                  <p className="text-lg font-medium">{propertyDetails.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">State</label>
                  <p className="text-lg font-medium">{propertyDetails.state || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Price</label>
                  <p className="text-lg font-semibold text-red-600">
                    {propertyDetails.price ? `₹${propertyDetails.price.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Area</label>
                  <p className="text-lg font-medium">{propertyDetails.area ? `${propertyDetails.area} sq.ft` : 'N/A'}</p>
                </div>
              </div>

              {/* Address */}
              {(propertyDetails.address || propertyDetails.landMark) && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Address</label>
                  <p className="text-lg">{propertyDetails.address || propertyDetails.landMark || 'N/A'}</p>
                </div>
              )}

              {/* Description */}
              {propertyDetails.descripation && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-lg text-gray-700 whitespace-pre-wrap">{propertyDetails.descripation}</p>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4">
                {propertyDetails.bedrooms && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Bedrooms</label>
                    <p className="text-lg">{propertyDetails.bedrooms}</p>
                  </div>
                )}
                {propertyDetails.bathrooms && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Bathrooms</label>
                    <p className="text-lg">{propertyDetails.bathrooms}</p>
                  </div>
                )}
                {propertyDetails.parking && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Parking</label>
                    <p className="text-lg">{propertyDetails.parking}</p>
                  </div>
                )}
                {propertyDetails.floor && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Floor</label>
                    <p className="text-lg">{propertyDetails.floor}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Built Year</label>
                  <p className="text-lg">{propertyDetails.builtYear || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Furnishing</label>
                  <p className="text-lg">{propertyDetails.furnishing || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Available Date</label>
                  <p className="text-lg">{propertyDetails.availableDate || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Type</label>
                  <p className="text-lg">{propertyDetails.type || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Select Property Type</label>
                  <p className="text-lg">{propertyDetails.selectPropertyType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">LandMark</label>
                  <p className="text-lg">{propertyDetails.landMark || 'N/A'}</p>
                </div>
              </div>

              {/* Project Description */}
              {propertyDetails.projectDescription && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Project Description</label>
                  <p className="text-lg text-gray-700 whitespace-pre-wrap">{propertyDetails.projectDescription}</p>
                </div>
              )}

              {/* Amenities */}
              {(propertyDetails.amenities || propertyDetails.Amenities) && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Amenities</label>
                  <p className="text-lg text-gray-700">
                    {propertyDetails.amenities || propertyDetails.Amenities || 'No Amenities'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No property details available.</p>
          </div>
        )}
      </Modal>

      <Modal
        open={mobileDetailsOpen}
        onCancel={closeMobileDetails}
        footer={null}
        centered
        width={420}
      >
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-base font-bold text-gray-900">Property Details</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">Type</p>
              <p className="text-sm font-medium text-gray-900">{mobileDetailsItem?.propertyType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-900 break-words">{mobileDetailsItem?.propertyName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">City</p>
              <p className="text-sm font-medium text-gray-900">{mobileDetailsItem?.city || 'N/A'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (mobileDetailsItem?._id) handleViewProperty(mobileDetailsItem._id);
                closeMobileDetails();
              }}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <MdVisibility className="mr-1" /> View
            </button>
            <button
              type="button"
              onClick={() => {
                if (mobileDetailsItem?._id) handleEditProperty(mobileDetailsItem._id);
                closeMobileDetails();
              }}
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <MdEdit className="mr-1" /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (mobileDetailsItem?._id) handleDeleteProperty(mobileDetailsItem._id);
                closeMobileDetails();
              }}
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <MdDelete className="mr-1" /> Delete
            </button>
          </div>
        </div>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ViewPropertyAdmin;

