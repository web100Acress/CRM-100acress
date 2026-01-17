import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, User, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { fetchAssignableUsers } from '@/api/leads.api';

const UserSearchModal = ({ isOpen, onClose, onUserSelect, currentUserRole }) => {
  const { toast } = useToast();
  const auth = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Get current user info from Redux
  const getCurrentUserInfo = useCallback(() => {
    return {
      token: auth.token,
      userId: auth.user?._id || auth.user?.id,
      userName: auth.user?.name
    };
  }, [auth]);

  // Fetch and filter users
  const fetchUsersData = useCallback(async (query = '') => {
    setSearching(true);
    try {
      const { token, userId } = getCurrentUserInfo();
      
      // Fetch all users using the leads API
      const data = await fetchAssignableUsers();

      if (data.success && Array.isArray(data.data)) {
        // Filter users by roles: boss, hod, team-leader, bd (actual database role values)
        // Include variants that might exist in database
        const allowedRoles = ['boss', 'super-admin', 'superadmin', 'hod', 'head-admin', 'head_admin', 'team-leader', 'team_leader', 'bd', 'employee'];
        
        let filteredUsers = data.data
          .filter(user => {
            // Exclude current user
            if (user._id === userId) return false;
            // Filter by allowed roles (check both exact match and lowercase)
            const userRole = user.role?.toLowerCase().trim();
            return allowedRoles.some(allowedRole => userRole === allowedRole.toLowerCase());
          })
          .map(user => ({
            _id: user._id,
            name: user.name || user.email?.split('@')[0] || 'Unknown',
            email: user.email,
            role: user.role,
            department: user.department
          }));
          
          // Apply search query filter if provided
          if (query.trim()) {
            const searchLower = query.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
              user.name?.toLowerCase().includes(searchLower) ||
              user.email?.toLowerCase().includes(searchLower)
            );
          }

          console.log('🔍 Fetched users:', {
            total: data.data.length,
            filtered: filteredUsers.length,
            query: query || 'ALL'
          });
          
          setSearchResults(filteredUsers);
        } else {
          setSearchResults([]);
        }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSearchResults([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setSearching(false);
    }
  }, [toast, getCurrentUserInfo]);

  // Initial fetch of all users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsersData(''); // Fetch all users on modal open
    }
  }, [isOpen, fetchUsersData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        fetchUsersData(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchUsersData, isOpen]);

  // Handle user selection
  const handleUserSelect = (user) => {
    onUserSelect(user);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle close
  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Create New Chat</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search all users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-green-500"
              autoFocus
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {searching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Searching...</span>
            </div>
          ) : searchResults.length === 0 && searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <User size={48} className="mb-4 text-gray-300" />
              <p className="text-center">No users found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : searchResults.length === 0 && !searchQuery.trim() && !searching ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <User size={48} className="mb-4 text-gray-300" />
              <p className="text-center">Loading users...</p>
              <p className="text-sm mt-1">Fetching all available users</p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-lg">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {user.name || 'Unknown User'}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                        {(() => {
                          const roleLower = (user.role || '').toLowerCase().trim();
                          const roleMap = {
                            'bd': 'BD',
                            'employee': 'BD',
                            'hod': 'HOD',
                            'head-admin': 'HOD',
                            'head_admin': 'HOD',
                            'boss': 'BOSS',
                            'super-admin': 'BOSS',
                            'superadmin': 'BOSS',
                            'team-leader': 'TEAM LEADER',
                            'team_leader': 'TEAM LEADER'
                          };
                          return roleMap[roleLower] || (user.role || 'user').replace(/_/g, ' ').toUpperCase();
                        })()}
                      </span>
                      {user.department && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {user.department}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chat Icon */}
                  <div className="ml-3">
                    <MessageCircle size={20} className="text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Select any user to start a new conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
