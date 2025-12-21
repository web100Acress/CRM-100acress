// ============================================
// 4. src/pages/Onboarding/components/Modal.jsx
// ============================================

import React from "react";

export const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {children}
      </div>
    </div>
  );
};