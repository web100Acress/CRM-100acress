import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, User, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/config/apiConfig';

const UserSearchModal = ({ isOpen, onClose, onUserSelect, currentUserRole }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Get current user info
  const getCurrentUserInfo = useCallback(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || localStorage.getItem('name');
    
    return { token, userId, userName };
  }, []);

  // Search users
  const searchUsers = useCallback(async (query) => {
    setSearching(true);
    try {
      const { token } = getCurrentUserInfo();
      
      const response = await fetch(apiUrl('users/search'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query.trim() || '', // Send empty string to fetch all users
          excludeSelf: true,
          role: currentUserRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.users || []);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
      toast({
        title: 'Error',
        description: 'Failed to search users',
        variant: 'destructive'
      });
    } finally {
      setSearching(false);
    }
  }, [currentUserRole, toast, getCurrentUserInfo]);

  // Initial fetch of all users when modal opens
  useEffect(() => {
    if (isOpen) {
      searchUsers(''); // Fetch all users on modal open
    }
  }, [isOpen, searchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else if (isOpen) {
        searchUsers(''); // Fetch all users when search is empty but modal is open
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers, isOpen]);

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
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                        {user.role || 'user'}
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
