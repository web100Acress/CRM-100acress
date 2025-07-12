import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import '@/styles/SettingsContent.css'

const FollowUpModal = ({ lead, onClose, userRole }) => {
  const [formData, setFormData] = useState({
    comment: '',
    author: '',
    role: userRole,
    date: '',
    time: '',
    place: '',
    relatedTo: lead?.name || '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Follow-up Submitted:', formData);
    // TODO: Connect to API here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">Add Follow-up</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-800">
          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              name="comment"
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              value={formData.comment}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Author</label>
            <input
              name="author"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <input
              name="role"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              value={formData.role}
              disabled
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Time</label>
            <input
              type="time"
              name="time"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Meeting Place</label>
            <input
              name="place"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.place}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Related To</label>
            <input
              name="relatedTo"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              value={formData.relatedTo}
              disabled
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-3 rounded hover:bg-blue-700 flex justify-center items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
