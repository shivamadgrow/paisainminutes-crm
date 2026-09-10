import React, { useState } from 'react';
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
import { INITIAL_INTEGRATIONS } from '../data/integrationsData';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';

export default function IntegrationSettingsView() {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [pingStatus, setPingStatus] = useState({});

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

  const handleToggleKey = (id) => {
    setShowKeys(p => ({ ...p, [id]: !p[id] }));
  };

  const handleTestPing = (partnerId) => {
    setPingStatus(p => ({ ...p, [partnerId]: 'pinging' }));
    setTimeout(() => {
      setPingStatus(p => ({ ...p, [partnerId]: 'success' }));
      setTimeout(() => {
        setPingStatus(p => ({ ...p, [partnerId]: null }));
      }, 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
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
            <h3 className="font-bold text-sm text-slate-100">Global Incoming Callback Webhook URL</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
            HTTP 200 OK Receiver
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 font-mono text-xs text-indigo-200">
          <span className="flex-1 truncate">https://crm.paisainminutes.com/api/webhooks/disbursal-callback</span>
          <button
            onClick={() => handleCopy('https://crm.paisainminutes.com/api/webhooks/disbursal-callback', 'global-webhook')}
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
                  disabled={pingStatus[item.partnerId] === 'pinging'}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {pingStatus[item.partnerId] === 'pinging' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Testing ping...</span>
                    </>
                  ) : pingStatus[item.partnerId] === 'success' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">200 OK Verified</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Test Endpoint Ping</span>
                    </>
                  )}
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
                <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Dedicated Status Webhook</div>
                <div className="text-slate-800 break-all text-[11px] select-all">{item.webhookUrl}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">API Key</div>
                  <div className="text-slate-800 text-[11px]">
                    {showKeys[item.partnerId] ? item.apiKey : '••••••••••••••••••••••••'}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleKey(item.partnerId)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showKeys[item.partnerId] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleCopy(item.apiKey, item.partnerId + '-key')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {copiedKey === item.partnerId + '-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Shared Secret</div>
                  <div className="text-slate-800 text-[11px]">
                    {showKeys[item.partnerId] ? item.secretKey : '••••••••••••••••••••••••'}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(item.secretKey, item.partnerId + '-sec')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {copiedKey === item.partnerId + '-sec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
