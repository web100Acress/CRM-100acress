import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("https://crm.100acress.com/api/api/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus(data.message || "Reset failed.");
      }
    } catch (err) {
      setStatus("Reset failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="reset-container">
      <form className="reset-box" onSubmit={handleReset}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="reset-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="reset-input"
        />
        <button className="reset-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {status && <div style={{ marginTop: 12, color: status.includes("successful") ? "green" : "red" }}>{status}</div>}
      </form>
      <style>{`
        .reset-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }
        .reset-box {
          background: #fff;
          padding: 2.5rem 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          min-width: 320px;
          max-width: 90vw;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        .reset-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }
        .reset-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
        }
        .reset-btn:disabled {
          background: #aaa;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword; 