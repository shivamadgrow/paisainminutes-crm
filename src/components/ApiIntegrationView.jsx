import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Send, 
  Building2, 
  ArrowRight,
  Terminal,
  Layers
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';

export default function ApiIntegrationView({ onOpenTestModal }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const jsApplySnippet = `// 1. JavaScript snippet to embed in paisainminutes.com / Apply Now form
async function submitApplyNowLead(formData) {
  try {
    const payload = {
      name: formData.name,                // e.g. "Rahul Sharma"
      mobile: formData.mobile,            // e.g. "9876543210"
      email: formData.email,              // e.g. "rahul@gmail.com"
      loanAmount: formData.amount,        // e.g. 50000
      salary: formData.monthlySalary,     // e.g. 35000
      city: formData.city || "Delhi",
      source: "Apply Now Website",
      // Optional: Explicitly specify partner OR leave empty for smart auto-assignment
      assignedCompany: "Rupay91"          // Options: "Rupay91", "Adgrow", "AGDM", "Rupaysure"
    };

    const response = await fetch("https://paisainminutes.com/admin/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
      console.log("Lead successfully routed to CRM:", result.lead);
    }
  } catch (error) {
    console.error("Submission failed:", error);
  }
}`;

  const jsEligibilitySnippet = `// 2. JavaScript snippet for paisainminutes.com / Check Eligibility form
async function submitEligibilityCheck(userInputs) {
  try {
    const payload = {
      name: userInputs.fullName,
      mobile: userInputs.mobileNumber,
      loanAmount: userInputs.requiredAmount,
      salary: userInputs.monthlyIncome,
      cibil: userInputs.cibilScore,         // e.g. "750+" or "720"
      employmentType: userInputs.occupation, // e.g. "Salaried" or "Self-Employed"
      city: userInputs.city,
      pincode: userInputs.pincode,
      source: "Check Eligibility Website",
      eligibilityStatus: "Eligible - Instant Route",
      // Assigned Company matching offer clicked by user:
      assignedCompany: userInputs.selectedPartner || "Rupay91" // e.g. "Rupay91", "Adgrow", "AGDM", "Rupaysure"
    };

    const response = await fetch("https://paisainminutes.com/admin/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Eligibility check error:", error);
  }
}`;

  const curlSnippet = `curl -X POST https://paisainminutes.com/admin/api/submit-lead \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Shivam",
    "mobile": "9876543210",
    "loanAmount": 100000,
    "salary": 45000,
    "cibil": "750+",
    "source": "Apply Now Website",
    "assignedCompany": "Rupay91",
    "eligibilityStatus": "Eligible"
  }'`;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0A3977] text-white p-6 rounded-3xl shadow-lg border border-blue-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
              <Code2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Website Webhook & API Docs</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Website Integration & Lead Routing API
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Connect <span className="text-white font-bold">paisainminutes.com</span> forms (Apply Now & Eligibility Check) directly with the CRM to auto-route leads to <span className="text-amber-300 font-bold">Rupay91, Adgrow, AGDM, and Rupaysure</span>.
            </p>
          </div>

          <button
            onClick={onOpenTestModal}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Open Test Simulator</span>
          </button>
        </div>
      </div>

      {/* Partner Routing Reference Cards */}
      <div>
        <h2 className="text-sm font-bold text-[#0A3977] mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0A3977]" />
          <span>Supported Partner Company Keys for API</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AFFILIATE_PARTNERS.map(p => (
            <div key={p.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase ${p.badgeClass}`}>
                  {p.name}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  value: "{p.name}"
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Min CIBIL {p.minCibil}+ · Salary ₹{p.minSalary?.toLocaleString('en-IN')}+
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Code Snippet 1: Apply Now */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-200">1. Website Apply Now Form Integration</span>
          </div>
          <button
            onClick={() => copyToClipboard(jsApplySnippet, 'apply')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === 'apply' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'apply' ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
          {jsApplySnippet}
        </pre>
      </div>

      {/* Code Snippet 2: Check Eligibility */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">2. Check Eligibility Form with Company Assignment</span>
          </div>
          <button
            onClick={() => copyToClipboard(jsEligibilitySnippet, 'eligibility')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === 'eligibility' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'eligibility' ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
          {jsEligibilitySnippet}
        </pre>
      </div>

      {/* Code Snippet 3: cURL Command */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-200">3. Direct cURL Command (Test Endpoint)</span>
          </div>
          <button
            onClick={() => copyToClipboard(curlSnippet, 'curl')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'curl' ? 'Copied!' : 'Copy cURL'}</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-purple-300 overflow-x-auto leading-relaxed">
          {curlSnippet}
        </pre>
      </div>

    </div>
  );
}
