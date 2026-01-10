
import React from "react";
import { CheckCircle } from "lucide-react";

export const Interview1Form = ({ form, setForm, isCompleted, isCurrent }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Interview 1 Setup</h4>
        {isCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            ✓ Completed
          </span>
        )}
        {isCurrent && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            In Progress
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <label className="font-medium text-sm text-gray-700">Interview Mode</label>
        <select
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
          className="border rounded-md px-3 py-2 text-sm"
          disabled={isCompleted}
        >
          <option value="online">Online Interview</option>
          <option value="offline">Offline Interview</option>
        </select>
      </div>

      {form.mode === 'online' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Interview Link</label>
            <input
              value={form.meetingLink}
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="https://meet.google.com/..."
              disabled={isCompleted}
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm text-gray-700 mb-1">Interview Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="Conference Room A, Office Building"
            disabled={isCompleted}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Interview Start Time</label>
          <input
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="2025-10-15 10:30"
            disabled={isCompleted}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Interview End Time (optional)</label>
          <input
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="2025-10-15 11:30"
            disabled={isCompleted}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Interview Preparation Tasks</label>
        <textarea
          value={form.tasksRaw}
          onChange={(e) => setForm({ ...form, tasksRaw: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          rows={4}
          placeholder="Review resume\nPrepare technical questions\nSet up coding environment"
          disabled={isCompleted}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Interview Instructions</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
          rows={3}
          placeholder="Please come prepared with your resume and portfolio. The interview will cover technical skills and problem-solving."
          disabled={isCompleted}
        />
      </div>

      {isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">Interview 1 has been completed</span>
          </div>
          <p className="text-green-700 text-sm mt-1">Ready to proceed to HR Discussion</p>
        </div>
      )}
    </div>
  );
};