// ============================================
// 8. src/pages/Onboarding/components/FilterTabs.jsx
// ============================================

import React from "react";

export const FilterTabs = ({ filterStatus, setFilterStatus, stats }) => {
  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => setFilterStatus("all")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          filterStatus === "all"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        All ({stats.total})
      </button>
      <button
        onClick={() => setFilterStatus("active")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          filterStatus === "active"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        Active ({stats.active})
      </button>
      <button
        onClick={() => setFilterStatus("completed")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          filterStatus === "completed"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        Completed ({stats.completed})
      </button>
    </div>
  );
};