import React, { useState } from "react";
import { X, Send } from "lucide-react";
import ReactDOM from "react-dom";
import '../../style/FollowUpModal.css'

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


        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(followUpData),
        credentials: "include"
      });
      let data = {};
      try {
        data = await res.json();
      } catch (e) {}
      if (!res.ok) throw new Error(data.message || "Failed to submit follow-up");
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
      <div className="modal-backdrop"></div>

      {/* Modal Container */}
      <div className="modal-container">
        <div className="modal-box">
          <button className="modal-close" onClick={onClose}>
            <X className="icon" />
          </button>

          <h2 className="modal-title">Add Follow-up</h2>

          <form onSubmit={handleSubmit} className="form">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                className="form-textarea"
                value={formData.comment}
                onChange={handleChange}
                required
                placeholder="Enter your follow-up comments..."
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="form-input disabled"
                  value={formData.author}
                  disabled
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="form-input disabled"
                  value={formData.role}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="place">Meeting Place</label>
              <input
                type="text"
                id="place"
                name="place"
                className="form-input"
                value={formData.place}
                onChange={handleChange}
                required
                placeholder="e.g., Online Meeting, Client Office"
              />
            </div>

            <div className="form-group">
              <label htmlFor="relatedTo">Related to</label>
              <input
                type="text"
                id="relatedTo"
                name="relatedTo"
                className="form-input disabled"
                value={formData.relatedTo}
                disabled
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"><Send className="icon" /></span>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="icon" />
                  Submit Follow-up
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* CSS Styles */}
      
    </>,
    document.body
  );
};

export default FollowUpModal;
