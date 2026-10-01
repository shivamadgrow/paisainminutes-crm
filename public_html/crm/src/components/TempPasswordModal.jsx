import React, { useState } from 'react';
import { KeyRound, Copy, Check, AlertTriangle } from 'lucide-react';

/**
 * Shows a server-generated temporary password exactly once. The server never stores or returns it again,
 * so the dialog stays until the admin confirms they have passed it on.
 */
export default function TempPasswordModal({ info, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!info) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(info.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard unavailable: the password is still visible on screen
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">{info.title || 'Temporary password'}</h3>
            {info.subtitle && <p className="text-[11px] text-slate-500">{info.subtitle}</p>}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
          <code className="font-mono text-sm font-bold text-slate-900 break-all select-all">{info.password}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-white flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            This password is shown <strong>only once</strong> and cannot be recovered. Share it securely; the user must
            choose a new password at first sign-in.
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0A3977] hover:bg-blue-900 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            I have saved it
          </button>
        </div>
      </div>
    </div>
  );
}
