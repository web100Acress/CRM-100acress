import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Building, Phone, Mail, Save, X, Loader2, ShieldCheck, CheckCircle2, CircleDashed, FileText, AlertCircle } from 'lucide-react';

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

// Demo Component
const ScheduleSiteVisitDemo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const mockLead = {
    _id: '12345',
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    location: 'Downtown Manhattan'
  };

  const [formData, setFormData] = useState({
    leadId: mockLead._id,
    projectId: '',
    unitId: '',
    scheduledDate: '',
    scheduledTime: '',
    visitType: 'Onsite',
    assignedAgentId: '',
    notes: '',
    clientConfirmation: false,
    agentConfirmation: false
  });

  const mockProjects = [
    { _id: '1', name: 'Skyline Towers' },
    { _id: '2', name: 'Harbor View Residences' },
    { _id: '3', name: 'Green Valley Estates' }
  ];

  const mockUnits = [
    { _id: 'u1', name: 'Unit 304', type: '2 BHK' },
    { _id: 'u2', name: 'Unit 507', type: '3 BHK' },
    { _id: 'u3', name: 'Unit 612', type: 'Penthouse' }
  ];

  const mockAgents = [
    { _id: 'a1', name: 'John Smith', role: 'bd' },
    { _id: 'a2', name: 'Emily Davis', role: 'team-leader' },
    { _id: 'a3', name: 'Michael Brown', role: 'hod' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.scheduledDate || !formData.scheduledTime || !formData.assignedAgentId) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Site visit scheduled successfully!');
      setIsOpen(false);
    }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="mx-auto max-w-4xl pt-20">
        <Button onClick={() => setIsOpen(true)} className="shadow-lg">
          <Calendar className="mr-2 h-4 w-4" />
          Open Schedule Modal
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  onClick={() => setIsOpen(false)}
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
                {/* Lead Snapshot */}
                <SectionCard
                  title="Lead Information"
                  icon={User}
                  description="Pre-filled from lead record"
                >
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: 'Lead Name', value: mockLead.name, icon: User },
                      { label: 'Phone', value: mockLead.phone, icon: Phone },
                      { label: 'Email', value: mockLead.email, icon: Mail },
                      { label: 'Location', value: mockLead.location, icon: MapPin }
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
                </SectionCard>

                {/* Two Column Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
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
                          {['Onsite', 'Virtual'].map(type => (
                            <button
                              key={type}
                              onClick={() => setFormData(prev => ({ ...prev, visitType: type }))}
                              className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                                formData.visitType === type
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                              }`}
                            >
                              {type === 'Onsite' ? <MapPin className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                              {type === 'Onsite' ? 'Onsite Visit' : 'Virtual Tour'}
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
                        <div className="space-y-2">
                          {mockAgents.map(agent => {
                            const isSelected = formData.assignedAgentId === agent._id;
                            return (
                              <button
                                key={agent._id}
                                onClick={() => setFormData(prev => ({ ...prev, assignedAgentId: agent._id }))}
                                className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                                    {agent.name[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                                    <p className="text-xs capitalize text-gray-500">{agent.role.replace('-', ' ')}</p>
                                  </div>
                                </div>
                                {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Property & Notes */}
                  <SectionCard
                    title="Property & Notes"
                    icon={Building}
                    description="Link property and add context"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Project
                        </label>
                        <select
                          name="projectId"
                          value={formData.projectId}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select project</option>
                          {mockProjects.map(project => (
                            <option key={project._id} value={project._id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.projectId && (
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Preferred Unit
                          </label>
                          <select
                            name="unitId"
                            value={formData.unitId}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select unit</option>
                            {mockUnits.map(unit => (
                              <option key={unit._id} value={unit._id}>
                                {unit.name} · {unit.type}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

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
                    </div>
                  </SectionCard>
                </div>

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

                {/* Review Summary */}
                <SectionCard
                  title="Summary Review"
                  icon={AlertCircle}
                  description="Quick overview before scheduling"
                >
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
                    <ReviewRow label="Lead Name" value={mockLead.name} />
                    <ReviewRow label="Visit Date" value={formData.scheduledDate || 'Not selected'} />
                    <ReviewRow label="Time Slot" value={formData.scheduledTime || 'Not selected'} />
                    <ReviewRow label="Visit Type" value={formData.visitType} />
                    <ReviewRow label="Assigned Agent" value={mockAgents.find(a => a._id === formData.assignedAgentId)?.name} />
                    <ReviewRow label="Project" value={mockProjects.find(p => p._id === formData.projectId)?.name} />
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm">All required fields must be filled before scheduling</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="flex-1 sm:flex-initial"
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
    </div>
  );
};

export default ScheduleSiteVisitDemo;