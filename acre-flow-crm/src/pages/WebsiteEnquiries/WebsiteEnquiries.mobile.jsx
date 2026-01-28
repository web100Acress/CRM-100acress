import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Phone,
  Mail,
  Building2,
  RefreshCw,
  Eye,
  X,
  Download,
  Filter,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';

const WebsiteEnquiriesMobile = ({ userRole }) => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/website-enquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enquiries');
      }

      const data = await response.json();
      if (data.success) {
        setEnquiries(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch enquiries');
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch enquiries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(enquiry => 
    enquiry.name?.toLowerCase().includes(search.toLowerCase()) ||
    enquiry.email?.toLowerCase().includes(search.toLowerCase()) ||
    enquiry.phone?.includes(search) ||
    enquiry.projectName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/website-enquiries/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download enquiries');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `website-enquiries-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Enquiries downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading enquiries:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to download enquiries",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading website enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Website Enquiries</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchEnquiries}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{enquiries.length}</p>
              </div>
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Filtered</p>
                <p className="text-lg font-bold text-gray-900">{filteredEnquiries.length}</p>
              </div>
              <Filter className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Enquiries List */}
        <div className="space-y-3">
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No enquiries found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div key={enquiry._id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{enquiry.name}</h3>
                      <p className="text-xs text-gray-500">ID: {enquiry._id.slice(-8)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEnquiry(enquiry);
                      setShowDetails(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {enquiry.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {enquiry.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {enquiry.projectName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(enquiry.createdAt)}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </a>
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enquiry Details Modal */}
      {showDetails && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900">Enquiry Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">{selectedEnquiry.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">ID: {selectedEnquiry._id}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{selectedEnquiry.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Project</label>
                    <p className="text-sm text-gray-900">{selectedEnquiry.projectName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Budget</label>
                    <p className="text-sm text-gray-900">{selectedEnquiry.budget || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Source</label>
                    <p className="text-sm text-gray-900">{selectedEnquiry.source}</p>
                  </div>
                </div>

                {selectedEnquiry.message && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Message</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Created</label>
                    <p className="text-xs text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Updated</label>
                    <p className="text-xs text-gray-900">{formatDate(selectedEnquiry.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </a>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteEnquiriesMobile;
