import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useParams, Link, useNavigate } from "react-router-dom";
import api100acress from "../config/api100acressClient"; // Use 100acress client, not CRM client
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
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loadingPropertyDetails, setLoadingPropertyDetails] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

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
      
      // Fetch property details
      const res = await api100acress.get(`/postPerson/propertyoneView/${propertyId}`);
      
      console.log('✅ Property details:', res.data);
      
      const propertyData = res.data?.data || res.data || res;
      setPropertyDetails(propertyData);
      setViewModalVisible(true);
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
        <AdminSidebar />
        <div className="flex bg-gray-50 min-h-screen">
          <div className="flex-1 p-8 ml-64 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Loading property data...</p>
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
      <AdminSidebar />
      <div className="flex bg-gray-50 min-h-screen">
        <div className="flex-1 p-8 ml-64 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-lg">
                <Tippy content={<span>Search by name, type, city</span>} animation="scale">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </Tippy>
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
              </div>
              <Link 
                to={`/admin/add-property/${id}`}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Property
              </Link>
            </div>

            {/* User Info */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 flex justify-between items-center">
              <div>
                <p className="text-lg"><b>Name:</b> {userDetails.name}</p>
                <p className="text-lg"><b>Mobile:</b> {userDetails.mobile}</p>
                <p className="text-lg"><b>Email:</b> {userDetails.email}</p>
              </div>
              <button
                onClick={handleDeleteUser}
                disabled={deletingUser}
                className={`px-5 py-2 ${deletingUser ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white rounded-full shadow transition-colors duration-200`}
                title="Delete user (backend support may be limited)"
              >
                <MdDelete className="inline mr-1" /> Delete User
              </button>
            </div>

            {/* Empty State Message - Display above table if no properties */}
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
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    Properties Table 
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({viewProperty.length} {viewProperty.length === 1 ? 'property' : 'properties'})
                    </span>
                  </h2>
                  <button 
                    onClick={() => setTableOpen(!tableOpen)} 
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    {tableOpen ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                  </button>
                </div>
              
                {tableOpen && (
                  <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left">#</th>
                              <th className="px-4 py-2 text-left">Type</th>
                              <th className="px-4 py-2 text-left">Name</th>
                              <th className="px-4 py-2 text-left">City</th>
                              <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentRows.map((item, index) => (
                              <tr key={item._id || index} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                                <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                <td className="px-4 py-2">{item.propertyType || 'N/A'}</td>
                                <td className="px-4 py-2">{item.propertyName || 'N/A'}</td>
                                <td className="px-4 py-2">{item.city || 'N/A'}</td>
                                <td className="px-4 py-2 text-center space-x-2">
                                  <button 
                                    onClick={() => handleViewProperty(item._id)}
                                    disabled={loadingPropertyDetails}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <MdVisibility className="inline mr-1" /> View
                                  </button>
                                  <Link to={`/admin/edit-property/${item._id}`}>
                                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors">
                                      <MdEdit className="inline mr-1" /> Edit
                                    </button>
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteProperty(item._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                                  >
                                    <MdDelete className="inline mr-1" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {Math.ceil(filteredRows.length / rowsPerPage) > 1 && (
                        <div className="flex justify-center mt-6 flex-wrap gap-2">
                          {Array.from({ length: Math.ceil(filteredRows.length / rowsPerPage) }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => paginate(i + 1)}
                              className={`px-4 py-2 rounded border transition-colors ${
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
              {propertyDetails.image && propertyDetails.image.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {propertyDetails.image.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url || img}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Property Name</label>
                  <p className="text-lg">{propertyDetails.propertyName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Property Type</label>
                  <p className="text-lg">{propertyDetails.propertyType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">City</label>
                  <p className="text-lg">{propertyDetails.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">State</label>
                  <p className="text-lg">{propertyDetails.state || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Price</label>
                  <p className="text-lg font-semibold text-red-600">
                    {propertyDetails.price ? `₹${propertyDetails.price.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Area</label>
                  <p className="text-lg">{propertyDetails.area ? `${propertyDetails.area} sq.ft` : 'N/A'}</p>
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
              </div>

              {/* Contact Information */}
              {(propertyDetails.mobile || propertyDetails.email) && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {propertyDetails.mobile && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Mobile</label>
                        <p className="text-lg">{propertyDetails.mobile}</p>
                      </div>
                    )}
                    {propertyDetails.email && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <p className="text-lg">{propertyDetails.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No property details available</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewPropertyAdmin;

