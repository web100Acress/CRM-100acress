import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { commAdminApi } from '@/api/commAdmin.api.js';
import { PhoneCall, Save, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

const CallingSettings = ({ userRole = 'super-admin' }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [flags, setFlags] = useState({
    CALLING_ENABLED: false,
    RECORDING_ENABLED: false,
    MISSED_CALL_LEADS: false,
    WHATSAPP_AUTOMATION: false,
    EMAIL_TRACKING: false,
  });

  const [providers, setProviders] = useState([]);
  const [providerForm, setProviderForm] = useState({
    providerName: 'stub',
    isActive: true,
    defaultFromNumber: '',
    credentials: {
      accountSid: '',
      authToken: '',
      forwardTo: '',
    },
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const flagsRes = await commAdminApi.fetchFeatureFlags();
      const providersRes = await commAdminApi.fetchProviders();

      setFlags(flagsRes?.data || flagsRes);
      const list = providersRes?.data || providersRes;
      const normalized = Array.isArray(list) ? list : [];
      setProviders(normalized);

      const active = normalized.find((p) => p?.isActive);
      if (active) {
        setProviderForm({
          providerName: active.providerName || 'stub',
          isActive: Boolean(active.isActive),
          defaultFromNumber: active.defaultFromNumber || '',
          credentials: {
            accountSid: active?.credentials?.accountSid || '',
            authToken: active?.credentials?.authToken || '',
            forwardTo: active?.credentials?.forwardTo || '',
          },
        });
      }
    } catch (e) {
      alert(e?.message || 'Failed to load calling settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleFlag = (key) => {
    setFlags((p) => ({ ...p, [key]: !Boolean(p?.[key]) }));
  };

  const saveFlags = async () => {
    try {
      setSaving(true);
      await commAdminApi.updateFeatureFlags({
        CALLING_ENABLED: Boolean(flags.CALLING_ENABLED),
        RECORDING_ENABLED: Boolean(flags.RECORDING_ENABLED),
        MISSED_CALL_LEADS: Boolean(flags.MISSED_CALL_LEADS),
        WHATSAPP_AUTOMATION: Boolean(flags.WHATSAPP_AUTOMATION),
        EMAIL_TRACKING: Boolean(flags.EMAIL_TRACKING),
      });
      await loadAll();
    } catch (e) {
      alert(e?.message || 'Failed to save feature flags');
    } finally {
      setSaving(false);
    }
  };

  const saveProvider = async () => {
    try {
      setSaving(true);
      const providerCredentials =
        providerForm.providerName === 'twilio'
          ? {
              accountSid: providerForm?.credentials?.accountSid || '',
              authToken: providerForm?.credentials?.authToken || '',
              forwardTo: providerForm?.credentials?.forwardTo || '',
            }
          : {};

      await commAdminApi.upsertProvider({
        providerName: providerForm.providerName,
        isActive: Boolean(providerForm.isActive),
        defaultFromNumber: providerForm.defaultFromNumber || '',
        credentials: providerCredentials,
      });
      await loadAll();
    } catch (e) {
      alert(e?.message || 'Failed to save provider');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} /> Calling Settings
          </h1>
          <p className="text-gray-600">Control calling rollout and provider selection.</p>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6">Loading...</div>
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <PhoneCall size={18} /> Feature Flags
                </div>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-60"
                  onClick={saveFlags}
                  disabled={saving}
                >
                  <Save size={16} /> Save
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['CALLING_ENABLED', 'Calling Enabled'],
                  ['RECORDING_ENABLED', 'Recording Enabled'],
                  ['MISSED_CALL_LEADS', 'Missed Call Leads'],
                  ['WHATSAPP_AUTOMATION', 'WhatsApp Automation'],
                  ['EMAIL_TRACKING', 'Email Tracking'],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => toggleFlag(k)}
                    className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">{label}</span>
                    {Boolean(flags?.[k]) ? (
                      <ToggleRight className="text-green-600" />
                    ) : (
                      <ToggleLeft className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-gray-900">Provider</div>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-60"
                  onClick={saveProvider}
                  disabled={saving}
                >
                  <Save size={16} /> Save
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Provider</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2"
                    value={providerForm.providerName}
                    onChange={(e) => setProviderForm((p) => ({ ...p, providerName: e.target.value }))}
                  >
                    <option value="stub">stub</option>
                    <option value="twilio">twilio</option>
                    <option value="exotel">exotel</option>
                    <option value="knowlarity">knowlarity</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Default From Number</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2"
                    value={providerForm.defaultFromNumber}
                    onChange={(e) => setProviderForm((p) => ({ ...p, defaultFromNumber: e.target.value }))}
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setProviderForm((p) => ({ ...p, isActive: !Boolean(p.isActive) }))}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Active</span>
                    {Boolean(providerForm.isActive) ? (
                      <ToggleRight className="text-green-600" />
                    ) : (
                      <ToggleLeft className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {providerForm.providerName === 'twilio' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Twilio Account SID</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2"
                      value={providerForm?.credentials?.accountSid || ''}
                      onChange={(e) =>
                        setProviderForm((p) => ({
                          ...p,
                          credentials: { ...p.credentials, accountSid: e.target.value },
                        }))
                      }
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Twilio Auth Token</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2"
                      value={providerForm?.credentials?.authToken || ''}
                      onChange={(e) =>
                        setProviderForm((p) => ({
                          ...p,
                          credentials: { ...p.credentials, authToken: e.target.value },
                        }))
                      }
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Forward To (optional)</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-3 py-2"
                      value={providerForm?.credentials?.forwardTo || ''}
                      onChange={(e) =>
                        setProviderForm((p) => ({
                          ...p,
                          credentials: { ...p.credentials, forwardTo: e.target.value },
                        }))
                      }
                      placeholder="+91XXXXXXXXXX"
                    />
                  </div>
                </div>
              )}

              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-700 mb-2">Saved Providers</div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3">Provider</th>
                        <th className="text-left px-4 py-3">Active</th>
                        <th className="text-left px-4 py-3">From</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-gray-600" colSpan={3}>
                            No provider configured yet.
                          </td>
                        </tr>
                      ) : (
                        providers.map((p) => (
                          <tr key={p._id} className="border-t">
                            <td className="px-4 py-3 font-medium">{p.providerName}</td>
                            <td className="px-4 py-3">{p.isActive ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-3">{p.defaultFromNumber || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CallingSettings;
