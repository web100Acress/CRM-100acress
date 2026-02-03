import React, { useMemo } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

const Jobs = () => {
  const rows = useMemo(
    () => [
      { id: '1', title: 'Sales Executive', dept: 'Sales', posted: '2 days ago', status: 'Open' },
      { id: '2', title: 'User Experience Designer', dept: 'Design', posted: '10 min ago', status: 'Open' },
      { id: '3', title: 'Product Manager', dept: 'Product', posted: '5 min ago', status: 'Closed' },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Jobs</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Jobs</h1>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-semibold"
          >
            Export
            <HiOutlineChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e9f2ff]">
              <tr className="text-left text-xs font-semibold text-slate-700">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Posted</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                  <td className="px-5 py-4 text-sm text-slate-900">{r.title}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.dept}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.posted}</td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
