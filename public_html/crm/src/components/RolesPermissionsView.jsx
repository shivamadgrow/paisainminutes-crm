import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Check, 
  X, 
  Plus, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { MODULE_PERMISSIONS_CONFIG } from '../data/rolesPermissionsData';
import { getCurrentUser } from '../utils/authService';
import { hasPermission } from '../utils/permissions';
import { apiGet, apiPatch } from '../utils/crmApi';

export default function RolesPermissionsView() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [changedRoleIds, setChangedRoleIds] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const canEditRoles = hasPermission(getCurrentUser(), 'roles.manage');

  // Roles and their permission matrices are stored on the server
  const loadRoles = async () => {
    setIsLoading(true);
    const res = await apiGet('/api/crm/roles', { limit: 500 });
    if (res.ok && res.data && Array.isArray(res.data.roles)) {
      setRoles(res.data.roles);
      setSelectedRoleId(prev => prev || (res.data.roles[0] && res.data.roles[0].id) || null);
      setChangedRoleIds([]);
      setLoadError('');
    } else {
      setLoadError(res.error || 'Could not load roles.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0] || null;
  const hasUnsavedChanges = changedRoleIds.length > 0;

  const handleTogglePermission = (moduleKey, action) => {
    if (!selectedRole) return;
    if (selectedRole.isLocked) {
      alert('Super Admin permissions are locked to full system access and cannot be revoked.');
      return;
    }
    if (!canEditRoles) return;

    const currentVal = !!(selectedRole.permissions || {})[moduleKey]?.[action];
    const updatedRole = {
      ...selectedRole,
      permissions: {
        ...(selectedRole.permissions || {}),
        [moduleKey]: {
          ...((selectedRole.permissions || {})[moduleKey] || {}),
          [action]: !currentVal
        }
      }
    };

    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    setChangedRoleIds(prev => (prev.includes(updatedRole.id) ? prev : [...prev, updatedRole.id]));
  };

  // Each changed role is saved on the server, which re-derives the permissions of every staff member holding it
  const handleSaveMatrix = async () => {
    setIsSaving(true);
    setSaveError('');
    for (const id of changedRoleIds) {
      const role = roles.find(r => r.id === id);
      if (!role) continue;
      const res = await apiPatch(`/api/crm/roles/${encodeURIComponent(id)}`, { permissions: role.permissions });
      if (!res.ok) {
        setSaveError(`${role.name}: ${res.error}`);
        setIsSaving(false);
        return;
      }
    }
    setIsSaving(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
    await loadRoles();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {(loadError || saveError) && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between gap-3">
          <span>{loadError || saveError}</span>
          <button onClick={loadError ? loadRoles : () => setSaveError('')} className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 font-bold cursor-pointer">{loadError ? 'Retry' : 'Dismiss'}</button>
        </div>
      )}
      {isLoading && <div className="text-xs text-slate-500">Loading roles from the server…</div>}
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>Roles & Permissions Matrix</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Access Control
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Granular module permission matrix and role definitions across all affiliate lending desks
          </p>
        </div>

        {hasUnsavedChanges && (
          <button
            onClick={handleSaveMatrix}
            className="px-4 py-2 bg-[#0A3977] hover:bg-[#072956] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Saving…' : 'Save Matrix Changes'}</span>
          </button>
        )}
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Permissions matrix updated successfully across all staff accounts!</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {roles.map(role => {
          const isSelected = selectedRole && selectedRole.id === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-4 rounded-xl border transition cursor-pointer select-none ${
                isSelected 
                  ? 'bg-white border-[#0A3977] shadow-md ring-2 ring-[#0A3977]/10' 
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${role.badgeColor}`}>
                  {role.name}
                </span>
                {role.isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" title="Locked Master Role" />
                ) : (
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {role.description || ''}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{role.userCount} Assigned User(s)</span>
                {isSelected && <span className="text-[#0A3977] font-bold">Configuring →</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      {selectedRole && (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Module Access for:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${selectedRole.badgeColor}`}>
                {selectedRole.name}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedRole.isLocked 
                ? 'Super Admin retains permanent access to all administrative, lead, commission, and dashboard modules.' 
                : 'Toggle permissions to grant or restrict specific actions for this role.'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {MODULE_PERMISSIONS_CONFIG.map(mod => (
            <div key={mod.moduleKey} className="p-4 sm:p-6 hover:bg-slate-50/50 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="sm:w-1/3">
                  <h4 className="font-bold text-slate-900 text-xs">{mod.label}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{mod.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:w-2/3 justify-start sm:justify-end">
                  {mod.actions.map(action => {
                    const isGranted = !!(selectedRole.permissions || {})[mod.moduleKey]?.[action];
                    const isLocked = selectedRole.isLocked || !canEditRoles;

                    return (
                      <button
                        key={action}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleTogglePermission(mod.moduleKey, action)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition select-none ${
                          isGranted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                        } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                      >
                        {isGranted ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300" />
                        )}
                        <span className="capitalize">{action.replace(/([A-Z])/g, ' $1')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
