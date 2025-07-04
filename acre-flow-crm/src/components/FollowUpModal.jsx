import React, { useState } from "react";
import { X, Send } from "lucide-react";

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Follow-up Submitted:", formData);
    // API call here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Modal Content Container */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 relative flex flex-col"
        style={{ width: '50%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
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
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center hover:bg-blue-700 transition duration-150 ease-in-out font-semibold text-lg"
          >
            <Send className="h-5 w-5 mr-2" />
            Submit Follow-up
          </button>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;