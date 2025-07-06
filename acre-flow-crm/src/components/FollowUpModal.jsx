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
                  className="form-input"
                  value={formData.author}
                  onChange={handleChange}
                  required
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
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 40;
        }
        .modal-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-box {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          padding: 24px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: #fee2e2;
          border: none;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-title {
          font-size: 22px;
          font-weight: bold;
          color: #1d4ed8;
          text-align: center;
          margin-bottom: 20px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #374151;
        }
        .form-input,
        .form-textarea {
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .form-input.disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }
        .form-error {
          color: red;
          font-size: 14px;
        }
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 600px) {
          .form-row {
            flex-direction: row;
          }
        }
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #2563eb;
          color: white;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .submit-btn:hover {
          background-color: #1e40af;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .icon {
          width: 18px;
          height: 18px;
        }
        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>,
    document.body
  );
};

export default FollowUpModal;
