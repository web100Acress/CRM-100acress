import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { Dialog, DialogContent } from "@/layout/dialog";
import './FollowUpModal.css';

const FollowUpModal = ({ lead, onClose, userRole }) => {
  const userName = localStorage.getItem('userName') || '';
  const [formData, setFormData] = useState({
    comment: "",
    author: userName,
    role: userRole,
    date: "",
    time: "",
    place: "",
    relatedTo: lead?.name || "",
    status: lead?.workProgress || 'pending',
  });
  const [meetingMode, setMeetingMode] = useState('Online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log('🔍 Submitting follow-up for lead:', lead._id);
    console.log('🔍 Follow-up data:', formData);

    try {
      const timestamp = `${formData.date} ${formData.time}`;
      const followUpData = {
        comment: formData.comment,
        author: formData.author,
        role: formData.role,
        timestamp,
        place: formData.place,
        relatedTo: formData.relatedTo,
        addedBy: localStorage.getItem('userId'), // Add current user ID
      };

      const followUpUrl = API_ENDPOINTS.LEADS_ADD_FOLLOW_UP(lead._id);
      console.log('🔍 Follow-up API URL:', followUpUrl);
      console.log('🔍 Follow-up payload:', followUpData);

      const res = await fetch(followUpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(followUpData),
        credentials: "include"
      });

      // Update Lead Status
      if (formData.status && formData.status !== lead.workProgress) {
        try {
          await fetch(`${API_ENDPOINTS.LEADS}/${lead._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ workProgress: formData.status })
          });
          console.log('✅ Lead status updated to:', formData.status);
        } catch (statusErr) {
          console.error('❌ Failed to update lead status:', statusErr);
        }
      }

      console.log('🔍 Follow-up response status:', res.status);

      let data = {};
      try {
        data = await res.json();
        console.log('🔍 Follow-up response data:', data);
      } catch (e) {
        console.error('🔍 Error parsing response:', e);
      }

      if (!res.ok) throw new Error(data.message || "Failed to submit follow-up");
      console.log('✅ Follow-up submitted successfully!');
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('🔍 Follow-up submission error:', err);
      setError(err.message || "Failed to submit follow-up");
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200 p-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <h2 className="mb-6 text-center text-2xl font-semibold text-blue-700">Follow-up</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="3"
                className="min-h-[90px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                value={formData.comment}
                onChange={handleChange}
                required
                placeholder="Enter your follow-up comments..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Meeting Mode
              </label>
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setMeetingMode('Online');
                    setFormData(prev => ({ ...prev, place: 'Call' })); // Default to Call
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${meetingMode === 'Online'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMeetingMode('Offline');
                    setFormData(prev => ({ ...prev, place: '' })); // Clear for manual input
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${meetingMode === 'Offline'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Offline
                </button>
              </div>

              {meetingMode === 'Online' ? (
                <div className="flex flex-col gap-1">
                  <label htmlFor="place" className="text-xs text-gray-500">
                    Platform
                  </label>
                  <select
                    id="place"
                    name="place"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={formData.place}
                    onChange={handleChange}
                  >
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Google Meet">Google Meet</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label htmlFor="place" className="text-xs text-gray-500">
                    Location Address
                  </label>
                  <input
                    type="text"
                    id="place"
                    name="place"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formData.place}
                    onChange={handleChange}
                    placeholder="e.g., Client Office, Site Visit"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Update Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">
                    <Send className="h-4 w-4" />
                  </span>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Add Follow-up
                </>
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpModal;
