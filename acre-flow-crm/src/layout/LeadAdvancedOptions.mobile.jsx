import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { Eye, PhoneCall, Mail, MessageSquare, Calendar, Clock, TrendingUp, PieChart, User, MapPin, Building2, DollarSign, Settings, X } from 'lucide-react';
import { Badge } from '@/layout/badge';

const LeadAdvancedOptionsMobile = ({ 
  isOpen, 
  onClose, 
  lead, 
  onUpdateStatus,
  onCallLead,
  onEmailLead,
  callHistory = {},
  followUps = []
}) => {
  const [showLeadInfo, setShowLeadInfo] = useState(false);
  const [status, setStatus] = useState(lead?.status || 'Cold');
  const [realCallHistory, setRealCallHistory] = useState([]);
  const [realFollowUps, setRealFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real data when component opens
  useEffect(() => {
    if (isOpen && lead?._id) {
      fetchRealData();
    }
  }, [isOpen, lead?._id]);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch call history
      const callResponse = await fetch(`https://bcrm.100acress.com/api/leads/${lead._id}/calls`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (callResponse.ok) {
        const callData = await callResponse.json();
        setRealCallHistory(callData.calls || []);
      } else {
        console.log('Call history API not available, using mock data');
        // Mock call history data for testing
        const mockCallHistory = [
          {
            startTime: new Date().toISOString(),
            duration: 43,
            calledBy: 'Test',
            phone: lead?.phone || '85009 00100',
            status: 'completed'
          },
          {
            startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            duration: 0,
            calledBy: 'Test',
            phone: lead?.phone || '85009 00100',
            status: 'missed'
          },
          {
            startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            duration: 120,
            calledBy: 'Test',
            phone: lead?.phone || '85009 00100',
            status: 'completed'
          }
        ];
        setRealCallHistory(mockCallHistory);
      }

      // Fetch follow-ups
      const followUpResponse = await fetch(`https://bcrm.100acress.com/api/leads/${lead._id}/follow-ups`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (followUpResponse.ok) {
        const followUpData = await followUpResponse.json();
        setRealFollowUps(followUpData.followUps || []);
      } else {
        console.log('Follow-ups API not available, using mock data');
        // Mock follow-up data for testing
        const mockFollowUps = [
          {
            date: new Date().toISOString(),
            note: 'Initial follow-up scheduled',
            createdBy: 'Test',
            status: 'pending'
          },
          {
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            note: 'Property inquiry follow-up',
            createdBy: 'Test',
            status: 'completed'
          }
        ];
        setRealFollowUps(mockFollowUps);
      }
    } catch (error) {
      console.log('Error fetching real data:', error);
      setRealCallHistory([]);
      setRealFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(lead._id, newStatus);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-[95vw] max-h-[85vh] overflow-y-auto p-0 mx-4">
        <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
          <DialogTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Settings size={18} />
              <span className="font-semibold">Advanced Options</span>
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 space-y-3">
          {/* Lead Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{getInitials(lead.name)}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{lead.name}</h3>
                <p className="text-xs text-gray-600">{lead.phone}</p>
                <p className="text-xs text-gray-500 truncate">{lead.email}</p>
              </div>
            </div>
          </div>

          {/* Toggle Lead Info */}
          <button
            onClick={() => setShowLeadInfo(!showLeadInfo)}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={14} className="text-purple-600" />
            <span className="text-xs font-medium text-gray-700">
              {showLeadInfo ? 'Hide Lead Info' : 'View Lead Info'}
            </span>
          </button>

          {/* Lead Details */}
          {showLeadInfo && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-xs font-medium text-gray-900">{lead.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-xs font-medium text-gray-900 truncate">{lead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-xs font-medium text-gray-900">{lead.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Property</p>
                  <p className="text-xs font-medium text-gray-900">{lead.property}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-xs font-medium text-gray-900">{lead.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onCallLead(lead.phone, lead._id, lead.name);
                  onClose();
                }}
                className="flex flex-col items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <PhoneCall size={18} className="text-green-600 mb-1" />
                <span className="text-xs font-medium text-gray-900">Call Now</span>
              </button>
              
              <button
                onClick={() => {
                  onEmailLead(lead.email);
                  onClose();
                }}
                className="flex flex-col items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail size={18} className="text-blue-600 mb-1" />
                <span className="text-xs font-medium text-gray-900">Send Email</span>
              </button>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Update Status</h4>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleStatusUpdate('Hot')}
                className={`p-2 rounded-lg border transition-colors ${
                  status === 'Hot' 
                    ? 'bg-red-100 border-red-200 text-red-800' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-red-50'
                }`}
              >
                <div className="text-center">
                  <span className="text-base">🔥</span>
                  <p className="text-xs mt-0.5">Hot</p>
                </div>
              </button>
              
              <button
                onClick={() => handleStatusUpdate('Warm')}
                className={`p-2 rounded-lg border transition-colors ${
                  status === 'Warm' 
                    ? 'bg-yellow-100 border-yellow-200 text-yellow-800' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-yellow-50'
                }`}
              >
                <div className="text-center">
                  <span className="text-base">🌡️</span>
                  <p className="text-xs mt-0.5">Warm</p>
                </div>
              </button>
              
              <button
                onClick={() => handleStatusUpdate('Cold')}
                className={`p-2 rounded-lg border transition-colors ${
                  status === 'Cold' 
                    ? 'bg-blue-100 border-blue-200 text-blue-800' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'
                }`}
              >
                <div className="text-center">
                  <span className="text-base">❄️</span>
                  <p className="text-xs mt-0.5">Cold</p>
                </div>
              </button>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Call History & Follow-up Analytics</h4>
            
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <p className="text-gray-500 mt-2 text-xs">Loading analytics...</p>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-2.5 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <PhoneCall size={14} className="text-green-600" />
                      <span className="text-xs text-green-600">Calls</span>
                    </div>
                    <p className="text-xl font-bold text-green-800">
                      {realCallHistory.length}
                    </p>
                    <p className="text-xs text-green-600">Total Calls</p>
                  </div>
                  
                  <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <MessageSquare size={14} className="text-blue-600" />
                      <span className="text-xs text-blue-600">Follow-ups</span>
                    </div>
                    <p className="text-xl font-bold text-blue-800">
                      {realFollowUps.length}
                    </p>
                    <p className="text-xs text-blue-600">Follow-ups</p>
                  </div>
                </div>

                {/* Additional Stats */}
                {realCallHistory.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-purple-50 p-1.5 rounded-lg border border-purple-200 text-center">
                      <p className="text-sm font-bold text-purple-800">
                        {formatDuration(
                          Math.round(
                            realCallHistory.reduce((sum, call) => sum + (call.duration || 0), 0) / realCallHistory.length
                          )
                        )}
                      </p>
                      <p className="text-xs text-purple-600">Avg Duration</p>
                    </div>
                    
                    <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-200 text-center">
                      <p className="text-sm font-bold text-orange-800">
                        {realCallHistory.filter(call => call.duration > 0).length}
                      </p>
                      <p className="text-xs text-orange-600">Connected</p>
                    </div>
                    
                    <div className="bg-red-50 p-1.5 rounded-lg border border-red-200 text-center">
                      <p className="text-sm font-bold text-red-800">
                        {realCallHistory.filter(call => call.duration === 0).length}
                      </p>
                      <p className="text-xs text-red-600">Missed</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Recent Activity */}
          {!loading && (realCallHistory.length > 0 || realFollowUps.length > 0) && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Recent Activity</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {realCallHistory.slice(0, 5).map((call, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <PhoneCall size={12} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-900">Call</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          call.duration > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {call.duration > 0 ? 'Connected' : 'Missed'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        Duration: {formatDuration(call.duration || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(call.startTime).toLocaleDateString()} • {new Date(call.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      {call.calledBy && (
                        <p className="text-xs text-gray-400 mt-1">
                          Called by: {call.calledBy}
                        </p>
                      )}
                      {call.phone && (
                        <p className="text-xs text-gray-400">
                          Phone: {call.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {realFollowUps.slice(0, 3).map((followUp, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare size={12} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">Follow-up</p>
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {followUp.note || 'No note'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(followUp.date).toLocaleDateString()} • {new Date(followUp.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      {followUp.createdBy && (
                        <p className="text-xs text-gray-400 mt-1">
                          Created by: {followUp.createdBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10 text-sm"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onCallLead(lead.phone, lead._id, lead.name);
                onClose();
              }}
              className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-sm"
            >
              Call Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadAdvancedOptionsMobile;
