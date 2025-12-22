// ============================================
// src/pages/Onboarding/index.jsx (Main Component)
// ============================================

import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { X, FileText, CheckCircle, Circle, Clock, UserPlus } from "lucide-react";

// Import hooks
import { useOnboarding } from "./hooks/useOnboarding";

// Import constants
import { stageLabels, WIZARD_MODES } from "./constants";

// Import services
import { onboardingService } from "./services/onboardingService";

// Import components
import { Modal } from "./components/Modal";
import { StageProgress } from "./components/StageProgress";
import { Header } from "./components/Header";
import { StatsCards } from "./components/StatsCards";
import { FilterTabs } from "./components/FilterTabs";
import { CandidatesList } from "./components/CandidatesList";

// Import forms
import { Interview1Form } from "./components/forms/Interview1Form";
import { HRDiscussionForm } from "./components/forms/HRDiscussionForm";
import { DocumentationForm } from "./components/forms/DocumentationForm";

// Import modals
// (DocumentsModal and StageDetailsModal would be separate files)

const Onboarding = () => {
  const { list, filteredList, stats, loading, error, filterStatus, setFilterStatus, fetchList } = useOnboarding();

  // Wizard Modal States
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardMode, setWizardMode] = useState(WIZARD_MODES.VIEW);
  const [selectedStage, setSelectedStage] = useState(null);

  // Documents Modal States
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [documentsItem, setDocumentsItem] = useState(null);

  // Add Employee Modal States
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    candidateName: '',
    candidateEmail: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    notes: ''
  });
  const [creatingEmployee, setCreatingEmployee] = useState(false);

  // Form State
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

  // ==================== Wizard Functions ====================

  const openWizard = (it, mode = WIZARD_MODES.VIEW) => {
    setActiveItem(it);
    setWizardMode(mode);

    let stepIndex = 0;
    if (mode === WIZARD_MODES.VIEW) {
      const current = it.stages[it.currentStageIndex];
      const stage = current === 'success' ? 'documentation' : current;
      stepIndex = it.stages.indexOf(stage);
    } else {
      stepIndex = it.currentStageIndex;
      if (it.status === 'completed') {
        stepIndex = it.stages.length - 1;
      }
    }

    setCurrentStep(stepIndex);

    // Pre-populate form
    const currentStage = it.stages[stepIndex];
    let formData = {
      stage: currentStage,
      mode: 'online',
      meetingLink: '',
      location: '',
      start: '',
      end: '',
      message: '',
      tasksRaw: '',
      panUrl: '', aadhaarUrl: '', photoUrl: '', marksheetUrl: '', other1: '', other2: '',
      joiningDate: it.joiningDate || '',
      rejectReason: '',
      resetStage: 'interview1',
      resetReason: ''
    };

    if (it.stageData && it.stageData[currentStage] && it.stageData[currentStage].invite) {
      const stageInvite = it.stageData[currentStage].invite;
      formData.mode = stageInvite.type || 'online';
      formData.meetingLink = stageInvite.meetingLink || '';
      formData.location = stageInvite.location || '';
      formData.start = stageInvite.scheduledAt ? new Date(stageInvite.scheduledAt).toISOString().slice(0, 16) : '';
      formData.end = stageInvite.endsAt ? new Date(stageInvite.endsAt).toISOString().slice(0, 16) : '';
      formData.message = stageInvite.content || '';
      formData.tasksRaw = stageInvite.tasks ? stageInvite.tasks.map(t => t.title).join('\n') : '';
    }

    if (it.documents && it.documents.length > 0) {
      it.documents.forEach(doc => {
        if (doc.docType === 'pan') formData.panUrl = doc.url;
        if (doc.docType === 'aadhaar') formData.aadhaarUrl = doc.url;
        if (doc.docType === 'photo') formData.photoUrl = doc.url;
        if (doc.docType === 'marksheet') formData.marksheetUrl = doc.url;
        if (doc.docType === 'other' && !formData.other1) formData.other1 = doc.url;
        if (doc.docType === 'other' && formData.other1) formData.other2 = doc.url;
      });
    }

    setForm(formData);
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setActiveItem(null);
    setCurrentStep(0);
    setWizardMode(WIZARD_MODES.VIEW);
    setSelectedStage(null);
  };

  const openCompletedSteps = (it) => {
    setActiveItem(it);
    setWizardMode(WIZARD_MODES.COMPLETED);
    setWizardOpen(true);
  };

  const openStageDetails = (it, stage) => {
    setActiveItem(it);
    setSelectedStage(stage);
    setWizardMode(WIZARD_MODES.STAGE_DETAILS);
    setWizardOpen(true);
  };

  // ==================== Documents Modal Functions ====================

  const openDocumentsModal = (it) => {
    setDocumentsItem(it);
    setDocumentsOpen(true);
  };

  const closeDocumentsModal = () => {
    setDocumentsOpen(false);
    setDocumentsItem(null);
  };

  // ==================== Add Employee Functions ====================

  const openAddEmployeeModal = () => {
    setEmployeeForm({
      candidateName: '',
      candidateEmail: '',
      phone: '',
      position: '',
      department: '',
      joiningDate: '',
      notes: ''
    });
    setAddEmployeeOpen(true);
  };

  const closeAddEmployeeModal = () => {
    setAddEmployeeOpen(false);
    setEmployeeForm({
      candidateName: '',
      candidateEmail: '',
      phone: '',
      position: '',
      department: '',
      joiningDate: '',
      notes: ''
    });
  };

  const handleCreateEmployee = async () => {
    if (!employeeForm.candidateName || !employeeForm.candidateEmail) {
      alert('Please fill in candidate name and email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeForm.candidateEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setCreatingEmployee(true);
    try {
      const newEmployee = await onboardingService.createManual(employeeForm);
      toast?.success ? toast.success('Employee added successfully!') : alert('Employee added successfully!');
      closeAddEmployeeModal();
      fetchList(); // Refresh the list
      
      // Automatically open wizard for step-by-step onboarding
      setTimeout(() => {
        openWizard(newEmployee, WIZARD_MODES.MANAGE);
      }, 500);
    } catch (e) {
      console.error('Error creating employee:', e);
      alert(e?.response?.data?.message || 'Failed to add employee');
    } finally {
      setCreatingEmployee(false);
    }
  };

  // ==================== Delete Function ====================

  const handleDeleteOnboarding = async (candidate) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete ${candidate.candidateName} (${candidate.candidateEmail})?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) {
      return;
    }

    try {
      await onboardingService.deleteOnboarding(candidate._id);
      toast?.success ? toast.success('Onboarding entry deleted successfully!') : alert('Onboarding entry deleted successfully!');
      fetchList(); // Refresh the list
    } catch (e) {
      console.error('Error deleting onboarding:', e);
      alert(e?.response?.data?.message || 'Failed to delete onboarding entry');
    }
  };

  // ==================== Form Submission Functions ====================

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
      await onboardingService.inviteStage(activeItem._id, payload);
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
        await onboardingService.docsComplete(activeItem._id, body);
      } else if (['interview1','hrDiscussion'].includes(stage)) {
        await onboardingService.completeStage(activeItem._id, stage, form.message);
      } else {
        alert('Invalid stage to complete.');
        return;
      }
      fetchList();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to complete stage');
    }
  };

  const submitDocsFromWizard = async () => {
    try {
      if (!activeItem) return;
      
      // Use the new token-based upload flow
      const uploadData = await onboardingService.generateUploadLink(activeItem._id);
      if (!uploadData || !uploadData.token) {
        alert('Failed to generate upload link');
        return;
      }
      
      // Create FormData for the new endpoint
      const formData = new FormData();
      if (form.panFile) formData.append('panFile', form.panFile);
      if (form.aadhaarFile) formData.append('aadhaarFile', form.aadhaarFile);
      if (form.photoFile) formData.append('photoFile', form.photoFile);
      if (form.marksheetFile) formData.append('marksheetFile', form.marksheetFile);
      if (form.otherFile1) formData.append('otherFile1', form.otherFile1);
      if (form.otherFile2) formData.append('otherFile2', form.otherFile2);
      if (form.joiningDate) formData.append('joiningDate', form.joiningDate);
      
      // Upload to 100 backend using token
      const response = await fetch(`https://api.100acress.com/career/upload-documents/${uploadData.token}`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        fetchList();
        alert('Documents uploaded successfully!');
      } else {
        alert(result.message || 'Failed to upload documents');
      }
    } catch (e) {
      console.error('Error uploading documents:', e);
      alert(e?.response?.data?.message || 'Failed to upload documents');
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
      await onboardingService.rejectStage(activeItem._id, stage, form.rejectReason);
      fetchList();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to reject stage');
    }
  };

  const submitResetFromWizard = async () => {
    try {
      if (!activeItem) return;
      await onboardingService.reset(activeItem._id, form.resetStage, form.resetReason);
      alert('Onboarding reset to selected stage');
      fetchList();
      closeWizard();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to reset onboarding');
    }
  };

  const sendDocsInvite = async (id) => {
    try {
      const uploadData = await onboardingService.generateUploadLink(id);
      if (!uploadData || !uploadData.token) {
        alert('Failed to generate upload link');
        return;
      }
      
      // Construct the frontend upload URL using the token
      const frontendUrl = `${window.location.origin}/upload-documents/${uploadData.token}`;
      
      const content = prompt("Message to candidate (optional)", "Please upload your documents for verification using the link below.");
      const response = await onboardingService.sendDocsInvite(id, frontendUrl, content);
      
      // Check if email sending failed
      if (response?.data?.warning) {
        // Show warning and provide link to copy
        const message = `${response.data.warning}\n\nUpload Link:\n${response.data.uploadLink}\n\nPlease share this link manually with the candidate.`;
        if (confirm(message + '\n\nClick OK to copy the link to clipboard.')) {
          try {
            await navigator.clipboard.writeText(response.data.uploadLink);
            toast?.success ? toast.success('Link copied to clipboard!') : alert('Link copied to clipboard!');
          } catch (err) {
            // Fallback if clipboard API fails
            prompt('Copy this link:', response.data.uploadLink);
          }
        }
      } else {
        toast?.success ? toast.success('Documentation invite sent successfully!') : alert('Documentation invite sent successfully!');
      }
      fetchList();
    } catch (e) {
      console.error('Error sending docs invite:', e);
      alert(e?.response?.data?.message || 'Failed to send docs invite');
    }
  };

  const sendUploadLink = async (onboardingId) => {
    try {
      const uploadData = await onboardingService.generateUploadLink(onboardingId);
      if (uploadData && uploadData.token) {
        // Construct the frontend upload URL using the token
        const frontendUrl = `${window.location.origin}/upload-documents/${uploadData.token}`;
        
        try { 
          await navigator.clipboard.writeText(frontendUrl); 
          toast?.success ? toast.success('Upload link copied to clipboard') : alert('Link copied to clipboard!');
        } catch {}
        
        window.open(frontendUrl, '_blank');
      } else {
        alert('Failed to generate upload link');
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to send link');
    }
  };

  // ==================== Render Stage Form ====================

  const renderStageForm = () => {
    // ... (rest of the code remains the same)
    if (!activeItem) return null;
    const stage = activeItem.stages[currentStep];

    if (wizardMode === WIZARD_MODES.VIEW) {
      // View mode logic

      return (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Current Stage: {stageLabels.find((x) => x.key === stage)?.label || stage}</h4>
            <p className="text-gray-600">Viewing onboarding progress for {activeItem.candidateName}</p>
          </div>
          <div className="space-y-4">
            {activeItem.stages.slice(0, currentStep + 1).map((stageItem, index) => {
              const isCompleted = index < currentStep || (index === currentStep && activeItem.status === 'completed');
              const isCurrent = index === currentStep && activeItem.status !== 'completed';
              return (
                <div key={stageItem} className={`border rounded-lg p-4 ${isCurrent ? 'border-blue-500 bg-blue-50' : isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    {isCompleted ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : isCurrent ? (
                      <Clock className="text-blue-500" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                    <span className={`font-medium ${isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                      {stageLabels.find((x) => x.key === stageItem)?.label || stageItem}
                    </span>
                  </div>
                  {stageItem === 'success' && activeItem.joiningDate && (
                    <p className="text-sm text-gray-600 ml-8">Joining Date: {new Date(activeItem.joiningDate).toLocaleDateString()}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (stage === 'interview1') {
      const isCompleted = activeItem.currentStageIndex > activeItem.stages.indexOf('interview1');
      const isCurrent = activeItem.currentStageIndex === activeItem.stages.indexOf('interview1') && activeItem.status !== 'completed';
      return <Interview1Form form={form} setForm={setForm} isCompleted={isCompleted} isCurrent={isCurrent} />;
    }

    if (stage === 'hrDiscussion') {
      return <HRDiscussionForm form={form} setForm={setForm} />;
    }

    if (stage === 'documentation') {
      return <DocumentationForm form={form} setForm={setForm} />;
    }

    if (stage === 'success') {
      return (
        <div className="text-center py-8">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Onboarding Completed!</h3>
          <p className="text-gray-600">The candidate has successfully completed all stages.</p>
          {activeItem && activeItem.joiningDate && (
            <p className="text-blue-600 mt-2">Joining Date: {new Date(activeItem.joiningDate).toLocaleDateString()}</p>
          )}
        </div>
      );
    }

    return null;
  };

  // ==================== Main Render ====================

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-x-hidden">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 ml-0">
        <div className="w-full mx-auto max-w-7xl overflow-x-hidden">
          <Header onAddEmployee={openAddEmployeeModal} />
          <StatsCards stats={stats} />
          <FilterTabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} stats={stats} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <CandidatesList 
            filteredList={filteredList} 
            loading={loading} 
            filterStatus={filterStatus}
            onViewDetails={openWizard}
            onViewDocuments={openDocumentsModal}
            onDelete={handleDeleteOnboarding}
          />
        </div>
      </div>

      {/* Wizard Modal */}
      <Modal open={wizardOpen} onClose={closeWizard}>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b bg-gray-50 relative">
          <button onClick={closeWizard} className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={window.innerWidth < 640 ? 18 : 20} className="text-gray-500" />
          </button>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-8 sm:pr-8 truncate">{activeItem?.candidateName}</h3>
          <div className="mt-2 sm:mt-3">
            {activeItem && wizardMode === WIZARD_MODES.MANAGE && (
              <StageProgress stages={activeItem.stages} currentIndex={currentStep} status={activeItem.status} />
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-auto">
          {activeItem ? renderStageForm() : <div className="text-center py-8">Loading...</div>}
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || wizardMode === WIZARD_MODES.VIEW}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {wizardMode === WIZARD_MODES.VIEW && (
                <>
                  <button onClick={() => openCompletedSteps(activeItem)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base">
                    Completed Steps
                  </button>
                  {activeItem && activeItem.status !== 'completed' && (
                    <button onClick={() => openWizard(activeItem, WIZARD_MODES.MANAGE)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm sm:text-base">
                      Proceed to Manage
                    </button>
                  )}
                  <button onClick={closeWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 text-sm sm:text-base">
                    Close
                  </button>
                </>
              )}
              {wizardMode === WIZARD_MODES.MANAGE && (
                <>
                  {activeItem && activeItem.status !== 'completed' && activeItem.stages && activeItem.stages[currentStep] !== 'success' && (
                    <>
                      {(activeItem.stages[currentStep] === 'interview1' || activeItem.stages[currentStep] === 'hrDiscussion') && (
                        <button onClick={submitInviteFromWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base">Send Invite</button>
                      )}
                      {activeItem.stages[currentStep] === 'documentation' && (
                        <>
                          <button onClick={() => sendDocsInvite(activeItem._id)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm sm:text-base">Invite to Candidate</button>
                          <button onClick={() => sendUploadLink(activeItem._id)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 text-sm sm:text-base">Open Upload Form</button>
                          <button onClick={submitDocsFromWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base">Submit Documents</button>
                        </>
                      )}
                      <button onClick={submitCompleteFromWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base">Mark Done</button>
                      <button onClick={submitRejectFromWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base">Reject</button>
                      <button onClick={submitResetFromWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-sm sm:text-base">Reset to Stage</button>
                    </>
                  )}
                  {activeItem && activeItem.status === 'completed' && activeItem.stages && currentStep === activeItem.stages.length - 1 ? (
                    <button onClick={closeWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base">Complete Onboarding</button>
                  ) : (
                    activeItem && activeItem.stages && (
                      <button
                        onClick={() => setCurrentStep(Math.min(activeItem.stages.length - 1, currentStep + 1))}
                        disabled={currentStep === activeItem.stages.length - 1}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Next
                      </button>
                    )
                  )}
                </>
              )}
              {wizardMode === WIZARD_MODES.COMPLETED && (
                <button onClick={closeWizard} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 text-sm sm:text-base">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Documents Modal */}
      <Modal open={documentsOpen} onClose={closeDocumentsModal}>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b bg-gray-50 relative">
          <button onClick={closeDocumentsModal} className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={window.innerWidth < 640 ? 18 : 20} className="text-gray-500" />
          </button>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-8 sm:pr-8 truncate">{documentsItem?.candidateName} - Documents</h3>
        </div>
        <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-auto">
          {documentsItem ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documentsItem.documents && documentsItem.documents.length > 0 ? (
                  documentsItem.documents.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">{doc.docType}</span>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium text-center sm:text-left">
                          View Document
                        </a>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 break-all">{doc.url}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-gray-400" size={window.innerWidth < 640 ? 24 : 32} />
                    </div>
                    <p className="text-gray-500 text-base sm:text-lg font-medium">No documents uploaded yet</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Documents will appear here once uploaded by the candidate</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">Loading...</div>
          )}
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t flex justify-end">
          <button onClick={closeDocumentsModal} className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700">
            Close
          </button>
        </div>
      </Modal>

      {/* Add Employee Modal */}
      <Modal open={addEmployeeOpen} onClose={closeAddEmployeeModal}>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b bg-gray-50 relative">
          <button onClick={closeAddEmployeeModal} className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={window.innerWidth < 640 ? 18 : 20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <UserPlus className="text-white" size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Add New Employee</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">Fill in the details to start step-by-step onboarding</p>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-auto">
          <div className="space-y-4">
            {/* Candidate Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={employeeForm.candidateName}
                onChange={(e) => setEmployeeForm({ ...employeeForm, candidateName: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter employee full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={employeeForm.candidateEmail}
                onChange={(e) => setEmployeeForm({ ...employeeForm, candidateEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="employee@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 1234567890"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position / Job Title
              </label>
              <input
                type="text"
                value={employeeForm.position}
                onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Developer"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., IT, HR, Sales"
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Joining Date
              </label>
              <input
                type="date"
                value={employeeForm.joiningDate}
                onChange={(e) => setEmployeeForm({ ...employeeForm, joiningDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={employeeForm.notes}
                onChange={(e) => setEmployeeForm({ ...employeeForm, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any additional information about the employee..."
              />
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={closeAddEmployeeModal}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={creatingEmployee}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateEmployee}
            disabled={creatingEmployee || !employeeForm.candidateName || !employeeForm.candidateEmail}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {creatingEmployee ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create & Start Onboarding
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Onboarding;