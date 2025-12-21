// ============================================
// 6. src/pages/Onboarding/components/Header.jsx
// ============================================

import React from "react";
import { UserPlus } from "lucide-react";

export const Header = ({ onAddEmployee }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Onboarding Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage employee onboarding journey step by step</p>
      </div>
      {onAddEmployee && (
        <button
          onClick={onAddEmployee}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus size={20} />
          <span className="hidden sm:inline">Add Employee</span>
          <span className="sm:hidden">Add</span>
        </button>
      )}
    </div>
  );
};