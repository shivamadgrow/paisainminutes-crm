import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Search, 
  Copy, 
  Check, 
  Send, 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw,
  Clock,
  Eye,
  EyeOff,
  Code
} from 'lucide-react';
import { BACKEND_BASE } from '../utils/apiClient';
import { apiGet, apiPatch } from '../utils/crmApi';

const STATUS_LABELS = { CONNECTED: 'Connected', ERROR: 'Error', PAUSED: 'Paused' };
const postbackUrlFor = (slug) => `${BACKEND_BASE}/api/public/postback/${slug}`;
const maskedKey = (meta) => (meta && meta.isSet ? `••••••••••••••••${meta.last4 || ''}` : 'Not set');

export default function IntegrationSettingsView() {
  const [integrations, setIntegrations] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [editing, setEditing] = useState({}); // partnerId -> { apiKey, secretKey }
  const [savingId, setSavingId] = useState(null);
  const [pingNotice, setPingNotice] = useState({});

  // Partner integration settings live on the server. API keys and shared secrets are write-only there:
  // only a masked tail is ever returned, so they cannot be revealed or copied from this screen.
  const loadIntegrations = async () => {
    setIsLoading(true);
    const res = await apiGet('/api/crm/settings/integrations');
    if (res.ok && res.data && Array.isArray(res.data.integrations)) {
      setIntegrations(res.data.integrations.map(i => ({
        ...i,
        status: STATUS_LABELS[i.status] || i.status,
        apiEndpoint: i.apiEndpoint || '—',
        authType: i.authType || '—',
        lastSync: i.lastSyncAt ? new Date(i.lastSyncAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Never'
      })));
      setLoadError('');
    } else {
      setLoadError(res.error || 'Could not load integration settings.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const filtered = integrations.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.partnerName.toLowerCase().includes(q) || item.apiEndpoint.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveCredentials = async (item) => {
    const draft = editing[item.partnerId] || {};
    const body = {};
    if (draft.apiKey) body.apiKey = draft.apiKey;
    if (draft.secretKey) body.secretKey = draft.secretKey;
    if (!Object.keys(body).length) return;
    setSavingId(item.partnerId);
    setActionError('');
    const res = await apiPatch(`/api/crm/settings/integrations/${encodeURIComponent(item.partnerId)}`, body);
    setSavingId(null);
    if (res.ok) {
      setEditing(p => ({ ...p, [item.partnerId]: undefined }));
      await loadIntegrations();
    } else {
      setActionError(res.error || 'The credentials could not be saved.');
    }
  };

  // There is no live endpoint-ping route; deliveries are tested from a lead and recorded in the delivery logs.
  const handleTestPing = (partnerId) => {
    setPingNotice(p => ({ ...p, [partnerId]: true }));
    setTimeout(() => setPingNotice(p => ({ ...p, [partnerId]: false })), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {(loadError || actionError) && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between gap-3">
          <span>{loadError || actionError}</span>
          <button onClick={loadError ? loadIntegrations : () => setActionError('')} className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 font-bold cursor-pointer">{loadError ? 'Retry' : 'Dismiss'}</button>
        </div>
      )}
      {isLoading && <div className="text-xs text-slate-500">Loading integration settings from the server…</div>}
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-indigo-600" />
            <span>Integration Settings</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              API & Webhooks
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Partner API credentials, outbound lead push endpoints & incoming status callback webhooks
          </p>
        </div>
      </div>

      {/* Webhook Specification Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">Incoming Callback (Postback) URL</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
            HTTP 200 OK Receiver
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 font-mono text-xs text-indigo-200">
          <span className="flex-1 truncate">{BACKEND_BASE}/api/public/postback/&#123;partner_slug&#125;?sub_id=&#123;lead_id&#125;&amp;status=&#123;status&#125;&amp;amount=&#123;amount&#125;&amp;secret=&#123;partner_secret&#125;</span>
          <button
            onClick={() => handleCopy(`${BACKEND_BASE}/api/public/postback/{partner_slug}?sub_id={lead_id}&status={status}&amount={amount}&secret={partner_secret}`, 'global-webhook')}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] flex items-center gap-1 transition cursor-pointer"
          >
            {copiedKey === 'global-webhook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>Copy</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          Affiliate partners send automated POST callbacks when a lead status updates to <strong>Approved</strong> or <strong>Disbursed</strong>. Payload requires <code>lead_id</code>, <code>status</code>, and <code>loan_amount</code>.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search partner endpoints..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs border-none focus:outline-none"
        />
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div key={item.partnerId} className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                  {item.partnerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{item.partnerName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{item.status}</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Auth: {item.authType} • Sync: {item.lastSync}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestPing(item.partnerId)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{pingNotice[item.partnerId] ? 'Not available yet — see API Delivery Logs' : 'Test Endpoint Ping'}</span>
                </button>
              </div>
            </div>

            {/* Endpoints & Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Outbound Ingest API</div>
                <div className="text-slate-800 break-all text-[11px] select-all">{item.apiEndpoint}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Dedicated Status Webhook (incoming postback)</div>
                <div className="text-slate-800 break-all text-[11px] select-all">{postbackUrlFor(item.slug)}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">API Key (write-only)</div>
                <div className="text-slate-800 text-[11px]">{maskedKey(item.apiKey)}</div>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new API key to replace"
                  value={(editing[item.partnerId] || {}).apiKey || ''}
                  onChange={(e) => setEditing(p => ({ ...p, [item.partnerId]: { ...(p[item.partnerId] || {}), apiKey: e.target.value } }))}
                  className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded-md bg-white font-mono"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Shared Secret (write-only)</div>
                <div className="text-slate-800 text-[11px]">{maskedKey(item.secretKey)}</div>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new shared secret to replace"
                  value={(editing[item.partnerId] || {}).secretKey || ''}
                  onChange={(e) => setEditing(p => ({ ...p, [item.partnerId]: { ...(p[item.partnerId] || {}), secretKey: e.target.value } }))}
                  className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded-md bg-white font-mono"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveCredentials(item)}
                  disabled={savingId === item.partnerId || !((editing[item.partnerId] || {}).apiKey || (editing[item.partnerId] || {}).secretKey)}
                  className="px-3 py-1.5 bg-[#0A3977] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {savingId === item.partnerId ? 'Saving…' : 'Update credentials'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
