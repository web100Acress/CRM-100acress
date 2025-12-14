// ============================================
// 12. src/pages/Onboarding/components/forms/DocumentationForm.jsx
// ============================================

import React from "react";

export const DocumentationForm = ({ form, setForm }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Document Upload</h4>
        <p className="text-gray-600 text-sm">Upload the required documents for verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setForm({ ...form, panFile: e.target.files[0] })}
            className="w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.panFile && <p className="text-xs text-green-600 mt-1">Selected: {form.panFile.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setForm({ ...form, aadhaarFile: e.target.files[0] })}
            className="w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.aadhaarFile && <p className="text-xs text-green-600 mt-1">Selected: {form.aadhaarFile.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setForm({ ...form, photoFile: e.target.files[0] })}
            className="w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.photoFile && <p className="text-xs text-green-600 mt-1">Selected: {form.photoFile.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marksheet/Degree</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setForm({ ...form, marksheetFile: e.target.files[0] })}
            className="w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.marksheetFile && <p className="text-xs text-green-600 mt-1">Selected: {form.marksheetFile.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Document 1</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => setForm({ ...form, otherFile1: e.target.files[0] })}
            className="w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.otherFile1 && <p className="text-xs text-green-600 mt-1">Selected: {form.otherFile1.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Document 2</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => setForm({ ...form, otherFile2: e.target.files[0] })}
            className="w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {form.otherFile2 && <p className="text-xs text-green-600 mt-1">Selected: {form.otherFile2.name}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date (optional, set when marking verified)</label>
        <input
          type="date"
          value={form.joiningDate}
          onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};