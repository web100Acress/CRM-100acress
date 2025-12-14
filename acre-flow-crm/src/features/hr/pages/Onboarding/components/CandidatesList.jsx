
// ============================================

import React from "react";
import { Mail, User } from "lucide-react";

export const CandidatesList = ({ filteredList, loading, filterStatus, onViewDetails, onViewDocuments }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-4">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-semibold text-gray-800">Candidates</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {filteredList.map((it) => (
          <div 
            key={it._id} 
            className="px-6 py-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {it.candidateName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{it.candidateName}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail size={14} className="mr-1.5" />
                    <span className="truncate">{it.candidateEmail}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => onViewDetails(it, 'view')} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                  View Details
                </button>
                <button onClick={() => onViewDocuments(it)} className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors font-medium">
                  View Documents
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg font-medium">No candidates found</p>
            <p className="text-gray-400 text-sm mt-1">
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