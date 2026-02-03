import React, { useMemo } from 'react';

const Messages = () => {
  const items = useMemo(
    () => [
      { id: '1', from: 'Admin', subject: 'Meeting Reminder', time: '2m ago', unread: true },
      { id: '2', from: 'Payroll', subject: 'Payslip Generated', time: '1h ago', unread: true },
      { id: '3', from: 'HR Team', subject: 'New Candidate Assigned', time: 'Yesterday', unread: false },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Messages</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4">
          <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((m) => (
            <div key={m.id} className="px-5 py-4 flex items-center justify-between hover:bg-[#f2f7ff]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">{m.subject}</p>
                  {m.unread && <span className="w-2 h-2 rounded-full bg-red-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-1 truncate">From: {m.from}</p>
              </div>
              <p className="text-xs text-slate-500">{m.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
