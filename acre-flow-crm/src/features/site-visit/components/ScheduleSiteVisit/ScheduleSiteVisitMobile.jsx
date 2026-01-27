import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { Calendar, Clock, MapPin, User, Building, Phone, Mail, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { VISIT_TYPE, SITE_VISIT_STATUS } from '@/models/siteVisitModel';
import { useIsMobile } from '@/hooks/use-mobile';

// Mobile Version Component
const ScheduleSiteVisitMobile = ({ 
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
      <DialogContent className="max-w-full w-full h-[100vh] max-h-[100vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            Schedule Visit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          {/* Lead Information - Mobile Compact */}
          {lead && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">Lead Info</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{lead.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-xs">{lead.email}</span>
                  </div>
                )}
                {lead.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs">{lead.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visit Details - Mobile Stacked */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Visit Details</h3>
            
            <div className="space-y-3">
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
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
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visitType"
                    value={VISIT_TYPE.ONSITE}
                    checked={formData.visitType === VISIT_TYPE.ONSITE}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`flex flex-col items-center gap-1 ${formData.visitType === VISIT_TYPE.ONSITE ? 'text-blue-600' : 'text-gray-500'}`}>
                    <MapPin className="w-5 h-5" />
                    <span className="text-xs font-medium">Onsite</span>
                  </div>
                </label>
                <label className="flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visitType"
                    value={VISIT_TYPE.VIRTUAL}
                    checked={formData.visitType === VISIT_TYPE.VIRTUAL}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`flex flex-col items-center gap-1 ${formData.visitType === VISIT_TYPE.VIRTUAL ? 'text-blue-600' : 'text-gray-500'}`}>
                    <Phone className="w-5 h-5" />
                    <span className="text-xs font-medium">Virtual</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                Assign Agent *
              </label>
              <select
                name="assignedAgentId"
                value={formData.assignedAgentId}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes for the visit..."
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="clientConfirmation"
                  checked={formData.clientConfirmation}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm font-medium">Client confirmed</span>
              </label>
              <label className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="agentConfirmation"
                  checked={formData.agentConfirmation}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm font-medium">Agent confirmed</span>
              </label>
            </div>
          </div>
        </form>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Schedule
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSiteVisitMobile;
