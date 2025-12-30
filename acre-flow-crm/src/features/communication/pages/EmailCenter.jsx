import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { emailApi } from '@/api/email.api.js';
import { Mail, Plus, Save, Trash2, Send, RefreshCcw } from 'lucide-react';

const EmailCenter = ({ userRole = 'super-admin' }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const [form, setForm] = useState({ name: '', subject: '', html: '', isActive: true });

  const [emails, setEmails] = useState([]);
  const [sendForm, setSendForm] = useState({ to: '', templateId: '', subject: '', variablesJson: '{}' });

  const selected = useMemo(
    () => templates.find((t) => t?._id === selectedId) || null,
    [templates, selectedId]
  );

  const loadAll = async () => {
    try {
      setLoading(true);
      const tplRes = await emailApi.templates.list();
      const tplList = tplRes?.data || tplRes;
      setTemplates(Array.isArray(tplList) ? tplList : []);

      const msgRes = await emailApi.messages.list();
      const msgList = msgRes?.data || msgRes;
      setEmails(Array.isArray(msgList) ? msgList : []);
    } catch (e) {
      alert(e?.message || 'Failed to load email center');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setForm({
      name: selected.name || '',
      subject: selected.subject || '',
      html: selected.html || '',
      isActive: Boolean(selected.isActive),
    });
    setSendForm((p) => ({ ...p, templateId: selected._id, subject: selected.subject || '' }));
  }, [selected]);

  const createNew = () => {
    setSelectedId('');
    setForm({ name: '', subject: '', html: '', isActive: true });
  };

  const saveTemplate = async () => {
    try {
      setSaving(true);
      if (!form.name || !form.subject || !form.html) {
        alert('name, subject, html are required');
        return;
      }

      if (selectedId) {
        await emailApi.templates.update(selectedId, form);
      } else {
        const res = await emailApi.templates.create(form);
        const created = res?.data || res;
        setSelectedId(created?._id || '');
      }

      await loadAll();
    } catch (e) {
      alert(e?.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async () => {
    if (!selectedId) return;
    const ok = window.confirm('Delete this template?');
    if (!ok) return;

    try {
      setSaving(true);
      await emailApi.templates.remove(selectedId);
      setSelectedId('');
      setForm({ name: '', subject: '', html: '', isActive: true });
      await loadAll();
    } catch (e) {
      alert(e?.message || 'Failed to delete template');
    } finally {
      setSaving(false);
    }
  };

  const sendEmail = async () => {
    try {
      setSaving(true);
      if (!sendForm.to) {
        alert('To is required');
        return;
      }
      if (!sendForm.templateId) {
        alert('Select a template');
        return;
      }

      let vars = {};
      try {
        vars = sendForm.variablesJson ? JSON.parse(sendForm.variablesJson) : {};
      } catch {
        alert('variables must be valid JSON');
        return;
      }

      await emailApi.messages.send({
        to: sendForm.to,
        templateId: sendForm.templateId,
        subject: sendForm.subject,
        variables: vars,
      });

      setSendForm((p) => ({ ...p, to: '' }));
      await loadAll();
    } catch (e) {
      alert(e?.message || 'Failed to send email');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Mail size={20} /> Email Center</h1>
            <p className="text-gray-600">Templates, sending, and tracking.</p>
          </div>
          <button
            onClick={loadAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-gray-900">Templates</div>
                <button
                  onClick={createNew}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800"
                >
                  <Plus size={16} /> New
                </button>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                {templates.length === 0 ? (
                  <div className="text-sm text-gray-600">No templates yet.</div>
                ) : (
                  templates.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedId(t._id)}
                      className={`w-full text-left border rounded-xl px-3 py-3 hover:bg-gray-50 ${
                        selectedId === t._id ? 'border-gray-900' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-600 truncate">{t.subject}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 xl:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div className="font-bold text-gray-900">{selectedId ? 'Edit Template' : 'Create Template'}</div>
                <div className="flex items-center gap-2">
                  {selectedId && (
                    <button
                      onClick={deleteTemplate}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                      disabled={saving}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <button
                    onClick={saveTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-60"
                    disabled={saving}
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Welcome Email"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Subject</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="Hello {{name}}"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm text-gray-600">HTML</label>
                <textarea
                  className="w-full min-h-[220px] border border-gray-200 rounded-xl p-3 font-mono text-sm"
                  value={form.html}
                  onChange={(e) => setForm((p) => ({ ...p, html: e.target.value }))}
                  placeholder="<div>Hello {{name}}</div>"
                />
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="font-bold text-gray-900 mb-2">Send Email</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">To</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2"
                      value={sendForm.to}
                      onChange={(e) => setSendForm((p) => ({ ...p, to: e.target.value }))}
                      placeholder="client@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Template</label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-3 py-2"
                      value={sendForm.templateId}
                      onChange={(e) => setSendForm((p) => ({ ...p, templateId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {templates.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Subject override (optional)</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2"
                      value={sendForm.subject}
                      onChange={(e) => setSendForm((p) => ({ ...p, subject: e.target.value }))}
                      placeholder="(leave empty to use template subject)"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Variables (JSON)</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 font-mono text-sm"
                      value={sendForm.variablesJson}
                      onChange={(e) => setSendForm((p) => ({ ...p, variablesJson: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={sendEmail}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                    disabled={saving}
                  >
                    <Send size={16} /> Send
                  </button>
                </div>

                <div className="mt-6">
                  <div className="font-bold text-gray-900 mb-2">Recent Emails</div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3">To</th>
                          <th className="text-left px-4 py-3">Subject</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-left px-4 py-3">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.length === 0 ? (
                          <tr><td className="px-4 py-4 text-gray-600" colSpan={4}>No emails yet.</td></tr>
                        ) : (
                          emails.slice(0, 20).map((m) => (
                            <tr key={m._id} className="border-t">
                              <td className="px-4 py-3 font-medium">{m.to}</td>
                              <td className="px-4 py-3">{m.subject}</td>
                              <td className="px-4 py-3">{m.status}</td>
                              <td className="px-4 py-3">{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmailCenter;
