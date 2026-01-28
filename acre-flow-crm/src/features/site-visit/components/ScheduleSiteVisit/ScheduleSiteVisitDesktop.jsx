import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Building, Phone, Mail, Save, X, Loader2, ShieldCheck, CheckCircle2, CircleDashed, FileText, AlertCircle, Target, MessageSquare, TrendingUp } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/apiConfig';
import SiteVisitApiService from '@/features/site-visit/api/siteVisitApi';
import { SITE_VISIT_STATUS, VISIT_TYPE } from '@/models/siteVisitModel';

// Mock Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`relative z-50 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Real BD Site Visit Scheduler Component
const ScheduleSiteVisitDesktop = ({ 
  isOpen, 
  onClose, 
  lead = null,
  currentUser = null,
  onSave 
}) => {
  const [loading, setLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [agents, setAgents] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    leadId: lead?._id || '',
    projectId: '',
    unitId: '',
    scheduledDate: '',
    scheduledTime: '',
    visitType: VISIT_TYPE.ONSITE,
    assignedAgentId: currentUser?._id || '',
    notes: '',
    clientConfirmation: false,
    agentConfirmation: false,
    // Follow-up details
    followUpDate: '',
    followUpTime: '',
    followUpNote: '',
    followUpPriority: 'medium',
    nextAction: 'call'
  });

  // Fetch assigned leads for BD user
  useEffect(() => {
    if (isOpen) {
      // Enhanced user detection - get from multiple sources
      const userData = currentUser || {
        _id: localStorage.getItem('userId') || localStorage.getItem('_id'),
        name: localStorage.getItem('userName') || localStorage.getItem('name'),
        email: localStorage.getItem('userEmail') || localStorage.getItem('email'),
        role: localStorage.getItem('userRole') || 'bd'
      };
      
      console.log('🔍 Enhanced User Detection:', userData);
      
      // Set user data for UI
      setCurrentUserData(userData);
      
      if (userData.role === 'bd') {
        fetchAssignedLeads(userData);
        fetchProjects();
        fetchAgents();
      }
    }
  }, [isOpen, currentUser]);

  const fetchAssignedLeads = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Enhanced user ID retrieval for BD user "test1"
      const currentUserId = userData?._id || 
                          localStorage.getItem('userId') || 
                          localStorage.getItem('_id');
      
      console.log('🔍 Enhanced Debugging for BD User:');
      console.log('  - localStorage userId:', localStorage.getItem('userId'));
      console.log('  - localStorage _id:', localStorage.getItem('_id'));
      console.log('  - userData._id:', userData?._id);
      console.log('  - currentUser._id:', currentUser?._id);
      console.log('  - currentUser.id:', currentUser?.id);
      console.log('  - Final currentUserId:', currentUserId);
      console.log('  - currentUser role:', currentUser?.role);
      console.log('  - currentUser:', currentUser);
      
      if (!currentUserId) {
        console.error('❌ No user ID found for BD user!');
        setAssignedLeads([]);
        return;
      }
      
      console.log('📡 Fetching assigned leads for BD user:', currentUserId);
      
      const response = await fetch(`${API_ENDPOINTS.LEADS}?assignedTo=${currentUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Lead fetch response status:', response.status);
      console.log('📡 Lead fetch URL:', `${API_ENDPOINTS.LEADS}?assignedTo=${currentUserId}`);
      console.log('📡 Response headers:', response.headers);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('📡 Response content-type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('✅ Assigned leads fetched:', data.data?.length || 0, 'leads');
          console.log('📋 Lead data:', data.data);
          
          // Enhanced lead debugging
          if (data.data && data.data.length > 0) {
            console.log('🎯 Lead Details:');
            data.data.forEach((lead, index) => {
              console.log(`  Lead ${index + 1}:`, {
                name: lead.name,
                _id: lead._id,
                assignedTo: lead.assignedTo,
                assignedToName: lead.assignedToName,
                assignedToEmail: lead.assignedToEmail,
                phone: lead.phone,
                email: lead.email
              });
            });
          }
          
          setAssignedLeads(data.data || []);
        } else {
          const responseText = await response.text();
          console.error('❌ Unexpected response format (not JSON):', responseText.substring(0, 200));
          console.error('❌ This usually means the backend server is not running or API endpoint doesn\'t exist');
          setBackendError(true);
          setAssignedLeads([]);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch assigned leads:', response.status, errorText);
        
        // Try fallback without assignedTo filter
        console.log('🔄 Trying fallback: Fetch all leads...');
        try {
          const fallbackResponse = await fetch(`${API_ENDPOINTS.LEADS}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('🔄 Fallback: All leads fetched:', fallbackData.data?.length || 0);
            console.log('🔄 All leads data sample:', fallbackData.data?.slice(0, 3));
            
            // Enhanced filtering for BD user "test1"
            const userLeads = fallbackData.data?.filter(lead => {
              const assignedToMatch = lead.assignedTo === currentUserId || 
                                   String(lead.assignedTo) === String(currentUserId) ||
                                   lead.assignedTo?.toString() === currentUserId?.toString() ||
                                   lead.assignedTo.toString() === String(currentUserId);
              
              if (assignedToMatch) {
                console.log('✅ Found matching lead:', lead.name, 'assignedTo:', lead.assignedTo);
              }
              
              return assignedToMatch;
            }) || [];
            
            console.log('🎯 Filtered assigned leads:', userLeads.length);
            console.log('🎯 Filtered leads:', userLeads);
            setAssignedLeads(userLeads);
          } else {
            console.error('❌ Fallback also failed:', fallbackResponse.status);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback fetch error:', fallbackError);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching assigned leads:', error);
      // Set empty array to prevent undefined errors
      setAssignedLeads([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
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

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.USERS}?role=bd`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAgents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Fetch units when project is selected
  useEffect(() => {
    if (formData.projectId) {
      fetchProjectUnits(formData.projectId);
    }
  }, [formData.projectId]);

  const fetchProjectUnits = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/units`, {
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

  // Auto-select lead when component opens or when leads are loaded
  useEffect(() => {
    if (assignedLeads.length > 0 && !formData.leadId) {
      // If a lead is passed as prop, use it
      if (lead?._id) {
        setFormData(prev => ({ ...prev, leadId: lead._id }));
      } 
      // Otherwise, select the first assigned lead
      else {
        setFormData(prev => ({ ...prev, leadId: assignedLeads[0]._id }));
      }
    }
  }, [assignedLeads, lead, formData.leadId]);

  // Auto-populate lead details when lead is selected
  useEffect(() => {
    if (formData.leadId) {
      const selectedLeadData = assignedLeads.find(lead => lead._id === formData.leadId);
      if (selectedLeadData?.projectId) {
        setFormData(prev => ({
          ...prev,
          projectId: selectedLeadData.projectId
        }));
      }
    }
  }, [formData.leadId, assignedLeads]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.leadId || !formData.projectId || !formData.scheduledDate || !formData.scheduledTime) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create site visit
      const visitData = {
        leadId: formData.leadId,
        projectId: formData.projectId,
        unitId: formData.unitId,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        visitType: formData.visitType,
        assignedAgentId: formData.assignedAgentId,
        notes: formData.notes,
        clientConfirmation: formData.clientConfirmation,
        agentConfirmation: formData.agentConfirmation,
        status: SITE_VISIT_STATUS.PLANNED,
        createdBy: currentUserData?._id || currentUser?._id
      };

      const visitResponse = await SiteVisitApiService.createSiteVisit(visitData);

      if (visitResponse.success) {
        // Create follow-up if provided
        if (formData.followUpDate && formData.followUpTime) {
          const followUpData = {
            leadId: formData.leadId,
            type: 'site-visit-followup',
            scheduledDate: formData.followUpDate,
            scheduledTime: formData.followUpTime,
            notes: formData.followUpNote,
            priority: formData.followUpPriority,
            nextAction: formData.nextAction,
            assignedTo: formData.assignedAgentId,
            createdBy: currentUserData?._id || currentUser?._id
          };

          await fetch(`${API_ENDPOINTS.LEADS_ADD_FOLLOW_UP(formData.leadId)}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(followUpData)
          });
        }

        alert('Site visit scheduled successfully!');
        if (onSave) onSave();
        onClose(false);
      } else {
        alert('Failed to schedule site visit');
      }
    } catch (error) {
      console.error('Error scheduling site visit:', error);
      alert('Error scheduling site visit');
    } finally {
      setLoading(false);
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

  const isSlotDisabled = (slot) => {
    if (!formData.scheduledDate) return false;
    const today = new Date().toISOString().split('T')[0];
    if (formData.scheduledDate !== today) return false;
    const [hours] = slot.split(':').map(Number);
    return hours < new Date().getHours();
  };

  const SectionCard = ({ title, icon: Icon, description, children }) => (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-start gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-gray-900">{title}</p>
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
      </header>
      <div className="p-6">{children}</div>
    </section>
  );

  const ReviewRow = ({ label, value }) => (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value || '—'}</span>
    </div>
  );

  const confirmationStatuses = [
    {
      key: 'clientConfirmation',
      label: 'Client Confirmation',
      description: 'Client has acknowledged date & time',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pendingColor: 'bg-gray-50 text-gray-500 border-gray-300',
      icon: ShieldCheck
    },
    {
      key: 'agentConfirmation',
      label: 'Agent Confirmation',
      description: 'Assigned agent notified',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      pendingColor: 'bg-gray-50 text-gray-500 border-gray-300',
      icon: CheckCircle2
    }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl">
        <div className="flex h-[90vh] max-h-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-5 w-5 text-blue-200" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Schedule Site Visit
                  </p>
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Plan a New Visit
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  Fill in the details below to create a comprehensive visit plan
                </p>
              </div>
              <button
                onClick={() => onClose(false)}
                className="flex-shrink-0 rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="space-y-6 p-6 sm:p-8">
              {/* Lead Selection */}
              <SectionCard
                title="Lead Selection"
                icon={User}
                description="Select the lead for this site visit"
              >
                {/* Current User Info Display */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Current BD User:</span>
                    <span className="text-blue-700">{currentUserData?.email || 'Unknown'}</span>
                    <span className="text-blue-600">({currentUserData?.name || 'Unknown'})</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    User ID: {currentUserData?._id || 'Unknown'} | Role: {currentUserData?.role || 'Unknown'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                      Select Lead
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        Required
                      </span>
                    </label>
                    <select
                      name="leadId"
                      value={formData.leadId}
                      onChange={handleChange}
                      disabled={leadsLoading || assignedLeads.length === 0}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {leadsLoading ? 'Loading leads...' : assignedLeads.length === 0 ? 'No assigned leads found' : 'Select a lead'}
                      </option>
                      {assignedLeads.map(lead => (
                        <option key={lead._id} value={lead._id}>
                          {lead.name} - {lead.phone}
                        </option>
                      ))}
                    </select>
                    {leadsLoading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Fetching your assigned leads...</span>
                      </div>
                    )}
                    {!leadsLoading && backendError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <span>Backend server not responding. Please start the backend server.</span>
                      </div>
                    )}
                    {!leadsLoading && !backendError && assignedLeads.length === 0 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <span>No leads assigned to you. Please contact your manager.</span>
                      </div>
                    )}
                    {!leadsLoading && !backendError && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Found {assignedLeads.length} assigned lead(s)</span>
                      </div>
                    )}
                  </div>

                  {/* Selected Lead Details */}
                  {formData.leadId && (() => {
                    const selectedLead = assignedLeads.find(lead => lead._id === formData.leadId);
                    return selectedLead ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                          { label: 'Lead Name', value: selectedLead.name, icon: User },
                          { label: 'Phone', value: selectedLead.phone, icon: Phone },
                          { label: 'Email', value: selectedLead.email, icon: Mail },
                          { label: 'Location', value: selectedLead.location || 'N/A', icon: MapPin }
                        ].map((item, idx) => (
                          <div key={idx} className="group rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 transition hover:shadow-md">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                              <item.icon className="h-3.5 w-3.5" />
                              {item.label}
                            </div>
                            <p className="mt-2 text-sm font-semibold text-gray-900 break-words">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>
              </SectionCard>

              {/* Project and Unit Selection */}
              <SectionCard
                title="Project Details"
                icon={Building}
                description="Select project and unit for the visit"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                      Select Project
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        Required
                      </span>
                    </label>
                    <select
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Select Unit (Optional)
                    </label>
                    <select
                      name="unitId"
                      value={formData.unitId}
                      onChange={handleChange}
                      disabled={!formData.projectId}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a unit</option>
                      {units.map(unit => (
                        <option key={unit._id} value={unit._id}>
                          {unit.name} · {unit.type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                    <FileText className="mr-2 h-4 w-4 text-gray-400" />
                    Notes for Team
                    <span className="ml-2 text-xs font-normal text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={6}
                    maxLength={400}
                    placeholder="Add context, meeting points, or special instructions..."
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">
                    {formData.notes.length}/400 characters
                  </p>
                </div>
              </SectionCard>

              {/* Confirmations */}
              <SectionCard
                title="Confirmation Status"
                icon={ShieldCheck}
                description="Track stakeholder alignment"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {confirmationStatuses.map(({ key, label, description, color, pendingColor, icon: StatusIcon }) => {
                    const isActive = formData[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setFormData(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`flex flex-col rounded-xl border-2 p-5 text-left transition ${
                          isActive ? color : `${pendingColor} border-dashed hover:border-solid`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-5 w-5" />
                          <p className="text-sm font-semibold">{label}</p>
                        </div>
                        <p className="mt-2 text-xs opacity-80">{description}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
                          {isActive ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" /> Confirmed
                            </>
                          ) : (
                            <>
                              <CircleDashed className="h-4 w-4" /> Pending
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              {/* Schedule Details */}
              <SectionCard
                title="Schedule Details"
                icon={Calendar}
                description="When should this visit happen?"
              >
                <div className="space-y-5">
                  {/* Date and Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                        Date
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Required
                        </span>
                      </label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                        Time Slot
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Required
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select time</option>
                          {generateTimeSlots().map(slot => (
                            <option key={slot} value={slot} disabled={isSlotDisabled(slot)}>
                              {slot} {isSlotDisabled(slot) ? '(Past)' : ''}
                            </option>
                          ))}
                        </select>
                        <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Visit Type */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      Visit Type
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.values(VISIT_TYPE).map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData(prev => ({ ...prev, visitType: type }))}
                          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                            formData.visitType === type
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                        >
                          {type === VISIT_TYPE.ONSITE ? <MapPin className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                          {type === VISIT_TYPE.ONSITE ? 'Onsite Visit' : 'Virtual Tour'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Agent Assignment */}
                  <div>
                    <label className="mb-3 flex items-center text-sm font-semibold text-gray-700">
                      Assign Agent
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        Required
                      </span>
                    </label>
                    <select
                      name="assignedAgentId"
                      value={formData.assignedAgentId}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select agent</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name} - {agent.role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </SectionCard>

              {/* Follow-up Details */}
              <SectionCard
                title="Follow-up Schedule"
                icon={Target}
                description="Plan follow-up actions after the visit"
              >
                <div className="space-y-5">
                  {/* Follow-up Date and Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        name="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        min={formData.scheduledDate || new Date().toISOString().split('T')[0]}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Follow-up Time
                      </label>
                      <div className="relative">
                        <select
                          name="followUpTime"
                          value={formData.followUpTime}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select time</option>
                          {generateTimeSlots().map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                        <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Priority and Action */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Priority
                      </label>
                      <select
                        name="followUpPriority"
                        value={formData.followUpPriority}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Next Action
                      </label>
                      <select
                        name="nextAction"
                        value={formData.nextAction}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="visit">Another Visit</option>
                      </select>
                    </div>
                  </div>

                  {/* Follow-up Notes */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Follow-up Notes
                    </label>
                    <textarea
                      name="followUpNote"
                      value={formData.followUpNote}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Add follow-up instructions or notes..."
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Review Section */}
              <SectionCard
                title="Review & Confirm"
                icon={FileText}
                description="Review all details before scheduling"
              >
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Visit Details</h4>
                      <ReviewRow 
                        label="Lead" 
                        value={assignedLeads.find(l => l._id === formData.leadId)?.name || 'Not selected'} 
                      />
                      <ReviewRow 
                        label="Project" 
                        value={projects.find(p => p._id === formData.projectId)?.name || 'Not selected'} 
                      />
                      <ReviewRow 
                        label="Unit" 
                        value={units.find(u => u._id === formData.unitId)?.name || 'Not selected'} 
                      />
                      <ReviewRow label="Date" value={formData.scheduledDate || 'Not set'} />
                      <ReviewRow label="Time" value={formData.scheduledTime || 'Not set'} />
                      <ReviewRow label="Visit Type" value={formData.visitType} />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Follow-up Details</h4>
                      <ReviewRow label="Follow-up Date" value={formData.followUpDate || 'Not set'} />
                      <ReviewRow label="Follow-up Time" value={formData.followUpTime || 'Not set'} />
                      <ReviewRow label="Priority" value={formData.followUpPriority} />
                      <ReviewRow label="Next Action" value={formData.nextAction} />
                      <ReviewRow 
                        label="Assigned Agent" 
                        value={agents.find(a => a._id === formData.assignedAgentId)?.name || 'Not selected'} 
                      />
                    </div>
                  </div>

                  {/* Confirmation Statuses */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="mb-3 font-semibold text-gray-900">Confirmation Status</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {confirmationStatuses.map((status) => (
                        <div
                          key={status.key}
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            formData[status.key]
                              ? status.color
                              : status.pendingColor
                          }`}
                        >
                          <status.icon className="h-4 w-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{status.label}</p>
                            <p className="text-xs opacity-75">{status.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            name={status.key}
                            checked={formData[status.key]}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 sm:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500">
                <p>All required fields must be completed before scheduling.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onClose(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 gap-2 shadow-lg shadow-blue-500/20 sm:flex-initial"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Scheduling...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Schedule Visit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSiteVisitDesktop;