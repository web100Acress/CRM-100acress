import React, { useState } from "react";
import { X, Send, Calendar, Clock, MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/layout/dialog";
import { ENDPOINTS } from "@/api/endpoints";

const FollowUpModalMobile = ({ lead, onClose, userRole }) => {
  const userName = localStorage.getItem("userName") || "";

  const [formData, setFormData] = useState({
    comment: "",
    author: userName,
    role: userRole,
    date: "",
    time: "",
    place: "",
    relatedTo: lead?.name || "",
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

    try {
      const timestamp = `${formData.date} ${formData.time}`;

      const followUpData = {
        comment: formData.comment,
        author: formData.author,
        role: formData.role,
        timestamp,
        place: formData.place,
        relatedTo: formData.relatedTo,
      };

      const res = await fetch(
        ENDPOINTS.LEADS.ADD_FOLLOW_UP(lead._id),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(followUpData),
          credentials: "include",
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch (e) {}

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit follow-up");
      }

      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit follow-up");
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-[95vw] max-h-[85vh] overflow-hidden rounded-2xl border border-gray-200 p-0 shadow-2xl">

        {/* ===== Header ===== */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3 py-2.5 text-white">

          {/* Soft Glow */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-1.5 backdrop-blur-sm">
                <Calendar size={14} />
              </div>
              <div>
                <h2 className="text-sm font-semibold leading-tight">
                  Follow-up
                </h2>
                <p className="text-xs text-white/80 truncate max-w-[150px]">
                  {lead?.name}
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </div>

          {/* Divider */}
          <div className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
        </div>

        {/* ===== Body ===== */}
        <div className="max-h-[calc(85vh-60px)] overflow-y-auto px-3 py-2.5">

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-sm text-red-700 mb-1.5">
              {error}
            </div>
          )}

          {/* Comment */}
          <div className="mb-1.5">
            <label className="mb-0.5 block text-sm font-medium text-gray-700">
              💬 Comment
            </label>
            <textarea
              name="comment"
              rows="1.5"
              value={formData.comment}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your follow-up notes..."
              className="w-full resize-none rounded-lg border border-gray-300 px-2.5 py-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2 mb-1.5">
            <div>
              <label className="mb-0.5 block text-xs font-medium text-gray-600">
                <Calendar size={11} className="inline-block mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-2.5 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-0.5 block text-xs font-medium text-gray-600">
                <Clock size={11} className="inline-block mr-1" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-2.5 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Place */}
          <div className="mb-2">
            <label className="mb-0.5 block text-xs font-medium text-gray-600">
              <MapPin size={11} className="inline-block mr-1" />
              Meeting Place
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              placeholder="Office, Call, Video"
              className="w-full rounded-lg border border-gray-300 px-2.5 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Scheduling...
              </>
            ) : (
              <>
                <Send size={12} />
                Schedule Follow-up
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpModalMobile;
