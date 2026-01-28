import React, { useState } from "react";
import api100acress from "../../admin/config/api100acressClient";
import { CheckCircle, Circle, Clock, Calendar, User, Mail, ChevronRight, FileText, X } from "lucide-react";
import { toast } from 'react-hot-toast';

// Simple modal component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const stageLabels = [
  { key: "interview1", label: "Interview 1" },
  { key: "hrDiscussion", label: "HR Discussion" },
  { key: "documentation", label: "Documentation" },
  { key: "success", label: "Success" },
];

const StageProgress = ({ stages, currentIndex, status }) => {
  return (
    <div className="flex items-center space-x-1">
      {stages.map((s, idx) => {
        const done = status === "completed" || idx < currentIndex;
        const current = idx === currentIndex && status !== "completed";
        const isLast = idx === stages.length - 1;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                done ? "bg-green-500 text-white" : current ? "bg-blue-500 text-white animate-pulse" : "bg-gray-200 text-gray-400"
              }`}>
                {done ? <CheckCircle size={18} /> : current ? <Clock size={18} /> : <Circle size={18} />}
              </div>
              <div className={`mt-1 text-xs font-medium text-center ${
                done ? "text-green-700" : current ? "text-blue-700" : "text-gray-400"
              }`}>
                {stageLabels.find((x) => x.key === s)?.label || s}
              </div>
            </div>
            {!isLast && (
              <div className={`mx-3 h-0.5 w-16 transition-all duration-300 ${
                done ? "bg-green-500" : "bg-gray-200"
              }`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const OnboardingWizard = ({ 
  wizardOpen, 
  setWizardOpen, 
  activeItem, 
  setActiveItem, 
  currentStep, 
  setCurrentStep, 
  wizardMode, 
  setWizardMode, 
  selectedStage, 
  setSelectedStage, 
  fetchList 
}) => {
  const [form, setForm] = useState({
    stage: 'interview1',
    mode: 'online',
    meetingLink: '',
    location: '',
    start: '',
    end: '',
    message: '',
    tasksRaw: '',
    panFile: null,
    aadhaarFile: null,
    photoFile: null,
    marksheetFile: null,
    otherFile1: null,
    otherFile2: null,
    joiningDate: '',
    rejectReason: '',
    resetStage: 'interview1',
    resetReason: '',
  });

  const closeWizard = () => { 
    setWizardOpen(false); 
    setActiveItem(null); 
    setCurrentStep(0); 
    setWizardMode('view'); 
    setSelectedStage(null); 
  };

  const submitInviteFromWizard = async () => {
    try {
      if (!activeItem) return;
      const stage = activeItem.stages[currentStep];
      if (!['interview1','hrDiscussion'].includes(stage)) {
        alert('Invites are only for Interview 1 or HR Discussion stages.');
        return;
      }
      const type = form.mode;
      const tasks = (form.tasksRaw || '').split('\n').map(l => l.trim()).filter(Boolean).map(t => ({ title: t }));
      const payload = {
        stage,
        type,
        meetingLink: type === 'online' ? (form.meetingLink || undefined) : undefined,
        location: type === 'offline' ? (form.location || undefined) : undefined,
        scheduledAt: form.start ? new Date(form.start) : undefined,
        endsAt: form.end ? new Date(form.end) : undefined,
        content: form.message || undefined,
        tasks,
      };
      await api100acress.post(`/api/hr/onboarding/${activeItem._id}/invite`, payload);
      toast?.success ? toast.success('Invite sent successfully!') : alert('Invite sent successfully!');
      fetchList();
      closeWizard();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to send invite');
    }
  };

  const submitCompleteFromWizard = async () => {
    try {
      if (!activeItem) return;
      const stage = activeItem.stages[currentStep];
      if (stage === 'documentation') {
        const body = {};
        if (form.joiningDate) body.joiningDate = form.joiningDate;
        await api100acress.post(`/api/hr/onboarding/${activeItem._id}/docs-complete`, body);
      } else if (['interview1','hrDiscussion'].includes(stage)) {
        await api100acress.post(`/api/hr/onboarding/${activeItem._id}/complete-stage`, { stage, feedback: form.message });
      } else {
        alert('Invalid stage to complete.');
        return;
      }
      fetchList();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to complete stage');
    }
  };

  const submitRejectFromWizard = async () => {
    try {
      if (!activeItem) return;
      const stage = activeItem.stages[currentStep];
      if (!['interview1','hrDiscussion','documentation'].includes(stage)) {
        alert('Invalid stage to reject.');
        return;
      }
      await api100acress.post(`/api/hr/onboarding/${activeItem._id}/reject-stage`, { stage, reason: form.rejectReason });
      fetchList();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to reject stage');
    }
  };

  const renderStageForm = () => {
    if (!activeItem) return null;
    const stage = activeItem.stages[currentStep];

    if (stage === 'interview1') {
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Interview 1 Setup</h4>
          <div className="flex items-center space-x-3">
            <label className="font-medium text-sm text-gray-700">Interview Mode</label>
            <select
              value={form.mode}
              onChange={(e)=>setForm({...form, mode:e.target.value})}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="online">Online Interview</option>
              <option value="offline">Offline Interview</option>
            </select>
          </div>
          {form.mode === 'online' ? (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Interview Link</label>
              <input
                value={form.meetingLink}
                onChange={(e)=>setForm({...form, meetingLink:e.target.value})}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="https://meet.google.com/..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Interview Location</label>
              <input
                value={form.location}
                onChange={(e)=>setForm({...form, location:e.target.value})}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Conference Room A, Office Building"
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Interview Start Time</label>
              <input
                value={form.start}
                onChange={(e)=>setForm({...form, start:e.target.value})}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="2025-10-15 10:30"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Interview End Time (optional)</label>
              <input
                value={form.end}
                onChange={(e)=>setForm({...form, end:e.target.value})}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="2025-10-15 11:30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Interview Preparation Tasks</label>
            <textarea
              value={form.tasksRaw}
              onChange={(e)=>setForm({...form, tasksRaw:e.target.value})}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={4}
              placeholder="Review resume\nPrepare technical questions\nSet up coding environment"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Interview Instructions</label>
            <textarea
              value={form.message}
              onChange={(e)=>setForm({...form, message:e.target.value})}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={3}
              placeholder="Please come prepared with your resume and portfolio."
            />
          </div>
        </div>
      );
    }
    
    if (stage === 'hrDiscussion') {
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">HR Discussion Setup</h4>
          <div className="flex items-center space-x-3">
            <label className="font-medium text-sm text-gray-700">Discussion Mode</label>
            <select value={form.mode} onChange={(e)=>setForm({...form, mode:e.target.value})} className="border rounded-md px-3 py-2 text-sm">
              <option value="online">Online Discussion</option>
              <option value="offline">Offline Discussion</option>
            </select>
          </div>
          {form.mode === 'online' ? (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Discussion Link</label>
              <input value={form.meetingLink} onChange={(e)=>setForm({...form, meetingLink:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="https://teams.microsoft.com/..." />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Discussion Location</label>
              <input value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="HR Meeting Room, 3rd Floor" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Discussion Start Time</label>
              <input value={form.start} onChange={(e)=>setForm({...form, start:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="2025-10-15 14:00" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Discussion End Time (optional)</label>
              <input value={form.end} onChange={(e)=>setForm({...form, end:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="2025-10-15 15:00" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Discussion Topics/Agenda</label>
            <textarea value={form.tasksRaw} onChange={(e)=>setForm({...form, tasksRaw:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" rows={4} placeholder="Company culture discussion\nSalary expectations\nBenefits overview\nQ&A session" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Discussion Notes</label>
            <textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" rows={3} placeholder="This discussion will cover company culture, compensation package." />
          </div>
        </div>
      );
    }
    
    if (stage === 'documentation') {
      return (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Document Upload</h4>
            <p className="text-gray-600 text-sm">Upload the required documents for verification</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setForm({ ...form, panFile: e.target.files[0] })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setForm({ ...form, aadhaarFile: e.target.files[0] })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setForm({ ...form, photoFile: e.target.files[0] })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marksheet/Degree</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setForm({ ...form, marksheetFile: e.target.files[0] })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date (optional)</label>
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      );
    }
    
    if (stage === 'success') {
      return (
        <div className="text-center py-8">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Onboarding Completed!</h3>
          <p className="text-gray-600">The candidate has successfully completed all stages.</p>
          {activeItem.joiningDate && (
            <p className="text-blue-600 mt-2">Joining Date: {new Date(activeItem.joiningDate).toLocaleDateString()}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Modal open={wizardOpen} onClose={closeWizard}>
      <div className="px-6 py-5 border-b bg-gray-50 relative">
        <button
          onClick={closeWizard}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 pr-8">{activeItem?.candidateName}</h3>
        <div className="mt-3">
          {activeItem && wizardMode === 'manage' && (
            <StageProgress stages={activeItem.stages} currentIndex={currentStep} status={activeItem.status} />
          )}
        </div>
      </div>
      <div className="p-6 max-h-[70vh] overflow-auto">
        {activeItem ? renderStageForm() : <div className="text-center py-8">Loading...</div>}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || wizardMode === 'view'}
          className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="space-x-2">
          {wizardMode === 'view' ? (
            <>
              <button onClick={closeWizard} className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700">
                Close
              </button>
            </>
          ) : (
            <>
              {activeItem && activeItem.status !== 'completed' && activeItem.stages && activeItem.stages[currentStep] !== 'success' && (
                <>
                  {(activeItem.stages[currentStep] === 'interview1' || activeItem.stages[currentStep] === 'hrDiscussion') ? (
                    <button onClick={submitInviteFromWizard} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Send Invite</button>
                  ) : null}
                  <button onClick={submitCompleteFromWizard} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Mark Done</button>
                  <button onClick={submitRejectFromWizard} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Reject</button>
                </>
              )}
              {activeItem && activeItem.stages && (
                <button
                  onClick={() => setCurrentStep(Math.min(activeItem.stages.length - 1, currentStep + 1))}
                  disabled={currentStep === activeItem.stages.length - 1}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingWizard;
