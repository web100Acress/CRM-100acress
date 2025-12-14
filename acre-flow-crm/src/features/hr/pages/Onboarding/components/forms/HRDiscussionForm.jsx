
import React from "react";

export const HRDiscussionForm = ({ form, setForm }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">HR Discussion Setup</h4>
      <div className="flex items-center space-x-3">
        <label className="font-medium text-sm text-gray-700">Discussion Mode</label>
        <select 
          value={form.mode} 
          onChange={(e) => setForm({ ...form, mode: e.target.value })} 
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="online">Online Discussion</option>
          <option value="offline">Offline Discussion</option>
        </select>
      </div>
      {form.mode === 'online' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Discussion Link</label>
            <input 
              value={form.meetingLink} 
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} 
              className="w-full border rounded-md px-3 py-2 text-sm" 
              placeholder="https://teams.microsoft.com/..." 
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm text-gray-700 mb-1">Discussion Location</label>
          <input 
            value={form.location} 
            onChange={(e) => setForm({ ...form, location: e.target.value })} 
            className="w-full border rounded-md px-3 py-2 text-sm" 
            placeholder="HR Meeting Room, 3rd Floor" 
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Discussion Start Time</label>
          <input 
            value={form.start} 
            onChange={(e) => setForm({ ...form, start: e.target.value })} 
            className="w-full border rounded-md px-3 py-2 text-sm" 
            placeholder="2025-10-15 14:00" 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Discussion End Time (optional)</label>
          <input 
            value={form.end} 
            onChange={(e) => setForm({ ...form, end: e.target.value })} 
            className="w-full border rounded-md px-3 py-2 text-sm" 
            placeholder="2025-10-15 15:00" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Discussion Topics/Agenda</label>
        <textarea 
          value={form.tasksRaw} 
          onChange={(e) => setForm({ ...form, tasksRaw: e.target.value })} 
          className="w-full border rounded-md px-3 py-2 text-sm" 
          rows={4} 
          placeholder="Company culture discussion\nSalary expectations\nBenefits overview\nQ&A session" 
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Discussion Notes</label>
        <textarea 
          value={form.message} 
          onChange={(e) => setForm({ ...form, message: e.target.value })} 
          className="w-full border rounded-md px-3 py-2 text-sm" 
          rows={3} 
          placeholder="This discussion will cover company culture, compensation package, and answer any questions you may have about joining our team." 
        />
      </div>
    </div>
  );
};