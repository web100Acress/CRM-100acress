import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { CheckCircle, XCircle, MessageSquare, Target, DollarSign, Save, X, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { INTEREST_LEVEL } from '@/models/siteVisitModel';

const SiteVisitFeedbackModal = ({ 
  isOpen, 
  onClose, 
  siteVisit, 
  onSave 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    interestLevel: '',
    budgetMatch: false,
    remarks: '',
    preferredUnit: '',
    objectionReason: '',
    nextAction: {
      followUpDate: '',
      followUpNote: ''
    }
  });

  useEffect(() => {
    if (isOpen && siteVisit) {
      setFormData({
        interestLevel: siteVisit.feedback?.interestLevel || '',
        budgetMatch: siteVisit.feedback?.budgetMatch || false,
        remarks: siteVisit.feedback?.remarks || '',
        preferredUnit: siteVisit.feedback?.preferredUnit || '',
        objectionReason: siteVisit.feedback?.objectionReason || '',
        nextAction: {
          followUpDate: siteVisit.feedback?.nextAction?.followUpDate || '',
          followUpNote: siteVisit.feedback?.nextAction?.followUpNote || ''
        }
      });
    }
  }, [isOpen, siteVisit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('nextAction.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nextAction: {
          ...prev.nextAction,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.interestLevel) {
      toast({
        title: 'Validation Error',
        description: 'Please select interest level',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.interestLevel === INTEREST_LEVEL.COLD && !formData.objectionReason) {
      toast({
        title: 'Validation Error',
        description: 'Please provide objection reason for cold interest',
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
      
      const feedbackData = {
        ...formData,
        submittedBy: currentUser,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch(API_ENDPOINTS.SITE_VISITS_FEEDBACK(siteVisit._id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update site visit status to completed
        await completeSiteVisit();

        toast({
          title: 'Success',
          description: 'Feedback submitted successfully!',
        });

        onSave && onSave(result.data);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit feedback',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const completeSiteVisit = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('userId');
      
      await fetch(API_ENDPOINTS.SITE_VISITS_COMPLETE(siteVisit._id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Completed',
          completedBy: currentUser,
          completedAt: new Date().toISOString()
        }),
      });

      // Update lead status based on feedback
      await updateLeadStatus();
    } catch (error) {
      console.error('Error completing site visit:', error);
    }
  };

  const updateLeadStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      let newStatus = 'Site Visit Done';

      // Update lead status based on interest level
      if (formData.interestLevel === INTEREST_LEVEL.HOT) {
        newStatus = 'Negotiation';
      } else if (formData.interestLevel === INTEREST_LEVEL.COLD) {
        newStatus = 'Cold';
      }

      await fetch(API_ENDPOINTS.LEADS_UPDATE(siteVisit.leadId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          lastSiteVisitStatus: 'Completed',
          lastSiteVisitDate: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  if (!isOpen || !siteVisit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Site Visit Feedback
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visit Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Visit Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Lead:</span> {siteVisit.leadName}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(siteVisit.scheduledDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Time:</span> {siteVisit.scheduledTime}
              </div>
              <div>
                <span className="font-medium">Type:</span> {siteVisit.visitType}
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Feedback Details</h3>
            
            {/* Interest Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Level *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(INTEREST_LEVEL).map(level => (
                  <label key={level} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="interestLevel"
                      value={level}
                      checked={formData.interestLevel === level}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">{level}</div>
                      <div className="text-xs text-gray-500">
                        {level === INTEREST_LEVEL.HOT && 'Ready to book'}
                        {level === INTEREST_LEVEL.WARM && 'Interested but needs time'}
                        {level === INTEREST_LEVEL.COLD && 'Not interested'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Match */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="budgetMatch"
                  checked={formData.budgetMatch}
                  onChange={handleChange}
                  className="mr-2"
                />
                <DollarSign className="w-4 h-4 mr-1" />
                Budget matches client requirements
              </label>
            </div>

            {/* Preferred Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Unit
              </label>
              <input
                type="text"
                name="preferredUnit"
                value={formData.preferredUnit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unit number or type they preferred"
              />
            </div>

            {/* Objection Reason */}
            {formData.interestLevel === INTEREST_LEVEL.COLD && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objection Reason *
                </label>
                <textarea
                  name="objectionReason"
                  value={formData.objectionReason}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reason for not being interested..."
                  required
                />
              </div>
            )}

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed feedback about the visit..."
              />
            </div>

            {/* Next Action */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Next Action
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    name="nextAction.followUpDate"
                    value={formData.nextAction.followUpDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Note
                  </label>
                  <input
                    type="text"
                    name="nextAction.followUpNote"
                    value={formData.nextAction.followUpNote}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Action to be taken"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warning for Cold Interest */}
          {formData.interestLevel === INTEREST_LEVEL.COLD && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Cold Interest Detected</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Lead status will be updated to "Cold". Consider if this lead should be reactivated in the future.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SiteVisitFeedbackModal;
