import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { Calendar, Clock, MapPin, User, Building, Phone, Mail, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { VISIT_TYPE, SITE_VISIT_STATUS } from '@/models/siteVisitModel';

// Desktop Version Component
const ScheduleSiteVisitDesktop = ({ 
  isOpen, 
  onClose, 
  lead, 
  onSave,
  preselectedAgent = null 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    leadId: lead?._id || '',
    projectId: '',
    unitId: '',
    scheduledDate: '',
    scheduledTime: '',
    visitType: VISIT_TYPE.ONSITE,
    assignedAgentId: preselectedAgent || '',
    notes: '',
    clientConfirmation: false,
    agentConfirmation: false
  });

  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchAssignableUsers();
      fetchProjects();
      if (lead?._id) {
        setFormData(prev => ({ ...prev, leadId: lead._id }));
      }
    }
  }, [isOpen, lead, preselectedAgent]);

  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      let endpoint = `${API_ENDPOINTS.USERS}`;
      
      // Filter users based on current user role
      if (userRole === 'boss' || userRole === 'super-admin') {
        endpoint = `${API_ENDPOINTS.USERS}?role=hod,team-leader,bd`;
      } else if (userRole === 'hod') {
        endpoint = `${API_ENDPOINTS.USERS}?role=team-leader,bd`;
      } else if (userRole === 'team-leader') {
        endpoint = `${API_ENDPOINTS.USERS}?role=bd`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAssignableUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching assignable users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assignable users',
        variant: 'destructive'
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.LEADS}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUnits = async (projectId) => {
    if (!projectId) {
      setUnits([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.LEADS}/projects/${projectId}/units`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'projectId') {
      fetchUnits(value);
      setFormData(prev => ({ ...prev, unitId: '' }));
    }
  };

  const validateForm = () => {
    if (!formData.scheduledDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select a date',
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.scheduledTime) {
      toast({
        title: 'Validation Error',
        description: 'Please select a time',
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.assignedAgentId) {
      toast({
        title: 'Validation Error',
        description: 'Please assign an agent',
        variant: 'destructive'
      });
      return false;
    }

    // Validate that date is not in the past
    const selectedDate = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
    const now = new Date();
    if (selectedDate < now) {
      toast({
        title: 'Validation Error',
        description: 'Cannot schedule site visit in the past',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('userId');
      
      const visitData = {
        ...formData,
        status: SITE_VISIT_STATUS.PLANNED,
        assignedBy: currentUser,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(API_ENDPOINTS.SITE_VISITS_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Success',
          description: 'Site visit scheduled successfully!',
        });

        await updateLeadStatus(lead._id, 'Site Visit Planned');

        onSave && onSave(result.data);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule site visit');
      }
    } catch (error) {
      console.error('Error scheduling site visit:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule site visit',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(API_ENDPOINTS.LEADS_UPDATE(leadId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6" />
            Schedule Site Visit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lead Information - Desktop Enhanced */}
          {lead && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Lead Information
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{lead.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-sm truncate">{lead.email}</p>
                    </div>
                  </div>
                )}
                {lead.location && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-sm truncate">{lead.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visit Details - Desktop Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Schedule Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <select
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select time</option>
                    {generateTimeSlots().map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visit Type
                </label>
                <div className="flex gap-4 p-1 bg-gray-50 rounded-lg">
                  <label className="flex-1 flex items-center justify-center p-3 rounded-md cursor-pointer transition-all hover:bg-white">
                    <input
                      type="radio"
                      name="visitType"
                      value={VISIT_TYPE.ONSITE}
                      checked={formData.visitType === VISIT_TYPE.ONSITE}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-2 ${formData.visitType === VISIT_TYPE.ONSITE ? 'text-blue-600' : 'text-gray-500'}`}>
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Onsite Visit</span>
                    </div>
                  </label>
                  <label className="flex-1 flex items-center justify-center p-3 rounded-md cursor-pointer transition-all hover:bg-white">
                    <input
                      type="radio"
                      name="visitType"
                      value={VISIT_TYPE.VIRTUAL}
                      checked={formData.visitType === VISIT_TYPE.VIRTUAL}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-2 ${formData.visitType === VISIT_TYPE.VIRTUAL ? 'text-blue-600' : 'text-gray-500'}`}>
                      <Phone className="w-5 h-5" />
                      <span className="font-medium">Virtual Visit</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Agent *
                </label>
                <select
                  name="assignedAgentId"
                  value={formData.assignedAgentId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select agent</option>
                  {assignableUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Property Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit (Optional)
                  </label>
                  <select
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    disabled={!formData.projectId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select unit</option>
                    {units.map(unit => (
                      <option key={unit._id} value={unit._id}>
                        {unit.name} - {unit.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes for the visit..."
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    name="clientConfirmation"
                    checked={formData.clientConfirmation}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-sm">Client confirmed</p>
                    <p className="text-xs text-gray-500">Client has confirmed the visit</p>
                  </div>
                </label>
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agentConfirmation"
                    checked={formData.agentConfirmation}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-sm">Agent confirmed</p>
                    <p className="text-xs text-gray-500">Agent has acknowledged the visit</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Schedule Visit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSiteVisitDesktop;
