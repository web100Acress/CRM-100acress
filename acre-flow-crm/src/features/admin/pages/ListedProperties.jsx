import React, { useCallback, useEffect, useState, useMemo, memo } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import api100acress from "../config/api100acressClient"; // For 100acress backend
import AdminSidebar from "../components/AdminSidebar";

import { Eye, Edit, Trash2, LogOut, ChevronDown, User, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
   // Assuming this path is correct and the component is structured to receive classes
import { Modal, message } from "antd"; // Import message from antd

// Simple Pagination Component
const PaginationControls = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Previous
      </button>
      
      <span className="text-gray-700 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

// Memoized Property Row Component
const PropertyRow = memo(({ property, onDelete }) => (
  <tr className="even:bg-gray-50 hover:bg-blue-50 transition-colors">
    <td className="px-4 py-4 border-b border-gray-200 align-top">
      <div className="w-[120px] h-[80px] overflow-hidden rounded-lg shadow-md">
        <LazyLoadImage
          src={property?.frontImage?.url || "https://via.placeholder.com/150x100?text=No+Image"}
          alt={property?.propertyName || "Property Image"}
          effect="blur"
          className="w-full h-full object-cover block"
          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 100'%3E%3C/svg%3E"
        />
      </div>
    </td>
    <td className="px-4 py-4 border-b border-gray-200 align-top text-gray-800">
      <div className="font-semibold text-gray-800 break-words">
        {property.propertyName}
      </div>
      <div className="text-sm text-gray-500 break-words">
        {property.propertyType}
      </div>
    </td>
    <td className="px-4 py-4 border-b border-gray-200 align-top font-semibold text-green-600 whitespace-nowrap">
      {property?.price ? `₹${Number(property.price).toLocaleString('en-IN')}` : 'N/A'}
    </td>
    <td className="px-4 py-4 border-b border-gray-200 align-top text-gray-700 whitespace-normal break-words max-w-[250px]">
      {property?.address || 'N/A'}
    </td>
    <td className="px-4 py-4 border-b border-gray-200 align-top">
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          property?.propertyLooking?.toLowerCase() === 'rent'
            ? 'bg-sky-100 text-sky-600'
            : property?.propertyLooking?.toLowerCase() === 'sale'
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {property?.propertyLooking || 'N/A'}
      </span>
    </td>
    <td className="px-4 py-4 border-b border-gray-200 align-top text-gray-700 whitespace-nowrap">
      {property?.name || 'N/A'}
    </td>
    <td className="px-4 py-4 border-b border-gray-200 align-top">
      <div className="flex justify-end gap-2">
        <Link to={`/Admin/viewproperty/viewdetails/${property._id}`} title="View Details">
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors" type="button">
            <Eye size={18} />
          </button>
        </Link>
        <Link to={`/Admin/viewproperty/editdetails/${property._id}`} title="Edit Property">
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" type="button">
            <Edit size={18} />
          </button>
        </Link>
        <button
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Delete Property"
          onClick={() => onDelete(property._id)}
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </tr>
));

// Memoized Delete Confirmation Modal
const DeleteConfirmationModal = memo(({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  confirmLoading,
  text 
}) => (
  <Modal
    title="Confirm Deletion"
    open={isOpen}
    onOk={onConfirm}
    confirmLoading={confirmLoading}
    onCancel={onCancel}
    okText="Delete"
    cancelText="Cancel"
    maskClosable={false}
  >
    <p className="text-base text-gray-600 text-center">{text}</p>
  </Modal>
));

const AllListedProperties = () => {
  const tokenRaw = localStorage.getItem("myToken") || "";

  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
  const [allListedProperty, setAllListedProperty] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to delete this Property?');
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isVerified, setIsVerified] = useState('verified');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Memoize the token to prevent unnecessary re-renders
  const tokenRawMemo = useMemo(() => localStorage.getItem("myToken") || "", []);

  // Memoize the messageApi configuration
  const [messageApi, contextHolder] = message.useMessage();

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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await api100acress.get(
        `/postPerson/view/allListedProperty/?page=${currentPage}&limit=${pageLimit}&verify=${isVerified}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent hanging requests
          timeout: 10000
        }
      );
      
      if (res.status >= 200 && res.status < 300) {
        const root = res.data;
        const pageArr = Array.isArray(root?.data) ? root.data : [];
        const first = pageArr[0] || {};
        const list = Array.isArray(first?.data)
          ? first.data
          : Array.isArray(root?.data)
          ? root.data
          : [];
        const pages = Number(first?.totalPages || root?.totalPages || 0) || 0;
        
        // Use functional update to prevent race conditions
        setAllListedProperty(prev => 
          JSON.stringify(prev) !== JSON.stringify(list) ? list : prev
        );
        setTotalPages(pages);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error?.message || "An error occurred");
      messageApi.error("Failed to fetch properties. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageLimit, isVerified, messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showModal = () => {
    setOpenModal(true);
  };

  const handleOk = useCallback(async () => {
    if (!propertyToDelete) {
      messageApi.error('No property selected for deletion');
      return;
    }

    setModalText('Deleting property...');
    setConfirmLoading(true);

    try {
      const result = await handleDeleteProperty(propertyToDelete);
      if (result?.success) {
        messageApi.success(result.message || 'Property deleted successfully');
        // The fetchData() inside handleDeleteProperty will update the list
      } else {
        const errorMessage = result?.message || 'Failed to delete property';
        messageApi.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error in handleOk:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while deleting the property';
      messageApi.error(errorMessage);
    } finally {
      setModalText('Do you want to delete this Property?');
      setConfirmLoading(false);
      setOpenModal(false);
      setPropertyToDelete(null);
    }
  }, [propertyToDelete, messageApi]);

  const handleCancel = useCallback(() => {
    setOpenModal(false);
    setPropertyToDelete(null);
    setModalText('Do you want to delete this Property?');
  }, []);

  const handleDeleteProperty = useCallback(async (id) => {
    if (!id) {
      console.error("No property ID provided for deletion");
      return { success: false, message: "No property ID provided" };
    }

    try {
      console.log("Attempting to delete property with ID:", id);
      const base = getApiBase();
      const token = localStorage.getItem("myToken")?.replace(/^"/, '').replace(/"$/, '');
      
      if (!token) {
        console.error("No authentication token found");
        return { success: false, message: "Authentication required" };
      }

      const response = await axios.delete(
        `${base}/postPerson/propertyDelete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log("Delete response:", response.data);
      
      if (response.status >= 200 && response.status < 300) {
        // Refresh the properties list after successful deletion
        fetchData();
        return {
          success: true,
          message: "Property deleted successfully",
          data: response.data
        };
      }
      
      console.error("Delete failed with status:", response.status);
      return {
        success: false,
        message: response.data?.message || `Server returned status ${response.status}`,
        status: response.status
      };
      
    } catch (error) {
      console.error("Delete property error:", error);
      
      let errorMessage = "Failed to delete property";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
                      
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      } else {
        errorMessage = error.message || "An unknown error occurred";
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }, []);

  const handleDeleteButtonClicked = useCallback((id) => {
    setOpenModal(true);
    setPropertyToDelete(id);
    setModalText('Do you want to delete this Property?');
  }, []);

  // Memoize the DeleteConfirmationModal component with a different name
  const MemoizedDeleteConfirmationModal = useMemo(() => (
    <DeleteConfirmationModal
      isOpen={openModal}
      onConfirm={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      text={modalText}
    />
  ), [openModal, handleOk, handleCancel, confirmLoading, modalText]);

  // Memoize the filter controls to prevent re-renders
  const FilterControls = useMemo(() => (
    <div className="flex flex-wrap gap-3">
      <select
        value={pageLimit}
        onChange={(e) => {
          setPageLimit(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={10}>10 per page</option>
        <option value={25}>25 per page</option>
        <option value={50}>50 per page</option>
      </select>
      <select
        value={isVerified}
        onChange={(e) => {
          setIsVerified(e.target.value);
          setCurrentPage(1);
        }}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={'verified'}>Verified</option>
        <option value={'unverified'}>Unverified</option>
      </select>
    </div>
  ), [pageLimit, isVerified]);

  // Memoize the loading state
  const LoadingState = useMemo(() => (
    <tr>
      <td colSpan={7} className="p-10 text-center text-gray-600">
        <Oval
          height={50}
          width={50}
          color="#6c5ce7"
          ariaLabel="loading-indicator"
          wrapperClass="inline-flex justify-center"
          visible={true}
        />
        <p>Loading properties...</p>
      </td>
    </tr>
  ), []);

  // Memoize the empty state
  const EmptyState = useMemo(() => (
    <tr>
      <td colSpan={7} className="p-10 text-center text-gray-500">
        No properties found. Adjust filters or try again.
      </td>
    </tr>
  ), []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden font-sans">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        {contextHolder}

        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                <span className="lg:hidden">Properties</span>
                <span className="hidden lg:inline">Listed Properties</span>
              </h1>
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
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties Listed</h2>
              {FilterControls}
            </div>

            {MemoizedDeleteConfirmationModal}

            <div className="sm:hidden space-y-3">
              {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                  <div className="flex items-center justify-center">
                    <Oval height={50} width={50} color="#6c5ce7" ariaLabel="loading-indicator" visible={true} />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">Loading properties...</p>
                </div>
              ) : allListedProperty.length > 0 ? (
                allListedProperty.map((property) => (
                  <div key={property._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex gap-3">
                      <div className="w-24 h-16 overflow-hidden rounded-lg shadow-sm flex-shrink-0">
                        <LazyLoadImage
                          src={property?.frontImage?.url || "https://via.placeholder.com/150x100?text=No+Image"}
                          alt={property?.propertyName || "Property Image"}
                          effect="blur"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{property.propertyName}</p>
                        <p className="text-xs text-gray-500 truncate">{property.propertyType}</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          {property?.price ? `₹${Number(property.price).toLocaleString('en-IN')}` : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 break-words">{property?.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          property?.propertyLooking?.toLowerCase() === 'rent'
                            ? 'bg-sky-100 text-sky-600'
                            : property?.propertyLooking?.toLowerCase() === 'sale'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {property?.propertyLooking || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-600 truncate">{property?.name || 'N/A'}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Link to={`/Admin/viewproperty/viewdetails/${property._id}`} title="View Details">
                        <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors" type="button">
                          <Eye size={18} />
                        </button>
                      </Link>
                      <Link to={`/Admin/viewproperty/editdetails/${property._id}`} title="Edit Property">
                        <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" type="button">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Property"
                        onClick={() => handleDeleteButtonClicked(property._id)}
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                  <p className="text-sm text-gray-600">No properties found. Adjust filters or try again.</p>
                </div>
              )}
            </div>

            <div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-separate border-spacing-0">
                  <thead className="bg-gradient-to-r from-gray-50 to-slate-100 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Front Image</th>
                      <th scope="col" className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Property Name</th>

                      <th scope="col" className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Price</th>
                      <th scope="col" className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Address</th>
                      <th scope="col" className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Rent/Sale</th>
                      <th scope="col" className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Posted By</th>
                      <th scope="col" className="px-4 py-4 text-right text-xs font-bold tracking-wider uppercase text-slate-600 border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      LoadingState
                    ) : allListedProperty.length > 0 ? (
                      allListedProperty.map((property) => (

                        <PropertyRow 
                          key={property._id} 
                          property={property} 
                          onDelete={handleDeleteButtonClicked} 
                        />
                      ))
                    ) : (
                      EmptyState
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 0 && (
              <div className="p-2 sm:p-4">
                <PaginationControls
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllListedProperties;