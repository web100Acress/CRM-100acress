import React, { useMemo } from 'react';
import { HiOutlineChevronDown, HiOutlineFilter } from 'react-icons/hi';

const Attendance = () => {
  const rows = useMemo(
    () => [
      { id: '1', name: 'Aman', date: '03/02/2026', status: 'Present', checkIn: '10:02 AM', checkOut: '07:05 PM' },
      { id: '2', name: 'Biruk', date: '03/02/2026', status: 'Present', checkIn: '09:45 AM', checkOut: '06:50 PM' },
      { id: '3', name: 'Redwan', date: '03/02/2026', status: 'On Leave', checkIn: '-', checkOut: '-' },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Attendance</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Attendance</h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700"
              title="Filter"
            >
              <HiOutlineFilter className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-900 text-white text-sm font-semibold"
            >
              Today
              <HiOutlineChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e9f2ff]">
              <tr className="text-left text-xs font-semibold text-slate-700">
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Check In</th>
                <th className="px-5 py-3">Check Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                  <td className="px-5 py-4 text-sm text-slate-900">{r.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.date}</td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'On Leave'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.checkIn}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
