import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { MdHome, MdImage, MdInfo, MdLocationOn, MdAttachMoney, MdApartment } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import api100acress from "../config/api100acressClient";
import { LogOut, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';

const ViewPropertyDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const [infoOpen, setInfoOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    otherImage,
    Amenities
  } = viewDetails;

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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api100acress.get(`/postPerson/propertyoneView/${id}`);
        setViewDetails(res.data.data.postProperty[0] || {});
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Property</span>
                  <span className="hidden lg:inline">Property Details</span>
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

          <main className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Loading property details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden font-sans">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                <span className="lg:hidden">Property</span>
                <span className="hidden lg:inline">Property Details</span>
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
          <div className="p-4 sm:p-6">
            <div className="w-full space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="sm:hidden inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  type="button"
                >
                  Back
                </button>
                <MdHome className="text-3xl text-blue-500" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Property Details</h2>
              </div>

            {/* Images Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Image */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2 flex items-center gap-2"><MdImage />Front Image</h3>
                <div className="flex items-center justify-center h-48 w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200 mb-2">
                  {viewDetails.frontImage && viewDetails.frontImage.url ? (
                    <img src={viewDetails.frontImage.url} alt="frontImage" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-500 text-sm italic">No Front Image</span>
                  )}
                </div>
              </div>
              {/* Other Images */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2 flex items-center gap-2"><MdImage />Other Images</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {otherImage && Array.isArray(otherImage) && otherImage.length > 0 ? (
                          otherImage.map((image, index) => (
                      <img
                              key={index}
                                src={image.url}
                                alt={`Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">No Other Images</span>
                  )}
                </div>
              </div>
            </div>

            {/* Info Section (Collapsible) */}
            <section className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              <button
                className="w-full flex items-center gap-2 px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onClick={() => setInfoOpen((open) => !open)}
                aria-expanded={infoOpen}
                aria-controls="property-info-section"
                type="button"
              >
                <Tippy content={<span>Property Information</span>} animation="scale" theme="light-border">
                  <span><MdInfo className="text-2xl text-blue-500" /></span>
                </Tippy>
                <h2 className="text-2xl font-bold text-gray-800 flex-1 text-left">Property Information</h2>
                {infoOpen ? (
                  <svg className="w-6 h-6 inline-block transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                ) : (
                  <svg className="w-6 h-6 inline-block transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                )}
              </button>
              <div
                id="property-info-section"
                className={`transition-all duration-300 ${infoOpen ? 'max-h-[1000px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}
                style={{ willChange: 'max-height, opacity, padding' }}
                aria-hidden={!infoOpen}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Tippy content={<span>Property Name</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdApartment className="mr-1" />Property Name</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.propertyName || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Property Type</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdApartment className="mr-1" />Property Type</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.propertyType || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Address</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdLocationOn className="mr-1" />Address</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.address || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>City</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdLocationOn className="mr-1" />City</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.city || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Price</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdAttachMoney className="mr-1" />Price</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.price || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Area</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdApartment className="mr-1" />Area</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.area || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>State</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdLocationOn className="mr-1" />State</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.state || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>LandMark</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdLocationOn className="mr-1" />LandMark</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.landMark || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Built Year</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdInfo className="mr-1" />Built Year</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.builtYear || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Furnishing</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdInfo className="mr-1" />Furnishing</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.furnishing || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Available Date</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdInfo className="mr-1" />Available Date</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.availableDate || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Select Property Type</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdApartment className="mr-1" />Select Property Type</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.propertyLooking || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div>
                    <Tippy content={<span>Type</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdApartment className="mr-1" />Type</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.type || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <Tippy content={<span>Project Description</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdInfo className="mr-1" />Project Description</label>
                    </Tippy>
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800 whitespace-pre-wrap">{viewDetails.description || <span className="text-gray-400 italic">N/A</span>}</div>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <Tippy content={<span>Amenities</span>} animation="scale" theme="light-border">
                      <label className="block text-red-700 font-semibold mb-2 flex items-center"><MdInfo className="mr-1" />Amenities</label>
                    </Tippy>
                    <div className="flex flex-wrap gap-2">
                      {Amenities && Array.isArray(Amenities) && Amenities.length > 0 ? Amenities.map((item, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm">{item}</span>
                      )) : <span className="text-gray-400 italic">No Amenities</span>}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewPropertyDetails;
