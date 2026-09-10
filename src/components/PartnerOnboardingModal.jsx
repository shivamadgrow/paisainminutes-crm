import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Upload, 
  Check, 
  DollarSign, 
  Link as LinkIcon, 
  ShieldCheck, 
  FileText,
  Mail,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function PartnerOnboardingModal({ isOpen, onClose, onAddPartner }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    mobile: '',
    model: 'flat_pct',
    commissionRate: '2.5%',
    commissionPct: 0.025,
    perLeadFee: 1500,
    apiEndpoint: '',
    webhookUrl: '',
    agreementFileName: '',
    renewalDate: '2027-03-31',
    paymentTerms: 'Bi-monthly (1st & 16th)',
    accentColor: '#4F46E5',
    category: 'Fintech NBFC'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        agreementFileName: file.name
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const partnerId = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanRate = formData.model === 'per_lead' 
      ? `₹${formData.perLeadFee} / lead` 
      : `${(Number(formData.commissionPct) * 100).toFixed(1)}%`;

    const newPartner = {
      id: partnerId,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase() || partnerId.toUpperCase().slice(0, 4),
      category: formData.category,
      commissionRate: cleanRate,
      commissionPct: Number(formData.commissionPct) || 0.025,
      accentColor: formData.accentColor,
      paymentStatus: 'Pending',
      contactPerson: formData.contactPerson,
      email: formData.email,
      mobile: formData.mobile,
      apiEndpoint: formData.apiEndpoint,
      webhookUrl: formData.webhookUrl,
      agreementFileName: formData.agreementFileName || `${partnerId}_agreement.pdf`,
      renewalDate: formData.renewalDate
    };

    setTimeout(() => {
      if (onAddPartner) onAddPartner(newPartner);
      setIsSubmitting(false);
      setSuccessMsg('Partner successfully onboarded!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A3977]">Onboard New Affiliate Partner</h2>
              <p className="text-xs text-slate-500">Configure partner credentials, commission rate card & contract agreement</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Partner Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Partner Entity & Branding</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Partner / Brand Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="e.g. FlexiCredit NBFC" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Code</label>
                <input 
                  type="text" 
                  name="code" 
                  placeholder="e.g. FLXC" 
                  value={formData.code} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Accent Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    name="accentColor" 
                    value={formData.accentColor} 
                    onChange={handleChange}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600">{formData.accentColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lending Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                >
                  <option value="Fintech NBFC">Fintech NBFC</option>
                  <option value="Scheduled Commercial Bank">Scheduled Commercial Bank</option>
                  <option value="P2P Lending Platform">P2P Lending Platform</option>
                  <option value="Microfinance Institution">Microfinance Institution</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Alliances */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Partnership Contact</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                <input 
                  type="text" 
                  name="contactPerson" 
                  placeholder="e.g. Ramesh Verma" 
                  value={formData.contactPerson} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="partnerships@partner.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  placeholder="+91 9876543210" 
                  value={formData.mobile} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Commission Commercials */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Commercial Model & Commission Slabs</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Model</label>
                <select 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                >
                  <option value="flat_pct">Flat Percentage of Disbursal</option>
                  <option value="tiered">Tiered Volume Slabs</option>
                  <option value="per_lead">Flat Fee per Disbursed Lead</option>
                </select>
              </div>
              {formData.model !== 'per_lead' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="10" 
                    name="commissionPct" 
                    value={formData.commissionPct * 100} 
                    onChange={(e) => setFormData(p => ({ ...p, commissionPct: Number(e.target.value) / 100 }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">e.g. 2.5% on approved disbursed amount</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fee per Lead (₹)</label>
                  <input 
                    type="number" 
                    name="perLeadFee" 
                    value={formData.perLeadFee} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Flat ₹ fee payable on each approved disbursal</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Settlement Cycle</label>
                <select 
                  name="paymentTerms" 
                  value={formData.paymentTerms} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                >
                  <option value="Bi-monthly (1st & 16th)">Bi-monthly (1st & 16th)</option>
                  <option value="Monthly within 7 days">Monthly within 7 days</option>
                  <option value="Weekly (Every Monday)">Weekly (Every Monday)</option>
                  <option value="Instant Post-Disbursal">Instant Post-Disbursal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: API & Webhook Endpoints */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>4. Integration & Webhooks</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Inbound Lead API</label>
                <input 
                  type="url" 
                  name="apiEndpoint" 
                  placeholder="https://api.partner.com/leads/v1" 
                  value={formData.apiEndpoint} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Our Disbursal Status Webhook</label>
                <input 
                  type="url" 
                  name="webhookUrl" 
                  placeholder="https://crm.paisainminutes.com/api/webhooks/partner" 
                  value={formData.webhookUrl} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Agreement Upload & Renewal */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>5. Agreement Contract & Expiry Tracking</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agreement PDF / MOU Upload</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-3 text-center transition cursor-pointer bg-slate-50/50">
                  <input 
                    type="file" 
                    id="agreement-file" 
                    onChange={handleFileUpload}
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="agreement-file" className="cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-indigo-600 hover:underline">
                      {formData.agreementFileName || 'Select Signed Agreement File'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, DOC up to 10MB</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Expiry / Renewal Date</label>
                <input 
                  type="date" 
                  name="renewalDate" 
                  value={formData.renewalDate} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">CRM will flag alert 60 days before contract expiry</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0A3977] hover:bg-[#072956] rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Onboarding...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Complete Onboarding</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
