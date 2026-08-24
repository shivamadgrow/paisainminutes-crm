import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, ChevronRight, ChevronDown, PhoneCall } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function ReloanOpportunities() {
  const [showCalculation, setShowCalculation] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Re-loan opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Borrowers whose loan matures this month or last. <strong>Eligible</strong> means they'll qualify for a repeat loan once this loan is repaid — no settled or written-off loan, no other loan running.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = ['Month', 'Maturing Loans', 'Eligible for Re-loan', 'Avg Amount', 'Status'];
              exportToCsv(`paisa-crm-reloan-opportunities-${new Date().toISOString().slice(0, 10)}.csv`, headers, []);
            }}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
            title="Export Re-loan opportunities to Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => alert("Refreshed Re-loan opportunities.")}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* August 2026 Card */}
      <div className="crm-card p-5 bg-white space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 tracking-wider">
            AUGUST 2026
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 text-[#0A3977]">
            live - 11 days left
          </span>
        </div>
        <p className="text-xs text-slate-500">
          No loans mature in August 2026.
        </p>
      </div>

      {/* July 2026 Card */}
      <div className="crm-card p-5 bg-white space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 tracking-wider">
            JULY 2026
          </span>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600">
            closed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          No loans mature in July 2026.
        </p>
      </div>

      {/* How this is calculated Accordion */}
      <div>
        <button
          onClick={() => setShowCalculation(!showCalculation)}
          className="flex items-center gap-2 text-xs font-semibold text-[#0A3977] hover:underline"
        >
          {showCalculation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>How this is calculated</span>
        </button>

        {showCalculation && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2 animate-fade-in">
            <p><strong>1. Maturity Filter:</strong> Scans active loans with EMI maturity dates falling in the current or previous calendar month.</p>
            <p><strong>2. Eligibility Criteria:</strong> Borrower must have 0 overdue EMIs, clean payment track record, and no existing settlement/write-off flags.</p>
          </div>
        )}
      </div>

      {/* Center Empty State Card: Nothing to Call */}
      <div className="crm-card p-12 bg-white text-center flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0A3977] flex items-center justify-center mb-1">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          Nothing to call
        </h3>
        <p className="text-xs text-slate-400">
          No loans mature in either month.
        </p>
      </div>

    </div>
  );
}
