import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';

const leaveTabs = [
  { key: 'settings', label: 'Leave Settings' },
  { key: 'recall', label: 'Leave Recall' },
  { key: 'history', label: 'Leave History' },
  { key: 'relief', label: 'Relief Officers' },
];

const LeaveManagement = ({ initialTab = 'settings' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  const recallRows = useMemo(
    () => [
      { id: '1', name: 'abeb ggechu', duration: 5, start: '22/04/2022', end: '28/04/2022', type: 'Casual', reason: 'Personal' },
      { id: '2', name: 'aman bey', duration: 7, start: '22/04/2022', end: '30/04/2022', type: 'Casual', reason: 'Personal' },
      { id: '3', name: 'feven tesfaye', duration: 7, start: '22/04/2022', end: '28/06/2022', type: 'Casual', reason: 'Personal' },
      { id: '4', name: 'yanet tesfaye', duration: 5, start: '22/04/2022', end: '28/04/2022', type: 'Casual', reason: 'Personal' },
      { id: '5', name: 'beti wolee', duration: 5, start: '22/04/2022', end: '28/04/2022', type: 'Casual', reason: 'Personal' },
      { id: '6', name: 'dawit int', duration: 5, start: '22/04/2022', end: '28/04/2022', type: 'Casual', reason: 'Personal' },
      { id: '7', name: 'gella oges', duration: 5, start: '22/04/2022', end: '28/04/2022', type: 'Casual', reason: 'Personal' },
    ],
    []
  );

  const renderTabBar = () => (
    <div className="flex flex-wrap gap-4">
      {leaveTabs.map((t) => {
        const active = t.key === activeTab;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-8 py-3 rounded-lg text-sm font-semibold shadow-sm ${
              active ? 'bg-yellow-400 text-slate-900' : 'bg-indigo-900 text-white'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );

  const renderBanner = () => (
    <div className="bg-indigo-900 rounded-2xl overflow-hidden border border-white/20">
      <div className="p-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            Manage ALL <span className="text-yellow-400">Leave Applications</span>
          </h2>
          <p className="text-sm text-white/80 mt-2">A relaxed employee is a performing employee.</p>
        </div>
        <div className="hidden md:block text-white/70">...</div>
      </div>
    </div>
  );

  const renderRecallTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Ongoing Leave Applications</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#e9f2ff]">
            <tr className="text-left text-xs font-semibold text-slate-700">
              <th className="px-5 py-3">Name(s)</th>
              <th className="px-5 py-3">Duration(s)</th>
              <th className="px-5 py-3">Start Date</th>
              <th className="px-5 py-3">End Date</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Reason(s)</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recallRows.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 1 ? 'bg-[#f2f7ff]' : 'bg-white'}>
                <td className="px-5 py-4 text-sm text-slate-900">{r.name}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{r.duration}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{r.start}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{r.end}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{r.type}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{r.reason}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => navigate('/hr/leave/recall/decision')}
                    className="px-8 py-2 rounded bg-red-600 text-white text-sm font-semibold"
                  >
                    Recall
                  </button>
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
    if (activeTab === 'recall') return renderRecallTable();
    if (activeTab === 'history') return renderPlaceholder('Leave History');
    if (activeTab === 'relief') return renderPlaceholder('Relief Officers');
    return renderPlaceholder('Leave Settings');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-900 font-semibold">
        <HiOutlineBookOpen className="w-5 h-5" />
        <span>Leave Management</span>
      </div>
      {renderTabBar()}
      {renderBanner()}
      {renderBody()}
    </div>
  );
};

export default LeaveManagement;
