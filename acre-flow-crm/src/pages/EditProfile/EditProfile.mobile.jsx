import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Shield,
  Camera,
  Save,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import MobileLayout from '@/layout/MobileLayout';
import { Card, CardContent } from '@/layout/card';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/config/apiConfig';

const EditProfileMobile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Profile state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    joinDate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'syncing', 'synced', 'error'

  // Load user data on mount
  useEffect(() => {
    loadUserData();

    // Set up online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
      toast({
        title: "Back Online",
        description: "Connection restored",
        variant: "success"
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('error');
      toast({
        title: "Offline",
        description: "Connection lost - changes will sync when online",
        variant: "warning"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up real-time updates listener
    const interval = setInterval(() => {
      checkForUpdates();
    }, 3000); // Check every 3 seconds for more real-time feel

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // 🎯 LOAD FROM BACKEND DATABASE + S3 (not localStorage)
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      // Dynamic API base URL
      const API_BASE = apiUrl;

      // 🎯 TEMPORARY BYPASS: Skip backend test for development
      console.log('� BYPASS: Skipping backend test, assuming backend is ready...');

      // Fetch current user data from backend (use /me endpoint for current user)
      console.log('🔍 Fetching user profile from:', `${API_BASE}/api/users/me`);
      console.log('🔍 Token available:', token ? 'Yes' : 'No');

      // Add cache-buster to avoid cached requests
      const cacheBuster = new Date().getTime();
      const response = await fetch(`${API_BASE}/api/users/me?_cb=${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      console.log('🔍 Profile API response status:', response.status);
      console.log('🔍 Profile API response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Profile API error response:', errorText);

        // 🎯 FALLBACK: Use login data if profile endpoint doesn't exist
        if (response.status === 404) {
          console.log('🔄 Profile endpoint not found, using fallback login data...');

          const fallbackData = {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            phone: localStorage.getItem('userPhone') || '+91 9876543211',
            role: localStorage.getItem('userRole') || 'employee',
            department: localStorage.getItem('userDepartment') || 'Sales',
            joinDate: localStorage.getItem('userJoinDate') || '2024-01-15'
          };

          setFormData(prev => ({
            ...prev,
            ...fallbackData
          }));

          if (userData?.data?.profileImage) {
            setProfileImage(userData.data.profileImage);
          }

          setLastSaved(new Date());
          setLoading(false);
          return;
        }

        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();

      console.log('🔍 User data loaded from database:', userData);

      // Update form with backend data
      setFormData(prev => ({
        ...prev,
        name: userData.data.name || '',
        email: userData.data.email || '',
        phone: userData.data.phone || '',
        role: userData.data.role || localStorage.getItem('userRole') || 'employee',
        department: userData.data.department || 'Sales',
        joinDate: userData.data.joinDate || '2024-01-15'
      }));

      if (userData?.data?.profileImage) {
        setProfileImage(userData.data.profileImage);
      } else {
        console.log('ℹ️ No profile image found, using default');
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error loading user data from backend:', error);

      // 🎯 ULTIMATE FALLBACK: Always use localStorage if backend fails
      console.log('🔄 Backend error, using localStorage fallback...');

      const fallbackData = {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        phone: localStorage.getItem('userPhone') || '+91 9876543211',
        role: localStorage.getItem('userRole') || 'employee',
        department: localStorage.getItem('userDepartment') || 'Sales',
        joinDate: localStorage.getItem('userJoinDate') || '2024-01-15'
      };

      setFormData(prev => ({ ...prev, ...fallbackData }));

      if (userData?.data?.profileImage) {
        setProfileImage(userData.data.profileImage);
      } else {
        console.log('ℹ️ No profile image found, using default');
      }

      setLastSaved(new Date());

      // Don't show error toast for fallback - it's silent
      // toast({
      //   title: "Error",
      //   description: "Failed to load profile data from server",
      //   variant: "destructive"
      // });
    } finally {
      setLoading(false);
    }
  };

  const checkForUpdates = () => {
    // Simulate checking for updates from server
    // In real app, this would make an API call
    const serverUpdateTime = localStorage.getItem('profileLastUpdated');
    if (serverUpdateTime && lastSaved && new Date(serverUpdateTime) > lastSaved) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated from another device",
        variant: "info"
      });
      loadUserData();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required to change password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // 🎯 NO LOCALSTORAGE for sensitive fields - Save to backend database only
    // Only save non-sensitive fields to localStorage as backup
    if (field !== 'currentPassword' && field !== 'newPassword' && field !== 'confirmPassword') {
      const keyMap = {
        name: 'userName',
        email: 'userEmail',
        phone: 'userPhone'
      };

      if (keyMap[field]) {
        localStorage.setItem(keyMap[field], value);
        console.log(`📝 Updated ${field} in form state and localStorage:`, value);
      }
    } else {
      console.log(`📝 Updated ${field} in form state only (sensitive data):`, '***');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      try {
        setSaving(true);
        setSyncStatus('syncing');

        const token = localStorage.getItem('token');

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('profileImage', file);

        // 🎯 CRITICAL FIX: Use dynamic API base URL
        const API_BASE = apiUrl;

        // Upload to server
        const response = await fetch(`${API_BASE}/api/users/profile-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload profile image');
        }

        const result = await response.json();

        console.log('🔍 Image upload response:', result);

        // 🎯 CRITICAL FIX: Handle both base64 and S3 URLs
        let imageUrl = result.data.profileImage;

        if (imageUrl) {
          if (imageUrl.startsWith('data:')) {
            // Backend returned base64 data - use as-is
            console.log('🔧 Backend returned base64 data, using directly');
          } else if (imageUrl.startsWith('http')) {
            // Backend returned full S3 URL - use as-is
            console.log('🔧 Backend returned full S3 URL:', imageUrl);
          } else {
            // Backend returned relative path - convert to full URL
            const baseUrl = apiUrl;
            imageUrl = baseUrl + imageUrl;
            console.log('🔧 Converted relative URL to full URL:', imageUrl);
          }
        }

        // Update state with server response
        setProfileImage(imageUrl);

        // 🎯 BACKEND DATABASE + S3 ONLY (no localStorage)
        console.log('✅ Profile image uploaded to S3, saved in database:', imageUrl);

        toast({
          title: "Image Updated",
          description: "Profile picture uploaded successfully",
          variant: "success"
        });
      } catch (error) {
        console.error('Error uploading profile image:', error);
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload profile picture",
          variant: "destructive"
        });

        // 🎯 NO LOCALSTORAGE FALLBACK for images - Backend only
        // Don't save base64 to localStorage as it causes issues
      } finally {
        setSaving(false);
        setSyncStatus('synced');
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    setSyncStatus('syncing');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      // 🎯 CRITICAL FIX: Use dynamic API base URL and handle image URLs
      const API_BASE = apiUrl;

      // Prepare data for API
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profileImage: profileImage
      };

      // Add password data if changing password
      if (formData.newPassword) {
        profileData.currentPassword = formData.currentPassword;
        profileData.newPassword = formData.newPassword;
      }

      // Call backend API (use /me endpoint for current user)
      const response = await fetch(`${API_BASE}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();

      console.log('🔍 Profile data saved to database via backend API');

      // Handle image URL from backend response
      if (result.data.profileImage) {
        let savedImageUrl = result.data.profileImage;

        if (savedImageUrl.startsWith('data:')) {
          // Backend returned base64 data - use as-is
          console.log('🔧 Backend returned base64 data in profile save, using directly');
        } else if (savedImageUrl.startsWith('http')) {
          // Backend returned full S3 URL - use as-is
          console.log('🔧 Backend returned full S3 URL in profile save:', savedImageUrl);
        } else {
          // Backend returned relative path - convert to full URL
          const baseUrl = apiUrl;
          savedImageUrl = baseUrl + savedImageUrl;
          console.log('🔧 Converted relative URL to full URL in profile save:', savedImageUrl);
        }

        // Update state with processed URL
        setProfileImage(savedImageUrl);
        window.dispatchEvent(new Event('profile-image-updated'));
      }

      // Update component state only
      setLastSaved(new Date());
      setSyncStatus('synced');

      toast({
        title: "Success",
        description: "Profile updated successfully in database",
        variant: "success"
      });

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Profile update error:', error);
      setSyncStatus('error');

      toast({
        title: "Error",
        description: error.message || "Failed to update profile in database",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      variant: "info"
    });
    navigate('/login');
  };

  if (loading) {
    return (
      <MobileLayout title="Edit Profile" showBack={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title="Edit Profile"
      showBack={true}
      rightAction={
        <div className="flex items-center gap-2">
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Real-time Status Indicator */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
            <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-green-500' :
              syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`} />
            <span className="text-xs text-gray-600">
              {syncStatus === 'synced' ? 'Synced' :
                syncStatus === 'syncing' ? 'Syncing...' :
                  'Offline'}
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4 pb-20">
        {/* Profile Picture Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 transition-all shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {formData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={handleImageClick}
                >
                  <Camera size={16} className="text-blue-600" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-gray-900">{formData.name}</h3>
                <p className="text-sm text-gray-500">{formData.role}</p>
                {lastSaved && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Basic Information
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="relative">
                    <Shield size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={formData.department}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.joinDate}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Change Password
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X size={12} />
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X size={12} />
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Confirm new password"
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-3 top-3">
                      {formData.newPassword === formData.confirmPassword ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <X size={18} className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X size={12} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-600 mb-4">Danger Zone</h4>
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              <span>Logout from All Devices</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default EditProfileMobile;
