import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineFilter, HiOutlineDownload } from 'react-icons/hi';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  const rows = useMemo(
    () => [
      {
        id: '1',
        name: 'yeabsire abebe',
        dept: 'Design',
        jobTitle: 'UI/UX Designer',
        startDate: '28/04/2022',
        category: 'Full time',
        gender: 'Female',
      },
      {
        id: '2',
        name: 'feven tesfaye',
        dept: 'IT',
        jobTitle: 'Backend Engineer',
        startDate: '28/04/2022',
        category: 'Remote',
        gender: 'Female',
      },
      {
        id: '3',
        name: 'AMANUEL BEYENE',
        dept: 'Design',
        jobTitle: 'UI/UX Designer',
        startDate: '28/04/2022',
        category: 'Full time',
        gender: 'Male',
      },
      {
        id: '4',
        name: 'tedla atalay',
        dept: 'Design',
        jobTitle: 'UI/UX Designer',
        startDate: '28/04/2022',
        category: 'Full time',
        gender: 'Male',
      },
      {
        id: '5',
        name: 'redwan husein',
        dept: 'Design',
        jobTitle: 'UI/UX Designer',
        startDate: '28/04/2022',
        category: 'Full time',
        gender: 'Male',
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Employee Management</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Employee Management</h1>

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-semibold"
            >
              Export
              <HiOutlineChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e9f2ff]">
              <tr className="text-left text-xs font-semibold text-slate-700">
                <th className="px-5 py-3">Name(s)</th>
                <th className="px-5 py-3">Dept</th>
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Start Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                  <td className="px-5 py-4 text-sm text-slate-900">{r.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.dept}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.jobTitle}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.startDate}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.category}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{r.gender}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-900 text-white text-sm font-semibold"
                      >
                        Actions
                        <HiOutlineChevronDown className="w-4 h-4" />
                      </button>

                      {openMenuId === r.id && (
                        <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-indigo-900 text-white overflow-hidden z-10">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/hr/employees/${r.id}`);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-800"
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/hr/employees/${r.id}`);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-800"
                          >
                            Edit Profile
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 text-xs text-slate-500 flex items-center justify-between">
          <div>Showing {rows.length} employees</div>
          <button type="button" className="inline-flex items-center gap-2 text-slate-700">
            <HiOutlineDownload className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
