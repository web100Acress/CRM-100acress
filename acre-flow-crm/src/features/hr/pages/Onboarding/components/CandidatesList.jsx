// ============================================

import React from "react";
import { Mail, User, Trash2 } from "lucide-react";

export const CandidatesList = ({ filteredList, loading, filterStatus, onViewDetails, onViewDocuments, onDelete, onViewFullDetails }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-4 text-sm sm:text-base">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Candidates</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {filteredList.map((it) => (
          <div 
            key={it._id} 
            className="px-4 sm:px-6 py-4 sm:py-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {it.candidateName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{it.candidateName}</h3>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                    <Mail size={12} className="mr-1.5 flex-shrink-0" />
                    <span className="truncate">{it.candidateEmail}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button onClick={() => onViewDetails(it, 'view')} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                  View Status
                </button>
                <button onClick={() => onViewDocuments(it)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base">
                  View Documents
                </button>
                <button onClick={() => onViewFullDetails(it)} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base">
                  View Details
                </button>
                <button 
                  onClick={() => onDelete(it)} 
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-gray-400" size={window.innerWidth < 640 ? 24 : 32} />
            </div>
            <p className="text-gray-500 text-base sm:text-lg font-medium">No candidates found</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {filterStatus === "all" 
                ? "No candidates in onboarding yet" 
                : `No ${filterStatus} candidates`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};