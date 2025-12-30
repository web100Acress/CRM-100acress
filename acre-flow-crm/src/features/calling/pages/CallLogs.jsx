import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { callsApi } from '@/api/calls.api.js';
import { Search, Filter, FileText, PhoneCall } from 'lucide-react';

const formatSeconds = (sec) => {
  const s = Math.max(0, Number(sec) || 0);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const badgeClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'answered') return 'bg-green-50 text-green-700 border border-green-200';
  if (s === 'missed') return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (s === 'failed') return 'bg-red-50 text-red-700 border border-red-200';
  if (s === 'ringing') return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (s === 'queued') return 'bg-slate-50 text-slate-700 border border-slate-200';
  if (s === 'ended') return 'bg-gray-50 text-gray-700 border border-gray-200';
  return 'bg-gray-50 text-gray-700 border border-gray-200';
};

const CallLogs = ({ userRole = 'employee' }) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [noteText, setNoteText] = useState('');

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    return rows.filter((r) => {
      if (status && (r.status || '') !== status) return false;
      if (!q) return true;
      const phone = (r.phoneNumber || '').toLowerCase();
      const dir = (r.direction || '').toLowerCase();
      const prov = (r.provider || '').toLowerCase();
      return phone.includes(q) || dir.includes(q) || prov.includes(q);
    });
  }, [rows, query, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await callsApi.logs();
      const data = res?.data || res;
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.message || 'Failed to fetch call logs');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNotes = (row) => {
    setSelected(row);
    setNoteText(row?.notes?.text || '');
  };

  const saveNotes = async () => {
    if (!selected?._id) return;
    try {
      await callsApi.updateNotes(selected._id, { text: noteText });
      setSelected(null);
      setNoteText('');
      await fetchData();
    } catch (e) {
      alert(e?.message || 'Failed to save notes');
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="w-full space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><PhoneCall size={20} /> Call Logs</h1>
            <p className="text-gray-600">Track calls, outcomes, and notes.</p>
          </div>

          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-gray-500" />
            <input
              className="w-full outline-none text-sm"
              placeholder="Search phone / direction / provider"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="queued">queued</option>
              <option value="ringing">ringing</option>
              <option value="answered">answered</option>
              <option value="missed">missed</option>
              <option value="failed">failed</option>
              <option value="ended">ended</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Direction</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Duration</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Provider</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Created</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6" colSpan={7}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="px-4 py-6 text-gray-600" colSpan={7}>No call logs found.</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r._id} className="border-t">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.phoneNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{r.direction}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass(r.status)}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{formatSeconds(r.durationSec)}</td>
                      <td className="px-4 py-3 text-gray-700">{r.provider}</td>
                      <td className="px-4 py-3 text-gray-700">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openNotes(r)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          <FileText size={14} /> Notes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">Call Notes</div>
                  <div className="text-sm text-gray-600">{selected.phoneNumber}</div>
                </div>
                <button
                  className="px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => { setSelected(null); setNoteText(''); }}
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <textarea
                  className="w-full min-h-[140px] border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write notes..."
                />
              </div>
              <div className="p-4 border-t flex items-center justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  onClick={() => { setSelected(null); setNoteText(''); }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800"
                  onClick={saveNotes}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CallLogs;
