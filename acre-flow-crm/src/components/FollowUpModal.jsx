import React, { useState } from "react";
import { X, Send } from "lucide-react";
import ReactDOM from "react-dom";

const FollowUpModal = ({ lead, onClose, userRole }) => {
  const [formData, setFormData] = useState({
    comment: "",
    author: "",
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
      const res = await fetch(`http://localhost:5001/api/leads/${lead._id}/followups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(followUpData),
        credentials: "include"
      });
      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        // If response is empty or not JSON, data stays as {}
      }
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

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-40 z-40"></div>
      {/* Modal Content Container */}
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50">
        <div
          className="bg-white rounded-xl shadow-2xl p-6 relative flex flex-col"
          style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Header */}
          <button
            className=" bg-red-50 absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Add Follow-up
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={formData.comment}
                onChange={handleChange}
                required
                placeholder="Enter your follow-up comments..."
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base bg-gray-100 cursor-not-allowed"
                  value={formData.role}
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">Meeting Place</label>
              <input
                type="text"
                id="place"
                name="place"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
                value={formData.place}
                onChange={handleChange}
                required
                placeholder="e.g., Online Meeting, Client Office"
              />
            </div>

            <div>
              <label htmlFor="relatedTo" className="block text-sm font-medium text-gray-700 mb-1">Related to</label>
              <input
                type="text"
                id="relatedTo"
                name="relatedTo"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base bg-gray-100 cursor-not-allowed"
                value={formData.relatedTo}
                disabled
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center hover:bg-blue-700 transition duration-150 ease-in-out font-semibold text-lg disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin mr-2"><Send className="h-5 w-5" /></span>
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              {loading ? "Submitting..." : "Submit Follow-up"}
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default FollowUpModal;