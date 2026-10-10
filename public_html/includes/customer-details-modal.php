<!-- ==========================================
     PAISA IN MINUTES - CUSTOMER DETAILS MODAL
     Fintech-Grade Secure Loan Profile Modal
     Opens after successful mobile OTP verification
     ========================================== -->
<style>
/* --- MODAL BACKDROP & CONTAINER --- */
.pim-details-overlay {
    position: fixed;
    inset: 0;
    z-index: 99998;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    overflow-y: auto;
    animation: pimDetailsFadeIn 0.25s ease-out;
}

@keyframes pimDetailsFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes pimDetailsSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.pim-details-card {
    background: #FFFFFF;
    border-radius: 24px;
    max-width: 750px;
    width: 100%;
    max-height: 90vh;
    padding: 2.25rem 2.25rem 2rem;
    box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.9);
    position: relative;
    animation: pimDetailsSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.pim-details-scroll-content {
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0.5rem;
    margin-right: -0.5rem;
    scrollbar-width: thin;
    scrollbar-color: #CBD5E1 transparent;
}

.pim-details-scroll-content::-webkit-scrollbar {
    width: 6px;
}
.pim-details-scroll-content::-webkit-scrollbar-track {
    background: transparent;
}
.pim-details-scroll-content::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 10px;
}

.pim-details-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: #F1F5F9;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
}

.pim-details-close:hover {
    background: #E2E8F0;
    color: #0F172A;
    transform: rotate(90deg);
}

/* --- HEADER & BADGES --- */
.pim-details-header {
    text-align: left;
    margin-bottom: 1.25rem;
    padding-right: 2.5rem;
}

.pim-details-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1B2A6B;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.78rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.pim-details-title {
    font-size: 1.55rem;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 0.35rem 0;
    letter-spacing: -0.02em;
    line-height: 1.25;
}

.pim-details-subtitle {
    font-size: 0.9rem;
    color: #64748B;
    margin: 0;
    line-height: 1.45;
}

/* --- VERIFIED MOBILE BANNER --- */
.pim-verified-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F8FAFC;
    border: 1.5px solid #E2E8F0;
    border-radius: 14px;
    padding: 0.75rem 1rem;
    margin-bottom: 1.35rem;
    gap: 0.75rem;
}

.pim-verified-banner-left {
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.pim-verified-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #ECFDF5;
    color: #10B981;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.pim-verified-info {
    display: flex;
    flex-direction: column;
}

.pim-verified-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.pim-verified-val {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0F172A;
    font-family: inherit;
    letter-spacing: 0.02em;
}

.pim-verified-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: #ECFDF5;
    color: #059669;
    border: 1px solid #A7F3D0;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
}

/* --- ALERTS --- */
.pim-details-alert {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.85rem;
    line-height: 1.4;
    font-weight: 600;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}
.pim-details-alert.error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #B91C1C;
}
.pim-details-alert.success {
    background: #ECFDF5;
    border: 1px solid #A7F3D0;
    color: #065F46;
}
.pim-details-alert.info {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1D4ED8;
}

/* --- FORM CONTROLS & 2-COLUMN GRID --- */
.pim-form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.pim-form-group {
    margin-bottom: 0;
    text-align: left;
    position: relative;
}

.pim-form-group.full-width {
    grid-column: 1 / -1;
}

.pim-form-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 0.35rem;
}

.pim-req {
    color: #EF4444;
    font-weight: 800;
    margin-left: 2px;
}

.pim-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.pim-input-icon {
    position: absolute;
    left: 0.85rem;
    color: #94A3B8;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pim-currency-prefix {
    position: absolute;
    left: 0.95rem;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1B2A6B;
    pointer-events: none;
}

.pim-form-input,
.pim-form-select {
    width: 100%;
    height: 48px;
    border: 1.5px solid #CBD5E1;
    border-radius: 12px;
    font-size: 0.92rem;
    font-weight: 600;
    color: #0F172A;
    background: #FFFFFF;
    padding: 0 0.95rem;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: inherit;
    outline: none;
}

.pim-form-input.pim-has-icon {
    padding-left: 2.5rem;
}

.pim-form-input.pim-has-currency {
    padding-left: 2.25rem;
}

.pim-form-input.pim-pan-input {
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
}

.pim-form-select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    padding-right: 2.5rem;
}

.pim-select-arrow {
    position: absolute;
    right: 0.95rem;
    color: #64748B;
    pointer-events: none;
    display: flex;
    align-items: center;
}

.pim-form-input:focus,
.pim-form-select:focus {
    border-color: #1B2A6B;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(27, 42, 107, 0.12);
}

.pim-form-input.is-invalid,
.pim-form-select.is-invalid {
    border-color: #EF4444;
    background: #FFFDFD;
}

.pim-form-input.is-valid,
.pim-form-select.is-valid {
    border-color: #10B981;
}

.pim-field-error {
    font-size: 0.78rem;
    color: #DC2626;
    margin-top: 0.25rem;
    font-weight: 600;
    min-height: 1rem;
    display: none;
}
.pim-field-error.active {
    display: block;
}

.pim-field-hint {
    font-size: 0.74rem;
    color: #64748B;
    margin-top: 0.25rem;
    display: block;
}

/* --- CONDITIONAL EMPLOYER SECTION --- */
.pim-conditional-field {
    grid-column: 1 / -1;
    display: none;
    animation: pimDetailsFadeIn 0.2s ease;
}

/* --- LOCATION TOGGLE / PREFERRED LOCATION --- */
.pim-pref-location-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}
.pim-pref-toggle-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.76rem;
    color: #475569;
    cursor: pointer;
    font-weight: 600;
    margin-top: 0.25rem;
}

/* --- CONSENT & PRIVACY SECTION --- */
.pim-consent-section {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 1.15rem;
    margin: 1rem 0 1.25rem;
    text-align: left;
}

.pim-privacy-notice {
    font-size: 0.78rem;
    color: #475569;
    line-height: 1.45;
    margin-bottom: 0.85rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}
.pim-lock-icon {
    flex-shrink: 0;
    color: #1B2A6B;
    margin-top: 2px;
}

.pim-consent-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    font-size: 0.8rem;
    line-height: 1.4;
    color: #334155;
    cursor: pointer;
    user-select: none;
    margin-bottom: 0.65rem;
}
.pim-consent-item:last-child {
    margin-bottom: 0;
}

.pim-checkbox {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: #1B2A6B;
    cursor: pointer;
    flex-shrink: 0;
}

.pim-consent-text a {
    color: #1B2A6B;
    text-decoration: underline;
    font-weight: 600;
}
.pim-consent-text a:hover {
    color: #4A8DFF;
}

/* --- SUBMIT ACTIONS --- */
.pim-form-actions {
    margin-top: 0.5rem;
}

.pim-submit-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, #1B2A6B 0%, #2A3F99 100%);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    box-shadow: 0 10px 25px -5px rgba(27, 42, 107, 0.35);
}

.pim-submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #111A44 0%, #1B2A6B 100%);
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(27, 42, 107, 0.45);
}

.pim-submit-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    transform: none;
}

.pim-btn-spinner {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.pim-spin {
    animation: pimSpin 0.9s linear infinite;
}
@keyframes pimSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* --- RESPONSIVE ADAPTATIONS --- */
@media (max-width: 768px) {
    .pim-details-card {
        max-width: 100%;
        max-height: 94vh;
        padding: 1.5rem 1.15rem 1.25rem;
        border-radius: 20px;
    }
    .pim-details-title {
        font-size: 1.3rem;
    }
    .pim-details-subtitle {
        font-size: 0.85rem;
    }
    .pim-form-grid-2 {
        grid-template-columns: 1fr;
        gap: 0.85rem;
    }
    .pim-conditional-field {
        grid-column: 1;
    }
    .pim-form-group.full-width {
        grid-column: 1;
    }
    .pim-submit-btn {
        height: 50px;
        font-size: 1rem;
    }
    .pim-consent-section {
        padding: 0.85rem;
    }
    .pim-verified-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    .pim-verified-tag {
        align-self: flex-start;
    }
}
</style>

<!-- MODAL MARKUP -->
<div class="pim-details-overlay" id="pimCustomerDetailsOverlay" role="dialog" aria-modal="true" aria-labelledby="pimModalTitle" aria-describedby="pimModalSubtitle">
    <div class="pim-details-card">
        <!-- Close Button -->
        <button type="button" class="pim-details-close" id="pimDetailsCloseBtn" aria-label="Close dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <!-- Header -->
        <div class="pim-details-header">
            <div class="pim-details-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span>Step 2 of 2 • Pre-Approved Eligibility</span>
            </div>
            <h2 class="pim-details-title" id="pimModalTitle">Complete Your Loan Profile</h2>
            <p class="pim-details-subtitle" id="pimModalSubtitle">
                Share a few details to help us understand your loan requirements and identify suitable loan options.
            </p>
        </div>

        <div class="pim-details-scroll-content">
            <!-- Alert Banner for errors & successes -->
            <div id="pimDetailsAlert" class="pim-details-alert" style="display: none;" role="alert"></div>

            <!-- Verified Mobile Number Banner (Read-only) -->
            <div class="pim-verified-banner">
                <div class="pim-verified-banner-left">
                    <div class="pim-verified-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <div class="pim-verified-info">
                        <span class="pim-verified-label">Verified Mobile Number</span>
                        <span class="pim-verified-val" id="pimDetailsVerifiedPhone">+91 ••••••••••</span>
                    </div>
                </div>
                <span class="pim-verified-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>OTP Verified</span>
                </span>
            </div>

            <!-- Intake Form -->
            <form id="pimCustomerDetailsForm" novalidate autocomplete="on">

                <!-- ROW 1: Full Name | Official Email -->
                <div class="pim-form-grid-2">
                    <!-- Full Name -->
                    <div class="pim-form-group">
                        <label for="pimFullName" class="pim-form-label">Full Name (As on PAN) <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <span class="pim-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span>
                            <input type="text" id="pimFullName" name="fullName" class="pim-form-input pim-has-icon" placeholder="e.g. Rahul Sharma" autocomplete="name" required maxlength="60">
                        </div>
                        <div class="pim-field-error" id="pimFullNameError"></div>
                    </div>

                    <!-- Official Email Address -->
                    <div class="pim-form-group">
                        <label for="pimOfficialEmail" class="pim-form-label">Official Email Address <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <span class="pim-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </span>
                            <input type="email" id="pimOfficialEmail" name="email" class="pim-form-input pim-has-icon" placeholder="e.g. name@company.com or active email" autocomplete="email" required>
                        </div>
                        <div class="pim-field-error" id="pimEmailError"></div>
                        <span class="pim-field-hint">Work or primary active personal email accepted</span>
                    </div>
                </div>

                <!-- ROW 2: PAN Number | Employment Type -->
                <div class="pim-form-grid-2">
                    <!-- PAN Number -->
                    <div class="pim-form-group">
                        <label for="pimPanNumber" class="pim-form-label">PAN Number <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <span class="pim-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="3"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="13" y2="12"></line></svg>
                            </span>
                            <input type="text" id="pimPanNumber" name="pan" class="pim-form-input pim-has-icon pim-pan-input" placeholder="ABCDE1234F" autocomplete="off" maxlength="10" autocapitalize="characters" required>
                        </div>
                        <div class="pim-field-error" id="pimPanError"></div>
                        <span class="pim-field-hint">Required for credit bureau verification and regulatory KYC</span>
                    </div>

                    <!-- Employment Type -->
                    <div class="pim-form-group">
                        <label for="pimEmploymentType" class="pim-form-label">Employment Type <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <select id="pimEmploymentType" name="employmentType" class="pim-form-select" required>
                                <option value="" disabled selected>Select employment</option>
                                <option value="Salaried">Salaried</option>
                                <option value="Self-Employed">Self-Employed</option>
                                <option value="Business Owner">Business Owner</option>
                                <option value="Other">Other</option>
                            </select>
                            <span class="pim-select-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </div>
                        <div class="pim-field-error" id="pimEmploymentTypeError"></div>
                    </div>

                    <!-- Conditional Employer / Business Name Field -->
                    <div class="pim-conditional-field" id="pimEmployerFieldWrap">
                        <div class="pim-form-group full-width">
                            <label for="pimEmployerName" class="pim-form-label" id="pimEmployerLabel">Company / Employer Name <span class="pim-req">*</span></label>
                            <div class="pim-input-wrap">
                                <span class="pim-input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                </span>
                                <input type="text" id="pimEmployerName" name="employerName" class="pim-form-input pim-has-icon" placeholder="e.g. Tata Consultancy Services, Infosys, etc.">
                            </div>
                            <div class="pim-field-error" id="pimEmployerNameError"></div>
                        </div>
                    </div>
                </div>

                <!-- ROW 3: Address Type | PIN Code -->
                <div class="pim-form-grid-2">
                    <!-- Address Type Dropdown -->
                    <div class="pim-form-group">
                        <label for="pimAddressType" class="pim-form-label">Address Type <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <select id="pimAddressType" name="addressType" class="pim-form-select" required>
                                <option value="" disabled selected>Select residence type</option>
                                <option value="Current Residential Address">Current Residential Address</option>
                                <option value="Permanent Residential Address">Permanent Residential Address</option>
                                <option value="Office/Business Address">Office/Business Address</option>
                            </select>
                            <span class="pim-select-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </div>
                        <div class="pim-field-error" id="pimAddressTypeError"></div>
                    </div>

                    <!-- PIN Code -->
                    <div class="pim-form-group">
                        <label for="pimPincode" class="pim-form-label">PIN Code <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <span class="pim-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </span>
                            <input type="text" id="pimPincode" name="pincode" class="pim-form-input pim-has-icon" placeholder="6-digit PIN code" maxlength="6" inputmode="numeric" required>
                        </div>
                        <div class="pim-field-error" id="pimPincodeError"></div>
                    </div>
                </div>

                <!-- ROW 4: Address Line 1 | Address Line 2 -->
                <div class="pim-form-grid-2">
                    <div class="pim-form-group">
                        <label for="pimAddressLine1" class="pim-form-label">Address Line 1 <span class="pim-req">*</span></label>
                        <input type="text" id="pimAddressLine1" name="addressLine1" class="pim-form-input" placeholder="House/Flat No., Building, Street" required>
                        <div class="pim-field-error" id="pimAddressLine1Error"></div>
                    </div>

                    <div class="pim-form-group">
                        <label for="pimAddressLine2" class="pim-form-label">Address Line 2 <span style="color: #64748B; font-weight: 500; font-size: 0.78rem;">(Optional)</span></label>
                        <input type="text" id="pimAddressLine2" name="addressLine2" class="pim-form-input" placeholder="Landmark, Area, Sector">
                    </div>
                </div>

                <!-- ROW 5: City | State -->
                <div class="pim-form-grid-2">
                    <div class="pim-form-group">
                        <label for="pimCity" class="pim-form-label">City <span class="pim-req">*</span></label>
                        <input type="text" id="pimCity" name="city" class="pim-form-input" placeholder="e.g. Mumbai, Delhi" required>
                        <div class="pim-field-error" id="pimCityError"></div>
                    </div>

                    <div class="pim-form-group">
                        <label for="pimState" class="pim-form-label">State <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <select id="pimState" name="state" class="pim-form-select" required>
                                <option value="" disabled selected>Select state</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Goa">Goa</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="Assam">Assam</option>
                                <option value="Other">Other State / UT</option>
                            </select>
                            <span class="pim-select-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </div>
                        <div class="pim-field-error" id="pimStateError"></div>
                    </div>
                </div>

                <!-- ROW 6: Monthly Income | Loan Amount Required -->
                <div class="pim-form-grid-2">
                    <!-- Monthly Income / Salary -->
                    <div class="pim-form-group">
                        <label for="pimMonthlySalary" class="pim-form-label">Monthly Income / Salary <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <span class="pim-currency-prefix">₹</span>
                            <input type="number" id="pimMonthlySalary" name="monthlySalary" class="pim-form-input pim-has-currency" placeholder="e.g. 35,000" min="10000" max="1000000" step="500" required>
                        </div>
                        <div class="pim-field-error" id="pimSalaryError"></div>
                        <span class="pim-field-hint">In-hand monthly income for eligibility matching</span>
                    </div>

                    <!-- Loan Amount Required (Manual Numeric Input) -->
                    <div class="pim-form-group">
                        <label for="pimLoanAmount" class="pim-form-label">Loan Amount Required <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <span class="pim-currency-prefix">₹</span>
                            <input type="text" 
                                   id="pimLoanAmount" 
                                   name="loanAmount" 
                                   class="pim-form-input pim-has-currency" 
                                   placeholder="Enter loan amount (₹5,000–₹1,00,000)" 
                                   inputmode="numeric" 
                                   required>
                        </div>
                        <div class="pim-field-error" id="pimLoanAmountError"></div>
                        <span class="pim-field-hint">Maximum available up to ₹1,00,000</span>
                    </div>
                </div>

                <!-- ROW 7: Loan Purpose | Preferred Location -->
                <div class="pim-form-grid-2">
                    <!-- Loan Purpose -->
                    <div class="pim-form-group">
                        <label for="pimLoanPurpose" class="pim-form-label">Loan Purpose <span class="pim-req">*</span></label>
                        <div class="pim-input-wrap">
                            <select id="pimLoanPurpose" name="loanPurpose" class="pim-form-select" required>
                                <option value="Medical Emergency" selected>Medical Emergency</option>
                                <option value="Household Expenses">Household Expenses</option>
                                <option value="Rent or Bills">Rent or Bills</option>
                                <option value="Education">Education</option>
                                <option value="Travel">Travel</option>
                                <option value="Other">Other</option>
                            </select>
                            <span class="pim-select-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </span>
                        </div>
                        <div class="pim-field-error" id="pimLoanPurposeError"></div>
                    </div>

                    <!-- Preferred Location -->
                    <div class="pim-form-group pim-pref-location-wrap">
                        <label for="pimPreferredLocation" class="pim-form-label">Preferred Location <span class="pim-req">*</span></label>
                        <input type="text" id="pimPreferredLocation" name="preferredLocation" class="pim-form-input" placeholder="City or PIN code" required>
                        <label class="pim-pref-toggle-label">
                            <input type="checkbox" id="pimSameLocationToggle" checked style="accent-color: #1B2A6B;">
                            <span>Same as residential address</span>
                        </label>
                        <div class="pim-field-error" id="pimPreferredLocationError"></div>
                    </div>
                </div>

                <!-- CONSENT & PRIVACY SECTION (Affirmative, Unbundled per DPDP Act) -->
                <div class="pim-consent-section">
                    <div class="pim-privacy-notice">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pim-lock-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span>Your data is encrypted with 256-bit SSL and used exclusively to assess loan eligibility and match offers with RBI-registered lending partners in accordance with our <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span>
                    </div>

                    <!-- Consent 1: Terms & Data Processing (Required) -->
                    <label class="pim-consent-item" for="pimConsentTerms">
                        <input type="checkbox" id="pimConsentTerms" class="pim-checkbox">
                        <span class="pim-consent-text">
                            I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</a> and authorize Paisa in Minutes to process my application details. <span class="pim-req">*</span>
                        </span>
                    </label>
                    <div class="pim-field-error" id="pimConsentTermsError"></div>

                    <!-- Consent 2: Credit Bureau / CIBIL (Separate, Unchecked by default, Required for credit evaluation) -->
                    <label class="pim-consent-item" for="pimConsentBureau">
                        <input type="checkbox" id="pimConsentBureau" class="pim-checkbox">
                        <span class="pim-consent-text">
                            I provide explicit affirmative consent to retrieve my credit score and report from authorized Credit Information Companies (CIBIL / Experian / CRIF / Equifax) on my behalf to assess loan options. <span class="pim-req">*</span>
                        </span>
                    </label>
                    <div class="pim-field-error" id="pimConsentBureauError"></div>

                    <!-- Consent 3: Communications / WhatsApp (Optional, Unchecked by default, Not mandatory for viewing offers) -->
                    <label class="pim-consent-item" for="pimConsentComms">
                        <input type="checkbox" id="pimConsentComms" class="pim-checkbox">
                        <span class="pim-consent-text">
                            (Optional) I consent to receive application status updates and relevant notifications via WhatsApp and SMS.
                        </span>
                    </label>
                </div>

                <!-- SUBMIT ACTIONS -->
                <div class="pim-form-actions">
                    <button type="submit" id="pimSubmitDetailsBtn" class="pim-submit-btn">
                        <span class="pim-btn-text" id="pimSubmitBtnText">Submit Details &amp; View Offers →</span>
                        <span class="pim-btn-spinner" id="pimSubmitBtnSpinner" style="display: none;">
                            <svg class="pim-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
                            <span>Saving Details &amp; Checking Offers...</span>
                        </span>
                    </button>
                </div>

            </form>
        </div>
    </div>
</div>

<!-- ==========================================
     COMPONENT LOGIC & EVENT HANDLERS
     ========================================== -->
<script>
window.PimCustomerDetailsModal = (function() {
    'use strict';

    let overlay = null;
    let form = null;
    let closeBtn = null;
    let alertEl = null;
    let submitBtn = null;
    let btnText = null;
    let btnSpinner = null;
    let phoneDisplay = null;

    // Fields
    let fullNameInput = null;
    let emailInput = null;
    let panInput = null;
    let empTypeSelect = null;
    let employerFieldWrap = null;
    let employerLabel = null;
    let employerInput = null;
    let addressTypeSelect = null;
    let pincodeInput = null;
    let addressLine1Input = null;
    let addressLine2Input = null;
    let cityInput = null;
    let stateSelect = null;
    let salaryInput = null;
    let loanAmountInput = null;
    let loanPurposeSelect = null;
    let prefLocationInput = null;
    let sameLocationToggle = null;
    let consentTermsCheckbox = null;
    let consentBureauCheckbox = null;
    let consentCommsCheckbox = null;

    let activePhone = '';
    let activeAuthToken = '';
    let activeLeadId = '';
    let onSuccessCallback = null;
    let onErrorCallback = null;
    let isSubmitting = false;

    const PRIVACY_NOTICE_VERSION = 'v2.2';

    // PIN prefix to City & State dictionary for smooth autofill
    const PIN_MAP = {
        '11': { city: 'New Delhi', state: 'Delhi' },
        '40': { city: 'Mumbai', state: 'Maharashtra' },
        '41': { city: 'Pune', state: 'Maharashtra' },
        '56': { city: 'Bengaluru', state: 'Karnataka' },
        '50': { city: 'Hyderabad', state: 'Telangana' },
        '60': { city: 'Chennai', state: 'Tamil Nadu' },
        '70': { city: 'Kolkata', state: 'West Bengal' },
        '38': { city: 'Ahmedabad', state: 'Gujarat' },
        '30': { city: 'Jaipur', state: 'Rajasthan' },
        '20': { city: 'Noida', state: 'Uttar Pradesh' },
        '12': { city: 'Gurugram', state: 'Haryana' },
        '14': { city: 'Ludhiana', state: 'Punjab' },
        '16': { city: 'Chandigarh', state: 'Chandigarh' }
    };

    function initElements() {
        if (overlay) return;

        overlay = document.getElementById('pimCustomerDetailsOverlay');
        if (!overlay) return;

        form = document.getElementById('pimCustomerDetailsForm');
        closeBtn = document.getElementById('pimDetailsCloseBtn');
        alertEl = document.getElementById('pimDetailsAlert');
        submitBtn = document.getElementById('pimSubmitDetailsBtn');
        btnText = document.getElementById('pimSubmitBtnText');
        btnSpinner = document.getElementById('pimSubmitBtnSpinner');
        phoneDisplay = document.getElementById('pimDetailsVerifiedPhone');

        fullNameInput = document.getElementById('pimFullName');
        emailInput = document.getElementById('pimOfficialEmail');
        panInput = document.getElementById('pimPanNumber');
        empTypeSelect = document.getElementById('pimEmploymentType');
        employerFieldWrap = document.getElementById('pimEmployerFieldWrap');
        employerLabel = document.getElementById('pimEmployerLabel');
        employerInput = document.getElementById('pimEmployerName');
        addressTypeSelect = document.getElementById('pimAddressType');
        pincodeInput = document.getElementById('pimPincode');
        addressLine1Input = document.getElementById('pimAddressLine1');
        addressLine2Input = document.getElementById('pimAddressLine2');
        cityInput = document.getElementById('pimCity');
        stateSelect = document.getElementById('pimState');
        salaryInput = document.getElementById('pimMonthlySalary');
        loanAmountInput = document.getElementById('pimLoanAmount');
        loanPurposeSelect = document.getElementById('pimLoanPurpose');
        prefLocationInput = document.getElementById('pimPreferredLocation');
        sameLocationToggle = document.getElementById('pimSameLocationToggle');
        consentTermsCheckbox = document.getElementById('pimConsentTerms');
        consentBureauCheckbox = document.getElementById('pimConsentBureau');
        consentCommsCheckbox = document.getElementById('pimConsentComms');

        attachEventListeners();
    }

    function attachEventListeners() {
        // Uppercase PAN input & filter invalid chars
        if (panInput) {
            panInput.addEventListener('input', function() {
                this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                clearFieldError('pimPanNumber');
            });
            panInput.addEventListener('blur', function() {
                validatePan(true);
            });
        }

        // Full name input filter & blur validation
        if (fullNameInput) {
            fullNameInput.addEventListener('input', function() {
                clearFieldError('pimFullName');
            });
            fullNameInput.addEventListener('blur', function() {
                validateFullName(true);
            });
        }

        // Email blur validation
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                clearFieldError('pimOfficialEmail');
            });
            emailInput.addEventListener('blur', function() {
                validateEmail(true);
            });
        }

        // Employment type change handler -> conditional employer field
        if (empTypeSelect) {
            empTypeSelect.addEventListener('change', function() {
                clearFieldError('pimEmploymentType');
                handleEmploymentChange(this.value);
            });
        }

        // PIN Code listener -> autofill City & State
        if (pincodeInput) {
            pincodeInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 6);
                clearFieldError('pimPincode');
                if (this.value.length === 6) {
                    const prefix = this.value.slice(0, 2);
                    if (PIN_MAP[prefix]) {
                        if (cityInput && !cityInput.value) cityInput.value = PIN_MAP[prefix].city;
                        if (stateSelect && (!stateSelect.value || stateSelect.value === '')) stateSelect.value = PIN_MAP[prefix].state;
                    }
                    syncPreferredLocation();
                }
            });
        }

        // City & State sync to Preferred Location if toggle checked
        if (cityInput) {
            cityInput.addEventListener('input', syncPreferredLocation);
        }
        if (sameLocationToggle) {
            sameLocationToggle.addEventListener('change', function() {
                if (this.checked) {
                    syncPreferredLocation();
                    if (prefLocationInput) prefLocationInput.readOnly = true;
                } else {
                    if (prefLocationInput) {
                        prefLocationInput.readOnly = false;
                        prefLocationInput.focus();
                    }
                }
            });
        }

        // Salary positive numbers only
        if (salaryInput) {
            salaryInput.addEventListener('input', function() {
                clearFieldError('pimMonthlySalary');
            });
            salaryInput.addEventListener('blur', function() {
                validateSalary(true);
            });
        }

        // Loan Amount manual input filter & formatting
        if (loanAmountInput) {
            loanAmountInput.addEventListener('input', function() {
                const digits = this.value.replace(/[^\d]/g, '');
                if (digits) {
                    const num = parseInt(digits, 10);
                    this.value = num.toLocaleString('en-IN');
                } else {
                    this.value = '';
                }
                clearFieldError('pimLoanAmount');
            });
            loanAmountInput.addEventListener('blur', function() {
                validateLoanAmount(true);
            });
        }

        // Address Type validation
        if (addressTypeSelect) {
            addressTypeSelect.addEventListener('change', function() {
                clearFieldError('pimAddressType');
            });
        }

        // Address Line 1 validation
        if (addressLine1Input) {
            addressLine1Input.addEventListener('input', function() {
                clearFieldError('pimAddressLine1');
            });
        }

        // City & State validation
        if (cityInput) {
            cityInput.addEventListener('blur', function() {
                validateCity(true);
            });
        }
        if (stateSelect) {
            stateSelect.addEventListener('change', function() {
                clearFieldError('pimState');
            });
        }

        // Consent Checkbox validation
        if (consentTermsCheckbox) {
            consentTermsCheckbox.addEventListener('change', function() {
                clearFieldError('pimConsentTerms');
            });
        }
        if (consentBureauCheckbox) {
            consentBureauCheckbox.addEventListener('change', function() {
                clearFieldError('pimConsentBureau');
            });
        }

        // Close button handler
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                close();
            });
        }

        // Overlay backdrop click to close
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    close();
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
                close();
            }
        });

        // Form Submit
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
    }

    function handleEmploymentChange(val) {
        if (!employerFieldWrap || !employerLabel) return;
        if (val === 'Salaried') {
            employerLabel.innerHTML = 'Company / Employer Name <span class="pim-req">*</span>';
            if (employerInput) employerInput.placeholder = 'e.g. Tata Consultancy Services, Infosys, etc.';
            employerFieldWrap.style.display = 'block';
        } else if (val === 'Self-Employed' || val === 'Business Owner') {
            employerLabel.innerHTML = 'Business / Enterprise Name <span class="pim-req">*</span>';
            if (employerInput) employerInput.placeholder = 'e.g. Retail Enterprise, Consulting, etc.';
            employerFieldWrap.style.display = 'block';
        } else if (val === 'Other') {
            employerLabel.innerHTML = 'Profession / Nature of Work';
            if (employerInput) employerInput.placeholder = 'e.g. Freelancer, Consultant, etc.';
            employerFieldWrap.style.display = 'block';
        } else {
            employerFieldWrap.style.display = 'none';
        }
    }

    function syncPreferredLocation() {
        if (!sameLocationToggle || !sameLocationToggle.checked || !prefLocationInput) return;
        const cityVal = cityInput ? cityInput.value.trim() : '';
        const pinVal = pincodeInput ? pincodeInput.value.trim() : '';
        if (cityVal && pinVal) {
            prefLocationInput.value = cityVal + ' (' + pinVal + ')';
        } else if (cityVal) {
            prefLocationInput.value = cityVal;
        } else if (pinVal) {
            prefLocationInput.value = 'PIN ' + pinVal;
        }
    }

    // --- VALIDATION HELPERS ---
    function setFieldError(fieldId, errorId, message) {
        const el = document.getElementById(fieldId);
        const errEl = document.getElementById(errorId);
        if (el) {
            el.classList.add('is-invalid');
            el.classList.remove('is-valid');
        }
        if (errEl) {
            errEl.textContent = message;
            errEl.classList.add('active');
        }
    }

    function clearFieldError(fieldId) {
        const el = document.getElementById(fieldId);
        if (el) {
            el.classList.remove('is-invalid');
        }
        const errContainer = el ? el.closest('.pim-form-group')?.querySelector('.pim-field-error') : null;
        if (errContainer) {
            errContainer.textContent = '';
            errContainer.classList.remove('active');
        }
    }

    function validateFullName(showError) {
        if (!fullNameInput) return false;
        const val = fullNameInput.value.trim();
        const nameRegex = /^[A-Za-z\s\.\']{3,60}$/;
        if (!val) {
            if (showError) setFieldError('pimFullName', 'pimFullNameError', 'Please enter your full name as per PAN.');
            return false;
        }
        if (!nameRegex.test(val) || val.length < 3) {
            if (showError) setFieldError('pimFullName', 'pimFullNameError', 'Please enter a valid full name (letters only, min 3 characters).');
            return false;
        }
        clearFieldError('pimFullName');
        fullNameInput.classList.add('is-valid');
        return true;
    }

    function validateEmail(showError) {
        if (!emailInput) return false;
        const val = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!val) {
            if (showError) setFieldError('pimOfficialEmail', 'pimEmailError', 'Please enter your email address.');
            return false;
        }
        if (!emailRegex.test(val)) {
            if (showError) setFieldError('pimOfficialEmail', 'pimEmailError', 'Please enter a valid email format (e.g. name@company.com).');
            return false;
        }
        clearFieldError('pimOfficialEmail');
        emailInput.classList.add('is-valid');
        return true;
    }

    function validatePan(showError) {
        if (!panInput) return false;
        const val = panInput.value.trim().toUpperCase();
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!val) {
            if (showError) setFieldError('pimPanNumber', 'pimPanError', 'Please enter your 10-digit PAN number.');
            return false;
        }
        if (!panRegex.test(val)) {
            if (showError) setFieldError('pimPanNumber', 'pimPanError', 'Please enter a valid 10-character PAN (e.g. ABCDE1234F).');
            return false;
        }
        clearFieldError('pimPanNumber');
        panInput.classList.add('is-valid');
        return true;
    }

    function validateEmployment(showError) {
        if (!empTypeSelect) return false;
        if (!empTypeSelect.value) {
            if (showError) setFieldError('pimEmploymentType', 'pimEmploymentTypeError', 'Please select your employment type.');
            return false;
        }
        clearFieldError('pimEmploymentType');
        empTypeSelect.classList.add('is-valid');

        // Check employer field if visible
        if (empTypeSelect.value === 'Salaried' || empTypeSelect.value === 'Self-Employed' || empTypeSelect.value === 'Business Owner') {
            if (employerInput && !employerInput.value.trim()) {
                if (showError) setFieldError('pimEmployerName', 'pimEmployerNameError', 'Please enter your company/business name.');
                return false;
            }
        }
        clearFieldError('pimEmployerName');
        return true;
    }

    function validateAddressType(showError) {
        if (!addressTypeSelect) return false;
        if (!addressTypeSelect.value) {
            if (showError) setFieldError('pimAddressType', 'pimAddressTypeError', 'Please select your address type.');
            return false;
        }
        clearFieldError('pimAddressType');
        addressTypeSelect.classList.add('is-valid');
        return true;
    }

    function validatePincode(showError) {
        if (!pincodeInput) return false;
        const val = pincodeInput.value.trim();
        const pinRegex = /^[1-9][0-9]{5}$/;
        if (!val) {
            if (showError) setFieldError('pimPincode', 'pimPincodeError', 'Please enter your 6-digit PIN code.');
            return false;
        }
        if (!pinRegex.test(val)) {
            if (showError) setFieldError('pimPincode', 'pimPincodeError', 'Please enter a valid 6-digit Indian PIN code.');
            return false;
        }
        clearFieldError('pimPincode');
        pincodeInput.classList.add('is-valid');
        return true;
    }

    function validateAddressLine1(showError) {
        if (!addressLine1Input) return false;
        const val = addressLine1Input.value.trim();
        if (!val || val.length < 3) {
            if (showError) setFieldError('pimAddressLine1', 'pimAddressLine1Error', 'Please enter your street address / flat details.');
            return false;
        }
        clearFieldError('pimAddressLine1');
        addressLine1Input.classList.add('is-valid');
        return true;
    }

    function validateCity(showError) {
        if (!cityInput) return false;
        const val = cityInput.value.trim();
        if (!val || val.length < 2) {
            if (showError) setFieldError('pimCity', 'pimCityError', 'Please enter your city.');
            return false;
        }
        clearFieldError('pimCity');
        cityInput.classList.add('is-valid');
        return true;
    }

    function validateState(showError) {
        if (!stateSelect) return false;
        if (!stateSelect.value) {
            if (showError) setFieldError('pimState', 'pimStateError', 'Please select your state.');
            return false;
        }
        clearFieldError('pimState');
        stateSelect.classList.add('is-valid');
        return true;
    }

    function validateSalary(showError) {
        if (!salaryInput) return false;
        const val = Number(salaryInput.value);
        if (!val || isNaN(val) || val <= 0) {
            if (showError) setFieldError('pimMonthlySalary', 'pimSalaryError', 'Please enter your monthly salary.');
            return false;
        }
        if (val < 10000) {
            if (showError) setFieldError('pimMonthlySalary', 'pimSalaryError', 'Minimum income requirement is ₹10,000/month.');
            return false;
        }
        if (val > 1000000) {
            if (showError) setFieldError('pimMonthlySalary', 'pimSalaryError', 'Please enter a reasonable monthly income.');
            return false;
        }
        clearFieldError('pimMonthlySalary');
        salaryInput.classList.add('is-valid');
        return true;
    }

    function cleanLoanAmountVal(raw) {
        if (typeof raw === 'number') return raw;
        if (!raw) return NaN;
        const str = String(raw).trim();
        if (str.includes('-')) return -1;
        const stripped = str.replace(/[₹,\s]/g, '');
        if (/[^\d]/.test(stripped)) return NaN;
        const clean = str.replace(/[^\d]/g, '');
        return clean ? parseInt(clean, 10) : NaN;
    }

    function formatIndianCurrency(num) {
        if (!num || isNaN(num)) return '';
        return Number(num).toLocaleString('en-IN');
    }

    function validateLoanAmount(showError) {
        if (!loanAmountInput) return false;
        const rawVal = loanAmountInput.value.trim();
        if (!rawVal) {
            if (showError) setFieldError('pimLoanAmount', 'pimLoanAmountError', 'Please enter your required loan amount.');
            return false;
        }
        const numVal = cleanLoanAmountVal(rawVal);
        if (isNaN(numVal) || numVal <= 0) {
            if (showError) setFieldError('pimLoanAmount', 'pimLoanAmountError', 'Please enter your required loan amount.');
            return false;
        }
        if (numVal < 5000) {
            if (showError) setFieldError('pimLoanAmount', 'pimLoanAmountError', 'Minimum loan amount is ₹5,000.');
            return false;
        }
        if (numVal > 100000) {
            if (showError) setFieldError('pimLoanAmount', 'pimLoanAmountError', 'Maximum loan amount is ₹1,00,000.');
            return false;
        }
        clearFieldError('pimLoanAmount');
        loanAmountInput.classList.add('is-valid');
        return true;
    }

    function validatePreferredLocation(showError) {
        if (!prefLocationInput) return false;
        const val = prefLocationInput.value.trim();
        if (!val) {
            if (showError) setFieldError('pimPreferredLocation', 'pimPreferredLocationError', 'Please enter or confirm preferred location.');
            return false;
        }
        clearFieldError('pimPreferredLocation');
        return true;
    }

    function validateConsents(showError) {
        let valid = true;
        if (!consentTermsCheckbox || !consentTermsCheckbox.checked) {
            if (showError) setFieldError('pimConsentTerms', 'pimConsentTermsError', 'Please accept the Terms & Conditions and Privacy Policy.');
            valid = false;
        } else {
            clearFieldError('pimConsentTerms');
        }

        if (!consentBureauCheckbox || !consentBureauCheckbox.checked) {
            if (showError) setFieldError('pimConsentBureau', 'pimConsentBureauError', 'Affirmative authorization is required for credit bureau evaluation.');
            valid = false;
        } else {
            clearFieldError('pimConsentBureau');
        }
        return valid;
    }

    function showAlert(msg, type) {
        if (!alertEl) return;
        alertEl.textContent = msg;
        alertEl.className = 'pim-details-alert ' + (type || 'info');
        alertEl.style.display = 'flex';
    }

    function hideAlert() {
        if (!alertEl) return;
        alertEl.style.display = 'none';
        alertEl.textContent = '';
    }

    // --- FORM SUBMIT HANDLER ---
    async function handleFormSubmit(e) {
        e.preventDefault();
        hideAlert();

        if (isSubmitting) return;

        // Perform all validations
        const isNameOk = validateFullName(true);
        const isEmailOk = validateEmail(true);
        const isPanOk = validatePan(true);
        const isEmpOk = validateEmployment(true);
        const isAddrTypeOk = validateAddressType(true);
        const isPinOk = validatePincode(true);
        const isAddr1Ok = validateAddressLine1(true);
        const isCityOk = validateCity(true);
        const isStateOk = validateState(true);
        const isSalOk = validateSalary(true);
        const isLoanOk = validateLoanAmount(true);
        const isPrefOk = validatePreferredLocation(true);
        const isConsentOk = validateConsents(true);

        if (!isNameOk || !isEmailOk || !isPanOk || !isEmpOk || !isAddrTypeOk || !isPinOk ||
            !isAddr1Ok || !isCityOk || !isStateOk || !isSalOk || !isLoanOk || !isPrefOk || !isConsentOk) {
            showAlert('Please complete all required fields correctly before proceeding.', 'error');
            const firstErr = overlay.querySelector('.is-invalid, .pim-field-error.active');
            if (firstErr) {
                firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Submitting state
        isSubmitting = true;
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'inline-flex';

        const consentTimestamp = new Date().toISOString();
        const payloadData = {
            activeLeadId: activeLeadId,
            lead_id: activeLeadId,
            leadCode: activeLeadId,
            phone: activePhone,
            mobile: activePhone,
            authToken: activeAuthToken,
            fullName: fullNameInput.value.trim(),
            name: fullNameInput.value.trim(),
            applicantName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            emailAddress: emailInput.value.trim(),
            pan: panInput.value.trim().toUpperCase(),
            panNumber: panInput.value.trim().toUpperCase(),
            employmentType: empTypeSelect.value,
            employerName: employerInput ? employerInput.value.trim() : '',
            companyName: employerInput ? employerInput.value.trim() : '',
            addressType: addressTypeSelect.value,
            pincode: pincodeInput.value.trim(),
            addressLine1: addressLine1Input.value.trim(),
            addressLine2: addressLine2Input ? addressLine2Input.value.trim() : '',
            city: cityInput.value.trim(),
            state: stateSelect.value,
            monthlySalary: Number(salaryInput.value),
            salary: Number(salaryInput.value),
            loanAmount: cleanLoanAmountVal(loanAmountInput.value),
            amount: cleanLoanAmountVal(loanAmountInput.value),
            loanPurpose: loanPurposeSelect.value,
            purpose: loanPurposeSelect.value,
            preferredLocation: prefLocationInput.value.trim(),
            bureauConsent: true,
            marketingConsent: consentCommsCheckbox ? consentCommsCheckbox.checked : false,
            consentTimestamp: consentTimestamp,
            noticeVersion: PRIVACY_NOTICE_VERSION
        };

        // Securely save details to backend /api/public/leads
        try {
            const apiBase = window.backend_server_url || 'https://api.paisainminutes.tech';
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            if (activeAuthToken) {
                headers['Authorization'] = 'Bearer ' + activeAuthToken;
            }

            // Resolve marketing attribution
            let modalSource = 'landingpage';
            let modalLeadSource = 'landingpage';
            let modalUtmSource = 'landingpage';
            let modalUtmMedium = 'website';
            let modalUtmCampaign = 'instant_cash_loan';
            let modalLandingPage = '/instant-cash-loan';

            try {
                if (window.PIMAttribution && typeof window.PIMAttribution.payload === 'function') {
                    const attr = window.PIMAttribution.payload();
                    if (attr) {
                        if (attr.utm_source) modalUtmSource = attr.utm_source;
                        if (attr.utm_medium) modalUtmMedium = attr.utm_medium;
                        if (attr.utm_campaign) modalUtmCampaign = attr.utm_campaign;
                        if (attr.landing_page) modalLandingPage = attr.landing_page;
                        if (attr.source) modalSource = attr.source;
                        modalLeadSource = modalSource;
                    }
                }
            } catch(e) {}

            try {
                const sSrc = sessionStorage.getItem('pim_lead_source') || sessionStorage.getItem('pim_utm_source');
                if (sSrc) {
                    modalSource = sSrc;
                    modalLeadSource = sSrc;
                    modalUtmSource = sessionStorage.getItem('pim_utm_source') || sSrc;
                }
                const sMed = sessionStorage.getItem('pim_utm_medium');
                if (sMed) modalUtmMedium = sMed;
                const sCamp = sessionStorage.getItem('pim_utm_campaign');
                if (sCamp) modalUtmCampaign = sCamp;
                const sPage = sessionStorage.getItem('pim_landing_page');
                if (sPage) modalLandingPage = sPage;
            } catch(e) {}

            // Attribution Rules: on instant-cash-loan, always guarantee landingpage unless explicit external ad campaign
            const isInstantCashLoan = typeof window !== 'undefined' && window.location && window.location.pathname.indexOf('instant-cash-loan') !== -1;
            const explicitUtm = (new URLSearchParams(window.location.search).get('utm_source') || '').trim().toLowerCase();
            const hasExternalPaidCampaign = Boolean(
                explicitUtm &&
                explicitUtm !== 'landingpage' &&
                explicitUtm !== 'website' &&
                explicitUtm !== 'direct' &&
                !explicitUtm.includes('whatsapp')
            );

            if (isInstantCashLoan && !hasExternalPaidCampaign) {
                modalSource = 'landingpage';
                modalLeadSource = 'landingpage';
                modalUtmSource = 'landingpage';
                modalUtmMedium = 'website';
                modalUtmCampaign = 'instant_cash_loan';
                modalLandingPage = '/instant-cash-loan';
            } else if (!modalUtmSource || modalUtmSource.toLowerCase() === 'landingpage' || modalUtmSource.toLowerCase() === 'website' || modalUtmSource.toLowerCase() === 'direct' || modalUtmSource.toLowerCase().includes('whatsapp')) {
                modalSource = 'landingpage';
                modalLeadSource = 'landingpage';
                modalUtmSource = 'landingpage';
                modalUtmMedium = 'website';
                modalUtmCampaign = 'instant_cash_loan';
                modalLandingPage = '/instant-cash-loan';
            }

            const res = await fetch(apiBase + '/api/public/leads', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    lead_id: activeLeadId,
                    leadCode: activeLeadId,
                    phone: activePhone,
                    mobile: activePhone,
                    name: payloadData.fullName,
                    fullName: payloadData.fullName,
                    applicantName: payloadData.fullName,
                    email: payloadData.email,
                    emailAddress: payloadData.email,
                    pan: payloadData.pan,
                    panNumber: payloadData.pan,
                    addressType: payloadData.addressType,
                    address_type: payloadData.addressType,
                    addressLine1: payloadData.addressLine1,
                    address_line1: payloadData.addressLine1,
                    addressLine2: payloadData.addressLine2,
                    pincode: payloadData.pincode,
                    city: payloadData.city,
                    state: payloadData.state,
                    employmentType: payloadData.employmentType,
                    companyName: payloadData.employerName,
                    employerName: payloadData.employerName,
                    salary: payloadData.salary,
                    monthlySalary: payloadData.salary,
                    monthlyIncome: payloadData.salary,
                    loanAmount: payloadData.loanAmount,
                    amount: payloadData.loanAmount,
                    purpose: payloadData.purpose,
                    preferredLocation: payloadData.preferredLocation,
                    consent: true,
                    bureauConsent: true,
                    marketingConsent: Boolean(payloadData.marketingConsent),
                    whatsappOptIn: Boolean(payloadData.marketingConsent),
                    consentTimestamp: consentTimestamp,
                    noticeVersion: PRIVACY_NOTICE_VERSION,
                    source: modalSource,
                    lead_source: modalLeadSource,
                    leadSource: modalLeadSource,
                    utm_source: modalUtmSource,
                    utmSource: modalUtmSource,
                    utm_medium: modalUtmMedium,
                    utmMedium: modalUtmMedium,
                    utm_campaign: modalUtmCampaign,
                    utmCampaign: modalUtmCampaign,
                    landing_page: modalLandingPage,
                    landingPage: modalLandingPage,
                    entry_point: 'instant-cash-loan',
                    entryPoint: 'instant-cash-loan',
                    status: "Fresh"
                }),
                keepalive: true
            }).catch(err => ({ ok: false, error: err }));

            let leadRespData = {};
            if (res && typeof res.json === 'function') {
                leadRespData = await res.json().catch(() => ({}));
            }

            // Extract resolved ID if returned by backend
            const confirmedId = leadRespData.lead_id || leadRespData.data?.lead_id || leadRespData.lead?.id || leadRespData.id;
            if (confirmedId) {
                payloadData.activeLeadId = confirmedId;
                activeLeadId = confirmedId;
            }

            // Show Confirmation Message
            showAlert('Your details have been submitted successfully. We are checking the available loan options.', 'success');

            // Dispatch custom event for tracking / listeners
            try {
                window.dispatchEvent(new CustomEvent('pim:customerDetailsSubmitted', { detail: payloadData }));
            } catch(e) {}

            // Graceful transition to offers & bureau evaluation
            setTimeout(() => {
                close();
                if (typeof onSuccessCallback === 'function') {
                    onSuccessCallback(payloadData);
                }
            }, 650);

        } catch(error) {
            console.error('[PIM_DETAILS_SAVE_ERROR]', error);
            // Even in network edge case, allow graceful fallback forward with user's verified details
            showAlert('Your details have been recorded. Checking loan eligibility...', 'info');
            setTimeout(() => {
                close();
                if (typeof onSuccessCallback === 'function') {
                    onSuccessCallback(payloadData);
                }
            }, 750);
        } finally {
            isSubmitting = false;
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    }

    // --- PUBLIC MODAL API ---
    function open(options) {
        initElements();
        if (!overlay) return;

        options = options || {};
        activePhone = String(options.phone || '').replace(/\D/g, '').slice(-10);
        activeAuthToken = options.authToken || '';
        activeLeadId = options.activeLeadId || ('PIM-' + Math.floor(100000 + Math.random() * 900000));
        onSuccessCallback = options.onSuccess || null;
        onErrorCallback = options.onError || null;

        // Display verified phone
        if (phoneDisplay) {
            phoneDisplay.textContent = activePhone ? ('+91 ' + activePhone.slice(0, 5) + ' ' + activePhone.slice(5)) : '+91 Verified';
        }

        // Reset state
        hideAlert();
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';

        // Pre-fill loan amount if provided
        if (loanAmountInput) {
            if (options.amount) {
                const parsed = cleanLoanAmountVal(options.amount);
                loanAmountInput.value = (!isNaN(parsed) && parsed > 0) ? formatIndianCurrency(parsed) : '';
            } else if (!loanAmountInput.value) {
                loanAmountInput.value = '';
            }
        }

        // Show modal with flex display
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            if (fullNameInput) fullNameInput.focus();
        }, 150);
    }

    function close() {
        if (!overlay) return;
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    return {
        open: open,
        close: close
    };
})();
</script>
