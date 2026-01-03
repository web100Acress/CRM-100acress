import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { whatsappApi } from '@/api/whatsapp.api.js';
import { MessageCircle, Send, RefreshCcw, Search } from 'lucide-react';

const badgeClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'sent') return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (s === 'delivered') return 'bg-green-50 text-green-700 border border-green-200';
  if (s === 'read') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s === 'failed') return 'bg-red-50 text-red-700 border border-red-200';
  return 'bg-gray-50 text-gray-700 border border-gray-200';
};

const WhatsAppLogs = ({ userRole = 'super-admin' }) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [sending, setSending] = useState(false);

  const [sendForm, setSendForm] = useState({ phoneNumber: '', body: '' });

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((r) => {
      const p = (r.phoneNumber || '').toLowerCase();
      const b = (r.body || '').toLowerCase();
      return p.includes(q) || b.includes(q);
    });
  }, [rows, query]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await whatsappApi.listMessages();
      const data = res?.data || res;
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.message || 'Failed to load WhatsApp logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const sendMessage = async () => {
    try {
      setSending(true);
      if (!sendForm.phoneNumber) {
        alert('phoneNumber is required');
        return;
      }
      await whatsappApi.send({ phoneNumber: sendForm.phoneNumber, body: sendForm.body });
      setSendForm({ phoneNumber: '', body: '' });
      await loadAll();
    } catch (e) {
      alert(e?.message || 'Failed to send WhatsApp message');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageCircle size={20} /> WhatsApp Logs</h1>
            <p className="text-gray-600">Message history and quick send (stub provider).</p>
          </div>
          <button
            onClick={loadAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="font-bold text-gray-900 mb-3">Send Message</div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  value={sendForm.phoneNumber}
                  onChange={(e) => setSendForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  className="w-full min-h-[120px] border border-gray-200 rounded-xl p-3"
                  value={sendForm.body}
                  onChange={(e) => setSendForm((p) => ({ ...p, body: e.target.value }))}
                  placeholder="Write message..."
                />
              </div>
              <button
                onClick={sendMessage}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
                disabled={sending}
              >
                <Send size={16} /> Send
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 xl:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div className="font-bold text-gray-900">Messages</div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                <Search size={16} className="text-gray-500" />
                <input
                  className="outline-none text-sm w-72 max-w-full"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search phone or message"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Body</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="px-4 py-4" colSpan={4}>Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td className="px-4 py-4 text-gray-600" colSpan={4}>No messages.</td></tr>
                  ) : (
                    filtered.slice(0, 50).map((m) => (
                      <tr key={m._id} className="border-t">
                        <td className="px-4 py-3 font-medium">{m.phoneNumber}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <div className="max-w-[520px] truncate">{m.body}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass(m.status)}`}>{m.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WhatsAppLogs;
