import React from 'react';
import { Search, Bell, LogOut, Menu } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, setIsMobileOpen, setActiveTab }) {

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={() => setIsMobileOpen(prev => !prev)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, mobile, loan no., PAN, reference..."
            className="block w-full pl-9 pr-16 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:border-transparent text-slate-800 placeholder-slate-400 transition"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications, User Profile & Logout */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-[#0A3977] hover:bg-slate-100 rounded-full transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Badge */}
        <button 
          onClick={() => setActiveTab && setActiveTab('profile')}
          className="flex items-center gap-2 pl-2 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#0A3977] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            S
          </div>
          <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
            shivam
          </span>
        </button>


        {/* Logout Button */}
        <button 
          onClick={() => alert("Logging out of Paisa in Minutes CRM...")}
          className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-[#0A3977] transition shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </header>
  );
}
