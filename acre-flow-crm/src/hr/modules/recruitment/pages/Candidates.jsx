import React, { useMemo } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

const Candidates = () => {
  const rows = useMemo(
    () => [
      { id: '1', name: 'Feven Tesfaye', job: 'UI/UX Designer', stage: 'Interview' },
      { id: '2', name: 'Yanet Mekuriya', job: 'Backend Engineer', stage: 'Screening' },
      { id: '3', name: 'Aman Beyene', job: 'Product Manager', stage: 'Hired' },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Candidates</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Candidates</h1>
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
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Job</th>
                <th className="px-5 py-3">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                  <td className="px-5 py-4 text-sm text-slate-900">{r.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.job}</td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.stage === 'Hired'
                          ? 'bg-green-100 text-green-700'
                          : r.stage === 'Interview'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {r.stage}
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

export default Candidates;
