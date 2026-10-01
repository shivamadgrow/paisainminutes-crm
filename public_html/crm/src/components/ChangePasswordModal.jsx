import React, { useState } from 'react';
import { KeyRound, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { changeOwnPassword } from '../utils/authService';

/**
 * Lets the signed-in account replace its password. The server revokes every session afterwards, so on
 * success `onChanged` is called and the app returns to the login screen.
 * `forced` = the account still has a temporary password (cannot be dismissed).
 */
export default function ChangePasswordModal({ forced = false, onClose, onChanged }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 10) {
      setError('The new password must be at least 10 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    const result = await changeOwnPassword(currentPassword, newPassword);
    setBusy(false);
    if (!result.success) {
      setError(result.error || 'Could not change the password.');
      return;
    }
    if (onChanged) onChanged();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-slate-800 relative">
        {!forced && onClose && (
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0A3977] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">{forced ? 'Choose a new password' : 'Change password'}</h3>
            <p className="text-[11px] text-slate-500">
              {forced ? 'Your account uses a temporary password. Set your own to continue.' : 'You will be asked to sign in again afterwards.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <input type="password" required autoComplete="current-password" placeholder={forced ? 'Temporary password' : 'Current password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977]" />
          <input type="password" required autoComplete="new-password" placeholder="New password (min 10 characters)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977]" />
          <input type="password" required autoComplete="new-password" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977]" />
        </div>

        <button type="submit" disabled={busy} className="mt-4 w-full py-2.5 bg-[#0A3977] hover:bg-blue-900 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
          {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
          <span>{busy ? 'Saving...' : 'Save new password'}</span>
        </button>
      </form>
    </div>
  );
}
