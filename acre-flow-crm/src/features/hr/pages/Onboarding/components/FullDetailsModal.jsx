// ============================================
// FullDetailsModal.jsx - Comprehensive Onboarding Details View
// ============================================

import React from 'react';
import { X, Download, Calendar, Mail, Phone, User, FileText, CheckCircle, Clock, Circle } from 'lucide-react';

export const FullDetailsModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const downloadPDF = () => {
    // Create printable content
    const printContent = document.getElementById('printable-content');
    if (!printContent) return;

    // Simple HTML to PDF conversion using window.print
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'invited':
        return <Clock className="text-blue-500" size={20} />;
      default:
        return <Circle className="text-gray-400" size={20} />;
    }
  };

  const getStageLabel = (stage) => {
    const labels = {
      'interview1': 'First Interview',
      'hrDiscussion': 'HR Discussion',
      'documentation': 'Documentation',
      'success': 'Completed'
    };
    return labels[stage] || stage;
  };

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
            <div className="flex items-center justify-between pr-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{candidate.candidateName}</h2>
                <p className="text-gray-600 mt-1">Complete Onboarding Journey</p>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div id="printable-content">
              {/* Candidate Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Candidate Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{candidate.candidateEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p className="font-medium">{candidate.joiningDate ? formatDate(candidate.joiningDate) : 'Not Set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(candidate.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{candidate.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding Stages */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Stages</h3>
                <div className="space-y-4">
                  {candidate.stages?.map((stage, index) => {
                    const isCompleted = index < candidate.currentStageIndex || (index === candidate.currentStageIndex && candidate.status === 'completed');
                    const isCurrent = index === candidate.currentStageIndex && candidate.status !== 'completed';
                    const stageData = candidate.stageData?.[stage];
                    
                    return (
                      <div key={stage} className={`border rounded-lg p-4 ${
                        isCurrent ? 'border-blue-500 bg-blue-50' : 
                        isCompleted ? 'border-green-500 bg-green-50' : 
                        'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(stageData?.status || (isCompleted ? 'completed' : isCurrent ? 'invited' : 'pending'))}
                            <div>
                              <h4 className="font-semibold text-gray-900">{getStageLabel(stage)}</h4>
                              <p className="text-sm text-gray-600">
                                {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                              </p>
                            </div>
                          </div>
                          {stageData?.completedAt && (
                            <span className="text-sm text-gray-500">
                              {formatDate(stageData.completedAt)}
                            </span>
                          )}
                        </div>

                        {/* Stage Details */}
                        {stageData?.invite && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">Invite Details:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Type:</span> {stageData.invite.type}
                              </div>
                              {stageData.invite.scheduledAt && (
                                <div>
                                  <span className="text-gray-500">Scheduled:</span> {formatDate(stageData.invite.scheduledAt)}
                                </div>
                              )}
                              {stageData.invite.meetingLink && (
                                <div className="md:col-span-2">
                                  <span className="text-gray-500">Meeting Link:</span>{' '}
                                  <a href={stageData.invite.meetingLink} target="_blank" rel="noopener noreferrer" 
                                     className="text-blue-600 hover:underline">
                                    {stageData.invite.meetingLink}
                                  </a>
                                </div>
                              )}
                              {stageData.invite.location && (
                                <div className="md:col-span-2">
                                  <span className="text-gray-500">Location:</span> {stageData.invite.location}
                                </div>
                              )}
                              {stageData.invite.content && (
                                <div className="md:col-span-2 mt-2">
                                  <span className="text-gray-500">Message:</span>
                                  <p className="mt-1 text-gray-700 bg-white p-2 rounded">{stageData.invite.content}</p>
                                </div>
                              )}
                              {stageData.invite.tasks && stageData.invite.tasks.length > 0 && (
                                <div className="md:col-span-2 mt-2">
                                  <span className="text-gray-500">Tasks:</span>
                                  <ul className="mt-1 list-disc list-inside text-gray-700 bg-white p-2 rounded">
                                    {stageData.invite.tasks.map((task, idx) => (
                                      <li key={idx}>
                                        <strong>{task.title}</strong>
                                        {task.description && ` - ${task.description}`}
                                        {task.dueAt && ` (Due: ${formatDate(task.dueAt)})`}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {stageData?.feedback && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                            <p className="text-sm text-gray-600 bg-white p-2 rounded">{stageData.feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents */}
              {candidate.documents && candidate.documents.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidate.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium capitalize">{doc.docType}</p>
                            <p className="text-sm text-gray-500">Status: {doc.status}</p>
                            {doc.uploadedAt && (
                              <p className="text-xs text-gray-400">Uploaded: {formatDate(doc.uploadedAt)}</p>
                            )}
                          </div>
                          {doc.url && (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              View
                            </a>
                          )}
                        </div>
                        {doc.notes && (
                          <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              {candidate.history && candidate.history.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
                  <div className="space-y-3">
                    {candidate.history.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock size={16} className="text-gray-500 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{item.stage}</p>
                          {item.note && <p className="text-sm text-gray-600 mt-1">{item.note}</p>}
                          <p className="text-xs text-gray-400 mt-1">{formatDate(item.movedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};
