import React, { useMemo } from 'react';
import { HiOutlineDownload } from 'react-icons/hi';

const Resumes = () => {
  const rows = useMemo(
    () => [
      { id: '1', candidate: 'Feven Tesfaye', file: 'Feven_Tesfaye_CV.pdf', uploaded: 'Today' },
      { id: '2', candidate: 'Yanet Mekuriya', file: 'Yanet_Mekuriya_CV.pdf', uploaded: 'Yesterday' },
      { id: '3', candidate: 'Aman Beyene', file: 'Aman_Beyene_CV.pdf', uploaded: '2 days ago' },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Resumes</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Resumes</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e9f2ff]">
              <tr className="text-left text-xs font-semibold text-slate-700">
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">File</th>
                <th className="px-5 py-3">Uploaded</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                  <td className="px-5 py-4 text-sm text-slate-900">{r.candidate}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.file}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.uploaded}</td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-900 text-white text-sm font-semibold">
                      <HiOutlineDownload className="w-4 h-4" />
                      Download
                    </button>
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

export default Resumes;
