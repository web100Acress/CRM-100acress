import React, { useMemo, useState } from 'react';
import { HiOutlineChevronDown, HiOutlineFilter } from 'react-icons/hi';

const tabs = [
  { key: 'target_setup', label: 'Target Setup' },
  { key: 'targets', label: 'Targets' },
  { key: 'appraisals', label: 'Appraisals' },
  { key: 'settings', label: 'Settings' },
  { key: 'reports', label: 'Reports' },
];

const Performance = ({ initialTab = 'targets' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [openMenuId, setOpenMenuId] = useState(null);

  const targets = useMemo(
    () => [
      {
        id: '1',
        name: 'Abebe Kebede',
        title: 'Sign new customers',
        weight: 5,
        date: '01-Jan-2021 / 01-Jan-2022',
      },
      {
        id: '2',
        name: 'Abebe Kebede',
        title: 'Develop marketing Campaign',
        weight: 4,
        date: '01-Jan-2021 / 01-Jan-2022',
      },
      {
        id: '3',
        name: 'Abebe Kebede',
        title: 'Sign 3 new customers',
        weight: 5,
        date: '01-Jan-2021 / 01-Jan-2022',
      },
      {
        id: '4',
        name: 'Abebe Kebede',
        title: 'Sign new customers',
        weight: 5,
        date: '01-Jan-2021 / 01-Jan-2022',
      },
    ],
    []
  );

  const renderTabBar = () => (
    <div className="flex flex-wrap gap-4">
      {tabs.map((t) => {
        const active = t.key === activeTab;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setOpenMenuId(null);
              setActiveTab(t.key);
            }}
            className={`px-8 py-2.5 rounded-full text-sm font-semibold shadow-sm border ${
              active
                ? 'bg-yellow-400 text-slate-900 border-yellow-400'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );

  const renderTargetSetup = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Title</label>
          <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">KPI Weight</label>
          <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
          <textarea className="w-full min-h-24 rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Employees</label>
          <select className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm">
            <option value="">Select employee</option>
            <option>Abebe Kebede</option>
            <option>Aman Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Start Date</label>
          <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">End Date</label>
          <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button type="button" className="w-full rounded-lg bg-green-700 text-white py-3 font-semibold">
          Submit
        </button>
        <button type="button" className="w-full rounded-lg border-2 border-yellow-500 text-slate-900 py-3 font-semibold bg-white">
          Add More Targets
        </button>
      </div>
    </div>
  );

  const renderTargets = () => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Manage Targets</h2>

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
              <th className="px-5 py-3">Title(s)</th>
              <th className="px-5 py-3">KPI Weight</th>
              <th className="px-5 py-3">Target Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {targets.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                <td className="px-5 py-4 text-sm text-slate-900">{r.name}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{r.title}</td>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">{r.weight}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-900">{r.date}</td>
                <td className="px-5 py-4">
                  <div className="relative inline-block">
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
                        <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-800">
                          View
                        </button>
                        <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-800">
                          Edit
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
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-600 mt-2">Section UI is ready for integration.</p>
    </div>
  );

  const renderBody = () => {
    if (activeTab === 'targets') return renderTargets();
    if (activeTab === 'target_setup') return renderTargetSetup();
    if (activeTab === 'appraisals') return renderPlaceholder('Appraisals');
    if (activeTab === 'settings') return renderPlaceholder('Settings');
    if (activeTab === 'reports') return renderPlaceholder('Reports');
    return renderTargets();
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Performance Management</div>
      {renderTabBar()}
      {renderBody()}
    </div>
  );
};

export default Performance;
