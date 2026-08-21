import React, { useState } from 'react';
import { Plus, FileSpreadsheet, Search } from 'lucide-react';

export default function StaffView() {
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');

  const staffMembers = [
    {
      id: '1',
      name: 'admin',
      email: 'info@rupay91.com',
      initials: 'AD',
      role: 'Admin',
      branch: '—',
      status: 'Active',
      lastLogin: '20/08/2026, 14:56',
      created: '07/07/2026'
    },
    {
      id: '2',
      name: 'shivam',
      email: 'shivam@adgrowmedia.com',
      initials: 'SH',
      role: 'Admin',
      branch: 'Delhi',
      status: 'Active',
      lastLogin: '20/08/2026, 15:00',
      created: '20/08/2026'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Add User Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Staff
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            2 users · 10 roles
          </p>
        </div>

        <button
          onClick={() => alert("Add user form popup...")}
          className="px-4 py-2 bg-[#0A3977] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add user</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['Users', 'Roles', 'Login History'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === tab 
                ? 'bg-[#0A3977] text-white shadow-2xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Input Bar & Excel Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, email, role or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
          />
        </div>

        <button 
          onClick={() => alert("Exporting Staff list to Excel...")}
          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Excel</span>
        </button>
      </div>

      {/* Staff Table Box */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 min-w-[200px]">USER</th>
                <th className="p-3.5">ROLES</th>
                <th className="p-3.5">BRANCH</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">LAST LOGIN</th>
                <th className="p-3.5">CREATED</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {staffMembers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                  {/* USER */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A3977] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* ROLES */}
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-[#0A3977]">
                      {user.role}
                    </span>
                  </td>

                  {/* BRANCH */}
                  <td className="p-3.5 text-slate-600 font-medium">
                    {user.branch}
                  </td>

                  {/* STATUS */}
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {user.status}
                    </span>
                  </td>

                  {/* LAST LOGIN */}
                  <td className="p-3.5 text-xs text-slate-500 font-mono">
                    {user.lastLogin}
                  </td>

                  {/* CREATED */}
                  <td className="p-3.5 text-xs text-slate-500 font-mono">
                    {user.created}
                  </td>

                  {/* ACTION LINKS */}
                  <td className="p-3.5 text-right space-x-2 font-medium text-[11px]">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-blue-600 hover:underline">Downloads</button>
                    <button className="text-blue-600 hover:underline">Reset</button>
                    <button className="text-blue-600 hover:underline">Leave</button>
                    <button className="text-blue-600 hover:underline">Redistribute</button>
                    <button className="text-rose-600 hover:underline">Disable</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
