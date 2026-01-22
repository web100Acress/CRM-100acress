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
    meetingMode: "online",
    onlinePlatform: "",
    workProgress: lead?.workProgress || "pending",
  });
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

      // 1. Submit Follow-up
      const res = await fetch(followUpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(followUpData),
        credentials: "include"
      });

      console.log('🔍 Follow-up response status:', res.status);

      let data = {};
      try {
        data = await res.json();
        console.log('🔍 Follow-up response data:', data);
      } catch (e) {
        console.error('🔍 Error parsing response:', e);
      }

      if (!res.ok) throw new Error(data.message || "Failed to submit follow-up");

      // 2. Update Lead Status (Work Progress)
      if (formData.workProgress) {
        const updateUrl = API_ENDPOINTS.LEADS_UPDATE(lead._id);
        await fetch(updateUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ workProgress: formData.workProgress })
        });
      }

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
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200 p-0">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label className="text-sm font-medium text-gray-700">Meeting Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="meetingMode"
                    value="online"
                    checked={formData.meetingMode === 'online'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Online</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="meetingMode"
                    value="offline"
                    checked={formData.meetingMode === 'offline'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Offline</span>
                </label>
              </div>
            </div>

            {formData.meetingMode === 'online' && (
              <div className="flex flex-col gap-2">
                <label htmlFor="onlinePlatform" className="text-sm font-medium text-gray-700">
                  Platform
                </label>
                <select
                  id="onlinePlatform"
                  name="onlinePlatform"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={formData.onlinePlatform}
                  onChange={handleChange}
                >
                  <option value="">Select Platform</option>
                  <option value="call">Via Call</option>
                  <option value="whatsapp">Via WhatsApp</option>
                  <option value="zoom">Zoom</option>
                  <option value="gmeet">Google Meet</option>
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="place" className="text-sm font-medium text-gray-700">
                {formData.meetingMode === 'offline' ? 'Location / Address' : 'Meeting Details'}
              </label>
              <input
                type="text"
                id="place"
                name="place"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={formData.place}
                onChange={handleChange}
                placeholder={formData.meetingMode === 'offline' ? "Enter meeting location" : "e.g., Online Meeting Link or details"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="workProgress" className="text-sm font-medium text-gray-700">
                Lead Status Update
              </label>
              <select
                id="workProgress"
                name="workProgress"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={formData.workProgress}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
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
