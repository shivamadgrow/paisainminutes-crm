<?php
$page_title = "Apply Now for Instant Personal Loan | Paisa in Minutes";
$page_description = "Apply for instant personal loan up to ₹1 Lakh online with Paisa in Minutes. 100% digital approval, minimal documentation & fast disbursal from RBI-registered NBFC partners.";
$page_keywords = "apply personal loan online, instant loan application, paisa in minutes apply now, low interest loan online";

$prefill_name    = htmlspecialchars($_GET['name'] ?? '');
$prefill_phone   = htmlspecialchars($_GET['phone'] ?? '');
$prefill_email   = htmlspecialchars($_GET['email'] ?? '');
$prefill_salary  = htmlspecialchars($_GET['salary'] ?? '');
$prefill_loan    = htmlspecialchars($_GET['amount'] ?? $_GET['loan_amount'] ?? '');
$prefill_pincode = htmlspecialchars($_GET['pincode'] ?? '');
$utm_source      = htmlspecialchars($_GET['utm_source'] ?? $_SESSION['pim_utm_source'] ?? $_COOKIE['pim_utm_source'] ?? '');

include 'includes/header.php';
?>

<style>
.apply-hero-section {
    background: var(--gradient-primary);
    padding: 5.6rem 0 2rem 0;
    position: relative;
    color: #ffffff;
    overflow: hidden;
}

@media (max-width: 991px) {
    .apply-hero-section {
        padding: 4.8rem 0 1.5rem 0 !important;
    }
}

@media (max-width: 576px) {
    .apply-hero-section {
        padding: 4.4rem 0 1.25rem 0 !important;
    }
}

.apply-hero-left {
    color: #ffffff;
}

.apply-tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 0.45rem 1.15rem;
    border-radius: 50px;
    font-size: 0.88rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 1.5rem;
}

.apply-tag-pill svg {
    width: 18px;
    height: 18px;
    color: #10B981;
}

.apply-hero-left h1 {
    font-size: 2.75rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.25rem;
    color: #ffffff;
    letter-spacing: -0.02em;
}

.apply-hero-left h1 span {
    color: #FCD34D;
    white-space: nowrap;
}

.apply-hero-left p.lead-text {
    font-size: 1.1rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2.25rem;
}

.apply-hero-highlights {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

@media (max-width: 576px) {
    .apply-hero-left h1 {
        font-size: 2.1rem;
    }
    .apply-hero-highlights {
        grid-template-columns: 1fr;
    }
}

.apply-highlight-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 0.8rem 1.1rem;
    border-radius: 14px;
    font-size: 0.92rem;
    font-weight: 600;
    color: #ffffff;
}

.apply-highlight-card svg {
    width: 20px;
    height: 20px;
    color: #10B981;
    flex-shrink: 0;
}

/* Right Application Form Card */
.apply-card-wrapper {
    background: #ffffff;
    border-radius: 24px;
    padding: 2.5rem 2rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    color: var(--text-dark);
    box-sizing: border-box;
    border: 1px solid #E2E8F0;
}

@media (max-width: 576px) {
    .apply-card-wrapper {
        padding: 1.75rem 1.25rem !important;
        border-radius: 20px !important;
    }
}

/* Multi-Section Form Styling */
.form-section-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0F172A;
    margin-top: 2rem;
    margin-bottom: 1.15rem;
    letter-spacing: -0.01em;
}
.form-section-title:first-of-type {
    margin-top: 0;
}
.form-field-group {
    margin-bottom: 1.15rem;
}
.form-field-label {
    display: block;
    font-size: 0.92rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.45rem;
}
.form-field-label .required-star {
    color: #EF4444;
    font-weight: 700;
    margin-left: 2px;
}
.form-text-input {
    width: 100%;
    padding: 0.85rem 1.1rem;
    font-size: 0.95rem;
    color: #0F172A;
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    border-radius: 12px;
    box-sizing: border-box;
    transition: all 0.2s ease;
    font-family: inherit;
}
.form-text-input:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.form-text-input::placeholder {
    color: #94A3B8;
}

/* Pill / Toggle Buttons */
.form-pill-grid {
    display: grid;
    gap: 0.75rem;
    width: 100%;
}
.form-pill-grid-2 {
    grid-template-columns: repeat(2, 1fr);
}
.form-pill-grid-3 {
    grid-template-columns: repeat(3, 1fr);
}
.form-pill-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.82rem 0.75rem;
    border: 1.5px solid #E2E8F0;
    border-radius: 12px;
    background: #FFFFFF;
    color: #334155;
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    user-select: none;
    text-align: center;
}
.form-pill-btn:hover {
    border-color: #CBD5E1;
    background: #F8FAFC;
}
.form-pill-btn.active {
    background: #EFF6FF !important;
    border-color: #2563EB !important;
    color: #1D4ED8 !important;
    font-weight: 700 !important;
    box-shadow: 0 0 0 1px #2563EB;
}

/* Checkboxes */
.form-terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    cursor: pointer;
    margin-bottom: 0.85rem;
    font-size: 0.88rem;
    color: #334155;
    line-height: 1.45;
}
.form-terms-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    accent-color: #2563EB;
    cursor: pointer;
    margin-top: 2px;
    flex-shrink: 0;
}
.form-terms-checkbox a {
    color: #2563EB;
    text-decoration: underline;
    font-weight: 600;
}

/* Submit Button */
.form-submit-btn {
    width: 100%;
    padding: 1rem 1.5rem;
    background: #0265DC;
    color: #FFFFFF;
    font-size: 1.05rem;
    font-weight: 700;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(2, 101, 220, 0.35);
    transition: all 0.2s ease;
    margin-top: 1.25rem;
}
.form-submit-btn:hover {
    background: #0056C7;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(2, 101, 220, 0.45);
}
.form-submit-btn:active {
    transform: translateY(0);
}
.form-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.apply-card-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.apply-card-header h2 {
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.35rem;
    line-height: 1.3;
}

.apply-card-header p {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-weight: 500;
}

/* Features Section */
.apply-features-section {
    padding: 5rem 0;
    background: #F8FAFC;
}

.apply-features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.75rem;
}

@media (max-width: 991px) {
    .apply-features-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 576px) {
    .apply-features-grid {
        grid-template-columns: 1fr;
    }
}

.apply-feature-card {
    background: #ffffff;
    padding: 2.25rem 1.75rem;
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    text-align: center;
    transition: var(--transition-smooth);
}

.apply-feature-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
    border-color: var(--accent-color);
}

.apply-feature-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: var(--primary-light);
    color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
}

.apply-feature-icon svg {
    width: 32px;
    height: 32px;
}

.apply-feature-card h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.apply-feature-card p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.55;
}

/* How to Apply Steps */
.apply-steps-section {
    padding: 5rem 0;
    background: #ffffff;
}

.section-heading-center {
    text-align: center;
    max-width: 650px;
    margin: 0 auto 3.5rem;
}

.section-heading-center h2 {
    font-size: 2.1rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.75rem;
}

.section-heading-center p {
    font-size: 1.05rem;
    color: var(--text-muted);
}

.apply-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

@media (max-width: 768px) {
    .apply-steps-grid {
        grid-template-columns: 1fr;
    }
}

.apply-step-box {
    background: #F8FAFC;
    border: 1px dashed #CBD5E1;
    border-radius: 18px;
    padding: 2.25rem 1.75rem;
    position: relative;
}

.apply-step-number {
    position: absolute;
    top: -16px;
    left: 24px;
    background: var(--accent-color);
    color: #ffffff;
    font-weight: 800;
    font-size: 0.95rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(74, 141, 255, 0.4);
}

.apply-step-box h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
}

.apply-step-box p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.55;
}

/* Compliance & Rates Disclosure Section */
.compliance-section {
    padding: 5rem 0;
    background: #F8FAFC;
    border-top: 1px solid #E2E8F0;
}

.compliance-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 2.5rem;
}

@media (max-width: 768px) {
    .compliance-grid-2 {
        grid-template-columns: 1fr;
    }
}

.compliance-card {
    background: #ffffff;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 2.25rem 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.compliance-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 1.25rem;
}

.compliance-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.compliance-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.85rem;
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.5;
}

.compliance-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: -2px;
    color: var(--accent-color);
    font-weight: bold;
    font-size: 1.4rem;
}

.compliance-box-full {
    background: #ffffff;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 2.5rem 2.25rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
    margin-bottom: 2.5rem;
}

.compliance-box-full h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.75rem;
}

.compliance-box-full h4 {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
}

.compliance-box-full p {
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.example-table-card {
    background: #ffffff;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 2.25rem 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
    overflow-x: auto !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box !important;
    -webkit-overflow-scrolling: touch;
}

.example-table-card h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 1.75rem;
}

.example-table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
}

@media (max-width: 768px) {
    .example-table-card {
        padding: 1.25rem 0.75rem !important;
    }
    .example-table {
        min-width: 550px;
    }
}

.example-table th {
    background: #F1F5F9;
    color: #1E293B;
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0.9rem 1rem;
    text-align: left;
    border: 1px solid #CBD5E1;
}

.example-table td {
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
    color: #334155;
    border: 1px solid #CBD5E1;
.example-table tr:nth-child(even) {
    background: #F8FAFC;
}
</style>

<!-- MAIN HERO & APPLICATION FORM SECTION -->
<section class="apply-hero-section" style="background: var(--gradient-primary); position: relative; overflow: hidden;">
    <div class="container" style="max-width: 580px; margin: 0 auto; padding: 0 1rem;">

        <!-- Header Info (Compact) -->
        <div style="text-align: center; margin-bottom: 0.85rem; color: #ffffff;">
            <div class="apply-tag-pill" style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.25); padding: 0.22rem 0.85rem; border-radius: 50px; font-size: 0.76rem; font-weight: 600; color: #ffffff; margin-bottom: 0.35rem;">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width: 14px; height: 14px; color: #10B981;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                ⚡ 100% Digital &amp; Paperless
            </div>

            <h1 style="font-size: clamp(1.2rem, 2.5vw, 1.55rem); font-weight: 800; line-height: 1.2; margin: 0 0 0.2rem 0; color: #ffffff; letter-spacing: -0.015em;">
                Get Instant Loan <span style="color: #FCD34D;">Up to ₹1 Lakh</span>
            </h1>
            <p style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.85); margin: 0; line-height: 1.3;">
                Apply in less than 2 minutes — verify your mobile first
            </p>
        </div>

        <!-- STEP INDICATOR (Compact) -->
        <div id="applyStepIndicator" style="display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 0.85rem;">
            <div class="apply-step-dot active" id="stepDot1" style="display:flex;flex-direction:column;align-items:center;gap:0.15rem;">
                <div style="width:26px;height:26px;border-radius:50%;background:#ffffff;color:#0A3977;font-weight:800;font-size:0.78rem;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.15);">1</div>
                <span style="font-size:0.65rem;color:rgba(255,255,255,0.95);font-weight:600;">Mobile</span>
            </div>
            <div style="flex:1;max-width:55px;height:2px;background:rgba(255,255,255,0.3);margin:0 0.35rem;margin-bottom:0.8rem;" id="stepLine1"></div>
            <div class="apply-step-dot" id="stepDot2" style="display:flex;flex-direction:column;align-items:center;gap:0.15rem;">
                <div style="width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,0.25);color:rgba(255,255,255,0.7);font-weight:800;font-size:0.78rem;display:flex;align-items:center;justify-content:center;">2</div>
                <span style="font-size:0.65rem;color:rgba(255,255,255,0.6);font-weight:600;">Verify OTP</span>
            </div>
            <div style="flex:1;max-width:55px;height:2px;background:rgba(255,255,255,0.3);margin:0 0.35rem;margin-bottom:0.8rem;" id="stepLine2"></div>
            <div class="apply-step-dot" id="stepDot3" style="display:flex;flex-direction:column;align-items:center;gap:0.15rem;">
                <div style="width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,0.25);color:rgba(255,255,255,0.7);font-weight:800;font-size:0.78rem;display:flex;align-items:center;justify-content:center;">3</div>
                <span style="font-size:0.65rem;color:rgba(255,255,255,0.6);font-weight:600;">Apply</span>
            </div>
        </div>

        <!-- ===== STEP 1: PHONE ENTRY ===== -->
        <div id="applyStep1" class="apply-card-wrapper" style="background:#ffffff;border-radius:20px;padding:1.65rem 1.45rem;box-shadow:0 16px 40px rgba(0,0,0,0.22);width:100%;box-sizing:border-box;border:1px solid #E2E8F0;">
            <div style="text-align:center;margin-bottom:1rem;">
                <div style="width:46px;height:46px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 0.5rem;">
                    <svg style="width:22px;height:22px;color:#2563EB;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <h2 style="font-size:1.18rem;font-weight:800;color:#0F172A;margin:0 0 0.2rem;">Enter Your Mobile Number</h2>
                <p style="font-size:0.82rem;color:#64748B;margin:0;">We'll send an OTP to verify your number</p>
            </div>

            <div style="margin-bottom:1.25rem;">
                <label for="applyPhoneInput" style="display:block;font-size:0.88rem;font-weight:600;color:#374151;margin-bottom:0.5rem;">Mobile Number <span style="color:#EF4444;">*</span></label>
                <div style="display:flex;align-items:center;border:2px solid #E2E8F0;border-radius:14px;overflow:hidden;background:#F8FAFC;transition:border-color 0.2s;" id="applyPhoneInputWrap">
                    <span style="padding:0 0.85rem;font-size:0.95rem;font-weight:700;color:#374151;border-right:2px solid #E2E8F0;background:#fff;height:100%;display:flex;align-items:center;min-height:50px;">+91</span>
                    <input type="tel" id="applyPhoneInput" placeholder="Enter 10-digit mobile number" maxlength="10" inputmode="numeric"
                        style="flex:1;border:none;outline:none;background:transparent;padding:0.85rem 1rem;font-size:1rem;font-weight:600;color:#0F172A;width:100%;"
                        value="<?php echo $prefill_phone; ?>">
                </div>
                <div id="applyPhoneError" style="display:none;color:#DC2626;font-size:0.82rem;font-weight:600;margin-top:0.4rem;"></div>
            </div>

            <button type="button" id="btnSendOtp" style="width:100%;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#fff;padding:0.95rem 1.5rem;border-radius:14px;font-size:1rem;font-weight:800;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(37,99,235,0.35);transition:all 0.2s;letter-spacing:0.01em;">
                Send OTP →
            </button>

            <!-- Consent & Checkbox Section below Send OTP (as per reference design) -->
            <div style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; text-align: left;">
                
                <!-- Green Shield Safety Note -->
                <div style="display: flex; align-items: flex-start; gap: 0.45rem; font-size: 0.78rem; color: #166534; line-height: 1.45;">
                    <svg viewBox="0 0 20 20" fill="#16A34A" style="width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                    <span>Your data is safe with us and governed by <a href="/privacy-policy" target="_blank" style="color: #15803D; font-weight: 700; text-decoration: underline;">Paisa in Minutes's Privacy Policy</a>.</span>
                </div>

                <!-- Checkbox 1: Credit Bureau Consent -->
                <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.76rem; color: #4B5563; line-height: 1.5; cursor: pointer;">
                    <input type="checkbox" id="step1Consent1" name="step1_consent_cibil" required style="margin-top: 2px; accent-color: #2563EB; width: 16px; height: 16px; flex-shrink: 0; cursor: pointer;">
                    <span>I hereby consent to Paisa in Minutes and its <a href="/partner-terms" target="_blank" style="color: #EA580C; font-weight: 700; text-decoration: underline;">lending partners</a> to receive my credit information from Credit Reporting Agencies for the purpose of cross-selling and up-selling financial institution products to consumers who have a credit history (&ldquo;end-use purposes&rdquo;) on a month-to-month basis for a period of six (6) months.</span>
                </label>

                <!-- Checkbox 2: Details Sharing, Privacy Policy & T&C -->
                <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.76rem; color: #4B5563; line-height: 1.5; cursor: pointer;">
                    <input type="checkbox" id="step1Consent2" name="step1_consent_terms" required style="margin-top: 2px; accent-color: #2563EB; width: 16px; height: 16px; flex-shrink: 0; cursor: pointer;">
                    <span>I agree to share my details, which shall be governed by Paisa in Minutes's <a href="/privacy-policy" target="_blank" style="color: #2563EB; font-weight: 600; text-decoration: underline;">Privacy Policy</a>, <a href="/partner-terms" target="_blank" style="color: #2563EB; font-weight: 600; text-decoration: underline;">Third Party Sharing Borrower's Consent</a>, and <a href="/terms-and-conditions" target="_blank" style="color: #2563EB; font-weight: 600; text-decoration: underline;">T&amp;C</a>, and receive communication via call, SMS, RCS, email, and WhatsApp.</span>
                </label>

                <div id="step1ConsentError" style="display: none; color: #DC2626; font-size: 0.8rem; font-weight: 600; text-align: center; margin-top: 0.2rem;">Please accept both checkboxes to continue.</div>
            </div>
        </div>

        <!-- ===== STEP 3: FULL APPLICATION FORM (hidden until OTP verified) ===== -->
        <div id="applyStep3" style="display:none;">
            <!-- Verified Banner (Compact) -->
            <div style="background:rgba(16,185,129,0.18);border:1px solid rgba(16,185,129,0.45);border-radius:12px;padding:0.4rem 0.85rem;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;">
                <svg style="width:16px;height:16px;color:#10B981;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                <span style="font-size:0.8rem;font-weight:700;color:#fff;" id="applyVerifiedBanner">✓ Mobile Verified — Complete your application below</span>
            </div>

            <!-- Multi-Section Application Form Card (Compact) -->
            <div class="apply-card-wrapper" style="background:#ffffff;border-radius:20px;padding:1.65rem 1.45rem;box-shadow:0 16px 40px rgba(0,0,0,0.22);width:100%;box-sizing:border-box;border:1px solid #E2E8F0;">
                <form id="loanApplicationForm">
                    <!-- 1. PERSONAL INFORMATION -->
                    <h3 class="form-section-title">Personal Information</h3>

                    <div class="form-field-group">
                        <label for="leadName" class="form-field-label">Name <span class="required-star">*</span></label>
                        <input type="text" id="leadName" name="name" class="form-text-input" placeholder="Enter name" value="<?php echo $prefill_name; ?>" required>
                    </div>

                    <div class="form-field-group">
                        <label for="leadPhone" class="form-field-label">Mobile <span class="required-star">*</span></label>
                        <input type="tel" id="leadPhone" name="phone" class="form-text-input" placeholder="Enter 10-digit mobile number" maxlength="10" pattern="[6-9][0-9]{9}" value="<?php echo $prefill_phone; ?>" required readonly style="background:#F8FAFC;color:#374151;cursor:not-allowed;">
                        <div id="leadCibilBadge" style="display:none; margin-top: 6px; font-size: 0.82rem; border-radius: 6px; padding: 5px 10px; transition: all 0.3s ease;"></div>
                    </div>

                    <div class="form-field-group">
                        <label for="leadEmail" class="form-field-label">Email <span class="required-star">*</span></label>
                        <input type="email" id="leadEmail" name="email" class="form-text-input" placeholder="Enter email" value="<?php echo $prefill_email; ?>" required>
                    </div>

                    <div class="form-field-group">
                        <label for="leadDob" class="form-field-label">Dob <span class="required-star">*</span></label>
                        <input type="date" id="leadDob" name="dob" class="form-text-input" placeholder="dd-mm-yyyy" required>
                    </div>

                    <div class="form-field-group">
                        <label class="form-field-label">Gender <span class="required-star">*</span></label>
                        <input type="hidden" id="leadGender" name="gender" value="Male">
                        <div class="form-pill-grid form-pill-grid-3">
                            <button type="button" class="form-pill-btn active" data-pill-group="gender" data-value="Male">Male</button>
                            <button type="button" class="form-pill-btn" data-pill-group="gender" data-value="Female">Female</button>
                            <button type="button" class="form-pill-btn" data-pill-group="gender" data-value="Other">Other</button>
                        </div>
                    </div>

                    <!-- 2. ADDRESS INFORMATION -->
                    <h3 class="form-section-title">Address Information</h3>

                    <div class="form-field-group">
                        <label class="form-field-label">Address Type</label>
                        <input type="hidden" id="leadAddressType" name="address_type" value="Rented">
                        <div class="form-pill-grid form-pill-grid-2">
                            <button type="button" class="form-pill-btn active" data-pill-group="address_type" data-value="Rented">Rented</button>
                            <button type="button" class="form-pill-btn" data-pill-group="address_type" data-value="Owned">Owned</button>
                        </div>
                    </div>

                    <div class="form-field-group">
                        <label for="leadPincode" class="form-field-label">Pincode <span class="required-star">*</span></label>
                        <input type="text" id="leadPincode" name="pincode" class="form-text-input" placeholder="Enter 6-digit PIN code" maxlength="6" pattern="[0-9]{6}" value="<?php echo $prefill_pincode; ?>" required>
                    </div>

                    <!-- 3. EMPLOYMENT & INCOME -->
                    <h3 class="form-section-title">Employment &amp; Income</h3>

                    <div class="form-field-group">
                        <label class="form-field-label">EmploymentType <span class="required-star">*</span></label>
                        <input type="hidden" id="leadEmploymentType" name="employment_type" value="Salaried">
                        <div class="form-pill-grid form-pill-grid-2">
                            <button type="button" class="form-pill-btn active" data-pill-group="employment_type" data-value="Salaried">Salaried</button>
                            <button type="button" class="form-pill-btn" data-pill-group="employment_type" data-value="Self Employed">Self Employed</button>
                        </div>
                    </div>

                    <div class="form-field-group">
                        <label for="leadSalary" class="form-field-label">Salary <span class="required-star">*</span></label>
                        <input type="number" id="leadSalary" name="salary" class="form-text-input" placeholder="Enter salary" min="5000" step="1000" value="<?php echo $prefill_salary; ?>" required>
                    </div>

                    <div class="form-field-group">
                        <label for="leadLoanAmount" class="form-field-label">Required Loan Amount <span class="required-star">*</span></label>
                        <input type="number" id="leadLoanAmount" name="loan_amount" class="form-text-input" placeholder="Enter required loan amount" min="5000" max="500000" step="1000" value="<?php echo $prefill_loan; ?>" required>
                    </div>

                    <div class="form-field-group">
                        <label class="form-field-label">Mode Of Salary</label>
                        <input type="hidden" id="leadSalaryMode" name="mode_of_salary" value="Bank Transfer">
                        <div class="form-pill-grid form-pill-grid-3">
                            <button type="button" class="form-pill-btn" data-pill-group="mode_of_salary" data-value="Cash">Cash</button>
                            <button type="button" class="form-pill-btn" data-pill-group="mode_of_salary" data-value="UPI">UPI</button>
                            <button type="button" class="form-pill-btn active" data-pill-group="mode_of_salary" data-value="Bank Transfer">Bank Transfer</button>
                        </div>
                    </div>

                    <div class="form-field-group">
                        <label for="leadCompanyName" class="form-field-label">Company Name</label>
                        <input type="text" id="leadCompanyName" name="company_name" class="form-text-input" placeholder="Enter company name">
                    </div>

                    <!-- 4. IDENTITY VERIFICATION -->
                    <h3 class="form-section-title">Identity Verification</h3>

                    <div class="form-field-group">
                        <label for="leadPan" class="form-field-label">Pan <span class="required-star">*</span></label>
                        <input type="text" id="leadPan" name="pan" class="form-text-input" placeholder="Enter PAN (e.g., ABCDE1234F)" maxlength="10" style="text-transform: uppercase;" pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}" required>
                    </div>

                    <div class="form-field-group">
                        <label class="form-field-label">Have a credit card? <span class="required-star">*</span></label>
                        <input type="hidden" id="leadCreditCard" name="have_credit_card" value="No">
                        <div class="form-pill-grid form-pill-grid-2">
                            <button type="button" class="form-pill-btn" data-pill-group="have_credit_card" data-value="Yes">Yes</button>
                            <button type="button" class="form-pill-btn active" data-pill-group="have_credit_card" data-value="No">No</button>
                        </div>
                    </div>

                    <div class="form-field-group" id="leadCreditCardLimitGroup" style="display: none;">
                        <label for="leadCreditCardLimit" class="form-field-label">Credit Card Limit</label>
                        <input type="number" id="leadCreditCardLimit" name="credit_card_limit" class="form-text-input" placeholder="Enter credit card limit" min="0" step="1000">
                    </div>

                    <!-- 5. AGREEMENTS & SUBMIT -->
                    <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #F1F5F9;">
                        <!-- Green Shield Safety Note -->
                        <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.78rem; color: #166534; line-height: 1.45; margin-bottom: 0.75rem;">
                            <svg viewBox="0 0 20 20" fill="#16A34A" style="width: 16px; height: 16px; flex-shrink: 0;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                            <span>Your data is safe with us and governed by <a href="/privacy-policy" target="_blank" style="color: #15803D; font-weight: 700; text-decoration: underline;">Paisa in Minutes's Privacy Policy</a>.</span>
                        </div>

                        <label class="form-terms-checkbox">
                            <input type="checkbox" id="agreeTerms1" name="agree_terms" required>
                            <span>I agree to the <a href="/terms-and-conditions" target="_blank">Terms of Service</a> of Paisa in Minutes.</span>
                        </label>

                        <label class="form-terms-checkbox">
                            <input type="checkbox" id="agreeTerms2" name="agree_partner_terms" required>
                            <span>I agree to the <a href="/partner-terms" target="_blank">Terms &amp; Conditions</a> of the partners of Paisa in Minutes.</span>
                        </label>
                    </div>

                    <button type="submit" id="btnSubmitApplication" class="form-submit-btn">Submit</button>

                    <div id="applicationFormStatus" style="margin-top: 1rem; display: none; text-align: center; font-size: 0.9rem; font-weight: 600; padding: 0.75rem; border-radius: 10px;"></div>
                </form>
            </div>
        </div>

        <!-- Trust Badges below Card -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.25rem; margin-top: 1.5rem; color: rgba(255, 255, 255, 0.85); font-size: 0.85rem; font-weight: 500;">
            <span style="display: flex; align-items: center; gap: 0.4rem;"><svg viewBox="0 0 20 20" fill="#10B981" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> Approval in 2 Mins</span>
            <span style="display: flex; align-items: center; gap: 0.4rem;"><svg viewBox="0 0 20 20" fill="#10B981" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> Low Interest Rates</span>
            <span style="display: flex; align-items: center; gap: 0.4rem;"><svg viewBox="0 0 20 20" fill="#10B981" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> No Hidden Charges</span>
        </div>
    </div>
</section>

<!-- WHY CHOOSE US / FEATURES SECTION -->
<section class="apply-features-section">
    <div class="container">
        <div class="section-heading-center">
            <h2>Why Apply via Paisa in Minutes?</h2>
            <p>We simplify borrowing with maximum transparency, speed, and zero collateral requirements.</p>
        </div>

        <div class="apply-features-grid">
            <div class="apply-feature-card">
                <div class="apply-feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3>Instant Disbursal</h3>
                <p>Get funds directly credited to your bank account within hours after quick verification.</p>
            </div>

            <div class="apply-feature-card">
                <div class="apply-feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3>RBI-Registered NBFCs</h3>
                <p>100% safe, compliant, and transparent loan options from trusted regulated lenders.</p>
            </div>

            <div class="apply-feature-card">
                <div class="apply-feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                </div>
                <h3>Minimal Documents</h3>
                <p>Only PAN card & basic KYC required. No cumbersome paperwork or branch visits.</p>
            </div>

            <div class="apply-feature-card">
                <div class="apply-feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </div>
                <h3>256-Bit Data Encryption</h3>
                <p>Your personal data is encrypted with strict confidentiality and never sold to third parties.</p>
            </div>
        </div>
    </div>
</section>

<!-- 3 SIMPLE STEPS TO APPLY -->
<section class="apply-steps-section">
    <div class="container">
        <div class="section-heading-center">
            <h2>3 Easy Steps to Get Your Loan</h2>
            <p>Complete your application in under 3 minutes with our fast digital process.</p>
        </div>

        <div class="apply-steps-grid">
            <div class="apply-step-box">
                <div class="apply-step-number">1</div>
                <h3>Enter Mobile Number</h3>
                <p>Provide your 10-digit mobile number above to initiate instant profile verification.</p>
            </div>

            <div class="apply-step-box">
                <div class="apply-step-number">2</div>
                <h3>Select Best Loan Offer</h3>
                <p>Compare pre-approved loan options customized for your eligibility and interest rate preference.</p>
            </div>

            <div class="apply-step-box">
                <div class="apply-step-number">3</div>
                <h3>Get Money in Account</h3>
                <p>Complete online KYC and get the approved loan amount disbursed directly to your bank account.</p>
            </div>
        </div>
    </div>
</section>

<!-- RATES & COMPLIANCE DISCLOSURE SECTION -->
<section class="compliance-section">
    <div class="container">
        <!-- 2 Side-by-Side Rates & Charges Cards -->
        <div class="compliance-grid-2">
            <div class="compliance-card">
                <h3>Rates & Charges</h3>
                <ul class="compliance-list">
                    <li>Minimum loan amount - Rs 5,000 /-</li>
                    <li>Maximum loan amount - Rs 10,00,000 /-</li>
                    <li>Tenure - 61 Days to 180 Days (Up to 60 Months)</li>
                    <li>Processing fee - upto 5% of loan amount</li>
                </ul>
            </div>

            <div class="compliance-card">
                <h3>Rates & Charges</h3>
                <ul class="compliance-list">
                    <li>No pre - closure charges</li>
                    <li>No prepayment charges</li>
                    <li>ROI (Rate of interest) starting @ 10.99% p.a.</li>
                    <li>APR (Annual Percentage Rate) 10.99% to 36% per annum</li>
                    <li>Bounce charges: Rs. 500/ per bounce</li>
                </ul>
            </div>
        </div>

        <!-- Full Width APR & Working Explanation Box -->
        <div class="compliance-box-full">
            <h3>How is APR determined?</h3>
            <p>Annual percentage rate (APR) is determined based on your credit score, the amount you wish to borrow and your steady income. Generally, a good CIBIL score calls for a low APR while a poor CIBIL score means high APR. At Paisa in Minutes, we maintain complete transparency across all our RBI-registered lending partners.</p>

            <h4>Working of Our Rates & Fees</h4>
            <p>APR reflects the true cost of borrowing money. It includes the annual interest rate, a nominal processing fee and other miscellaneous expenses. APR is usually lower than your credit card interest rate. APR is the actual annual cost of your loan that helps you compare various loan offers from different lenders. We ensure full clarity with no hidden fees.</p>
        </div>

        <!-- Representative Monthly Payment Example Table Card -->
        <div class="example-table-card">
            <h3>Monthly Payment Example</h3>
            <table class="example-table">
                <thead>
                    <tr>
                        <th>Tenure</th>
                        <th>Loan Amount</th>
                        <th>Interest Rate</th>
                        <th>Admin Fees</th>
                        <th>APR</th>
                        <th>Amount Disbursed</th>
                        <th>EMI</th>
                        <th>Total Interest</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>3 Months</td>
                        <td>Rs. 20,000</td>
                        <td>2%</td>
                        <td>Rs. 1,000</td>
                        <td>24%</td>
                        <td>Rs. 19,000</td>
                        <td>Rs. 6,935</td>
                        <td>Rs. 805</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const loanForm = document.getElementById('loanApplicationForm');
    const formStatus = document.getElementById('applicationFormStatus');
    const submitBtn = document.getElementById('btnSubmitApplication');

    // ============================================================
    //  STEP 1 → OTP → STEP 3 FLOW
    // ============================================================
    const step1El = document.getElementById('applyStep1');
    const step3El = document.getElementById('applyStep3');
    const applyPhoneInput = document.getElementById('applyPhoneInput');
    const btnSendOtp = document.getElementById('btnSendOtp');
    const applyPhoneError = document.getElementById('applyPhoneError');

    // Step indicator update helper
    function activateStep(num) {
        [1, 2, 3].forEach(function(n) {
            const dot = document.getElementById('stepDot' + n);
            if (!dot) return;
            const circle = dot.querySelector('div');
            const label = dot.querySelector('span');
            if (n < num) {
                circle.style.background = '#10B981';
                circle.style.color = '#fff';
                circle.style.boxShadow = '0 2px 8px rgba(16,185,129,0.4)';
                if (label) label.style.color = 'rgba(255,255,255,0.9)';
            } else if (n === num) {
                circle.style.background = '#ffffff';
                circle.style.color = '#0A3977';
                circle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                if (label) label.style.color = 'rgba(255,255,255,0.9)';
            } else {
                circle.style.background = 'rgba(255,255,255,0.25)';
                circle.style.color = 'rgba(255,255,255,0.6)';
                circle.style.boxShadow = 'none';
                if (label) label.style.color = 'rgba(255,255,255,0.5)';
            }
        });
        // Lines
        for (var l = 1; l <= 2; l++) {
            var line = document.getElementById('stepLine' + l);
            if (line) line.style.background = (l < num) ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.3)';
        }
    }

    // Show Step 3 (application form) after OTP verified
    function showApplicationForm(verifiedPhone) {
        // Populate verified phone into form (readonly)
        var leadPhoneInput = document.getElementById('leadPhone');
        if (leadPhoneInput) leadPhoneInput.value = verifiedPhone;

        // Update verified banner
        var banner = document.getElementById('applyVerifiedBanner');
        if (banner) banner.textContent = '✓ +91 ' + verifiedPhone + ' Verified — Complete your application below';

        // Transition Step 1 → Step 3
        if (step1El) {
            step1El.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            step1El.style.opacity = '0';
            step1El.style.transform = 'translateY(-12px)';
            setTimeout(function() {
                step1El.style.display = 'none';
                if (step3El) {
                    step3El.style.display = 'block';
                    step3El.style.opacity = '0';
                    step3El.style.transform = 'translateY(16px)';
                    step3El.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    requestAnimationFrame(function() {
                        step3El.style.opacity = '1';
                        step3El.style.transform = 'translateY(0)';
                    });
                    step3El.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
        activateStep(3);
    }

    // Input sanitizer
    if (applyPhoneInput) {
        applyPhoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
            if (applyPhoneError) applyPhoneError.style.display = 'none';
        });
        applyPhoneInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); btnSendOtp && btnSendOtp.click(); }
        });
        // Focus ring
        applyPhoneInput.addEventListener('focus', function() {
            var wrap = document.getElementById('applyPhoneInputWrap');
            if (wrap) wrap.style.borderColor = '#2563EB';
        });
        applyPhoneInput.addEventListener('blur', function() {
            var wrap = document.getElementById('applyPhoneInputWrap');
            if (wrap) wrap.style.borderColor = '#E2E8F0';
        });
    }

    // Send OTP button click
    if (btnSendOtp) {
        btnSendOtp.addEventListener('click', function() {
            var phone = (applyPhoneInput ? applyPhoneInput.value : '').replace(/\D/g, '');
            if (phone.length !== 10 || !/^[6-9]/.test(phone)) {
                if (applyPhoneError) {
                    applyPhoneError.textContent = 'Please enter a valid 10-digit mobile number starting with 6-9.';
                    applyPhoneError.style.display = 'block';
                }
                if (applyPhoneInput) applyPhoneInput.focus();
                return;
            }
            if (applyPhoneError) applyPhoneError.style.display = 'none';

            // Validate consent checkboxes
            var c1 = document.getElementById('step1Consent1');
            var c2 = document.getElementById('step1Consent2');
            var consentErr = document.getElementById('step1ConsentError');
            if ((c1 && !c1.checked) || (c2 && !c2.checked)) {
                if (consentErr) consentErr.style.display = 'block';
                return;
            }
            if (consentErr) consentErr.style.display = 'none';

            // Activate step 2 indicator
            activateStep(2);

            // Button loading state
            btnSendOtp.disabled = true;
            btnSendOtp.textContent = 'Sending OTP...';

            // Open OTP Modal via existing PimOtpService
            if (window.PimOtpService) {
                window.PimOtpService.open(phone, function(verifiedData) {
                    try { sessionStorage.setItem('pim_otp_verified_' + phone, 'true'); } catch(e) {}
                    showApplicationForm(phone);
                });
                // Re-enable button if modal closed without verifying
                setTimeout(function() {
                    if (step1El && step1El.style.display !== 'none') {
                        btnSendOtp.disabled = false;
                        btnSendOtp.textContent = 'Send OTP →';
                        activateStep(1);
                    }
                }, 500);
            } else {
                // Fallback: no OTP service loaded, proceed directly
                console.warn('[Apply] PimOtpService not found — proceeding without OTP');
                showApplicationForm(phone);
                btnSendOtp.disabled = false;
            }
        });
    }

    // Auto-proceed if phone already verified in session (e.g. revisit) or prefilled via URL
    var prefillPhone = (applyPhoneInput ? applyPhoneInput.value : '').replace(/\D/g, '');
    if (prefillPhone.length === 10) {
        try {
            var alreadyVerified = sessionStorage.getItem('pim_otp_verified_' + prefillPhone);
            if (alreadyVerified) {
                activateStep(3);
                showApplicationForm(prefillPhone);
            }
        } catch(e) {}
    }

    // 1. Interactive Pill / Toggle Selector Buttons
    document.querySelectorAll('.form-pill-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const group = this.getAttribute('data-pill-group');
            const val = this.getAttribute('data-value');

            // Deactivate sibling buttons in this group
            document.querySelectorAll('.form-pill-btn[data-pill-group="' + group + '"]').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // Update corresponding hidden input
            const hiddenInput = document.querySelector('input[name="' + group + '"]');
            if (hiddenInput) {
                hiddenInput.value = val;
            }

            // Show / hide Credit Card Limit field
            if (group === 'have_credit_card') {
                const limitGroup = document.getElementById('leadCreditCardLimitGroup');
                if (limitGroup) {
                    limitGroup.style.display = (val === 'Yes') ? 'block' : 'none';
                    if (val !== 'Yes') {
                        const limitInput = document.getElementById('leadCreditCardLimit');
                        if (limitInput) limitInput.value = '';
                    }
                }
            }
        });
    });

    // 2. Input Masks & Sanitizers
    const panInput = document.getElementById('leadPan');
    if (panInput) {
        panInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        });
    }

    const phoneInput = document.getElementById('leadPhone');
    const cibilBadge = document.getElementById('leadCibilBadge');
    let cibilLookupTimeout = null;

    function autoCheckCibil(phoneNum) {
        if (!phoneNum || phoneNum.length !== 10 || !/^[6-9]/.test(phoneNum)) {
            if (cibilBadge) cibilBadge.style.display = 'none';
            return;
        }
        if (cibilBadge) {
            cibilBadge.style.display = 'inline-flex';
            cibilBadge.style.alignItems = 'center';
            cibilBadge.style.gap = '6px';
            cibilBadge.style.background = '#EFF6FF';
            cibilBadge.style.color = '#2563EB';
            cibilBadge.style.border = '1px solid #BFDBFE';
            cibilBadge.innerHTML = '<span>⚡</span> <span>Checking bureau credit score...</span>';
        }
        fetch('/api/fetch-cibil.php?phone=' + encodeURIComponent(phoneNum))
            .then(r => r.json())
            .then(res => {
                if (res && res.success && res.score) {
                    if (cibilBadge) {
                        cibilBadge.style.display = 'inline-flex';
                        cibilBadge.style.background = '#ECFDF5';
                        cibilBadge.style.color = '#065F46';
                        cibilBadge.style.border = '1px solid #A7F3D0';
                        cibilBadge.innerHTML = '<span>✓</span> <strong>Verified CIBIL Score: ' + res.score + ' (' + (res.band || 'Good') + ')</strong>';
                    }
                    try { sessionStorage.setItem('pim_cibil', res.score); } catch(e){}
                } else {
                    if (cibilBadge) cibilBadge.style.display = 'none';
                }
            })
            .catch(() => {
                if (cibilBadge) cibilBadge.style.display = 'none';
            });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
            clearTimeout(cibilLookupTimeout);
            if (this.value.length === 10 && /^[6-9]/.test(this.value)) {
                cibilLookupTimeout = setTimeout(() => autoCheckCibil(this.value), 400);
            } else if (cibilBadge) {
                cibilBadge.style.display = 'none';
            }
        });

        if (phoneInput.value.length === 10 && /^[6-9]/.test(phoneInput.value)) {
            autoCheckCibil(phoneInput.value);
        }
    }


    const pinInput = document.getElementById('leadPincode');
    if (pinInput) {
        pinInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    // 3. Form Submission Handler
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (formStatus) {
                formStatus.style.display = 'none';
                formStatus.textContent = '';
            }

            const nameVal = (document.getElementById('leadName')?.value || '').trim();
            const phoneVal = (phoneInput?.value || '').trim();
            const emailVal = (document.getElementById('leadEmail')?.value || '').trim();
            const dobVal = (document.getElementById('leadDob')?.value || '').trim();
            const genderVal = document.getElementById('leadGender')?.value || 'Male';
            const addressTypeVal = document.getElementById('leadAddressType')?.value || 'Current';
            const pincodeVal = (pinInput?.value || '').trim();
            const empTypeVal = document.getElementById('leadEmploymentType')?.value || 'Salaried';
            const salaryVal = (document.getElementById('leadSalary')?.value || '').trim();
            const loanAmtVal = (document.getElementById('leadLoanAmount')?.value || '').trim();
            const salaryModeVal = document.getElementById('leadSalaryMode')?.value || 'Bank Transfer';
            const companyNameVal = (document.getElementById('leadCompanyName')?.value || '').trim();
            const panVal = (panInput?.value || '').trim().toUpperCase();
            const creditCardVal = document.getElementById('leadCreditCard')?.value || 'No';
            const creditCardLimitVal = (document.getElementById('leadCreditCardLimit')?.value || '').trim();

            // Validations
            function showError(msg) {
                if (formStatus) {
                    formStatus.style.display = 'block';
                    formStatus.style.background = '#FEF2F2';
                    formStatus.style.color = '#DC2626';
                    formStatus.style.border = '1px solid #FCA5A5';
                    formStatus.textContent = msg;
                }
            }

            if (!nameVal) {
                showError('Please enter your full name.');
                return;
            }

            if (phoneVal.length !== 10 || !/^[6-9]/.test(phoneVal)) {
                showError('Please enter a valid 10-digit mobile number starting with 6-9.');
                return;
            }

            if (!emailVal || !emailVal.includes('@')) {
                showError('Please enter a valid email address.');
                return;
            }

            if (!dobVal) {
                showError('Please select your Date of Birth.');
                return;
            }

            if (pincodeVal.length !== 6) {
                showError('Please enter a valid 6-digit PIN code.');
                return;
            }

            if (!salaryVal || Number(salaryVal) < 5000) {
                showError('Please enter a valid monthly salary (min ₹5,000).');
                return;
            }

            if (!loanAmtVal || Number(loanAmtVal) < 5000) {
                showError('Please enter your required loan amount (min ₹5,000).');
                return;
            }

            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(panVal)) {
                showError('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).');
                return;
            }

            const agree1 = document.getElementById('agreeTerms1');
            const agree2 = document.getElementById('agreeTerms2');
            if ((agree1 && !agree1.checked) || (agree2 && !agree2.checked)) {
                showError('Please agree to the Terms of Service and Partner Terms & Conditions.');
                return;
            }

            // Lock submit button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing Application...';
            }

            const jwtToken = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token') || '';

            // 1. Detect UTM Source (Priority: URL query > sessionStorage > localStorage > PHP session/cookie)
            const urlParams = new URLSearchParams(window.location.search);
            const activeUtm = (urlParams.get('utm_source') || 
                               sessionStorage.getItem('pim_utm_source') || 
                               localStorage.getItem('pim_utm_source') || 
                               '<?php echo !empty($utm_source) ? htmlspecialchars($utm_source) : ""; ?>' || '').trim();

            // 2. Separate WhatsApp vs Direct Website Source
            const hasUtm = Boolean(activeUtm && activeUtm !== '' && activeUtm !== 'undefined' && activeUtm !== 'null');
            const finalUtmSource = hasUtm ? activeUtm : null;
            const isWhatsApp = hasUtm && activeUtm.toLowerCase().includes('whatsapp');
            const finalSource = hasUtm ? activeUtm : "Apply Now (Website)";
            const finalLeadSource = hasUtm ? (isWhatsApp ? 'WhatsApp' : 'Campaign') : 'Direct Website';

            const payload = {
                name: nameVal,
                fullName: nameVal,
                phone: phoneVal,
                mobile: phoneVal,
                email: emailVal,
                emailAddress: emailVal,
                dob: dobVal,
                dateOfBirth: dobVal,
                gender: genderVal,
                addressType: addressTypeVal,
                address_type: addressTypeVal,
                pincode: pincodeVal,
                employmentType: empTypeVal,
                employment_type: empTypeVal,
                salary: Number(salaryVal),
                monthlySalary: Number(salaryVal),
                loanAmount: Number(loanAmtVal),
                loan_amount: Number(loanAmtVal),
                amount: Number(loanAmtVal),
                modeOfSalary: salaryModeVal,
                mode_of_salary: salaryModeVal,
                companyName: companyNameVal,
                company_name: companyNameVal,
                pan: panVal,
                haveCreditCard: creditCardVal,
                have_credit_card: creditCardVal,
                creditCardLimit: creditCardLimitVal ? Number(creditCardLimitVal) : null,
                credit_card_limit: creditCardLimitVal ? Number(creditCardLimitVal) : null,
                cibilScore: sessionStorage.getItem('pim_cibil') || '',
                cibil: sessionStorage.getItem('pim_cibil') || '',
                utm_source: finalUtmSource,
                lead_source: finalLeadSource,
                source: finalSource,
                status: "Fresh",
                token: jwtToken
            };

            try { sessionStorage.setItem('pim_phone', phoneVal); } catch(e){}
            try { localStorage.setItem('pim_phone', phoneVal); } catch(e){}
            try { sessionStorage.setItem('pim_name', nameVal); } catch(e){}
            try { sessionStorage.setItem('pim_salary', salaryVal); } catch(e){}
            try { sessionStorage.setItem('pim_pan', panVal); } catch(e){}

            // Save complete lead submission profile in localStorage for immediate CRM availability
            const fullLeadProfile = {
                name: nameVal,
                fullName: nameVal,
                applicantName: nameVal,
                phone: phoneVal,
                mobile: '+91 ' + phoneVal,
                email: emailVal,
                dob: dobVal,
                dateOfBirth: dobVal,
                gender: genderVal,
                addressType: addressTypeVal,
                pincode: pincodeVal,
                employmentType: empTypeVal,
                salary: Number(salaryVal),
                monthlySalary: Number(salaryVal),
                monthlyIncome: Number(salaryVal),
                loanAmount: Number(loanAmtVal),
                amount: Number(loanAmtVal),
                salaryMode: salaryModeVal,
                modeOfSalary: salaryModeVal,
                companyName: companyNameVal,
                pan: panVal,
                haveCreditCard: creditCardVal,
                creditCardLimit: creditCardLimitVal ? Number(creditCardLimitVal) : null,
                city: "Online",
                state: "India",
                cibilScore: sessionStorage.getItem('pim_cibil') || '',
                source: finalSource,
                leadSource: finalLeadSource,
                utmSource: finalUtmSource
            };
            try { localStorage.setItem('pim_lead_profile_' + phoneVal, JSON.stringify(fullLeadProfile)); } catch(e){}
            try { localStorage.setItem('pim_latest_lead_profile', JSON.stringify(fullLeadProfile)); } catch(e){}

            // Post canonical camelCase payload directly to Node.js backend POST /api/loan-applications
            const canonicalBackendPayload = {
                applicantName: nameVal,
                name: nameVal,
                phone: phoneVal,
                email: emailVal,
                amount: Number(loanAmtVal),
                tenureMonths: 12,
                purpose: "Personal Loan",
                monthlyIncome: Number(salaryVal),
                employmentType: empTypeVal,
                companyName: companyNameVal,
                salaryMode: salaryModeVal,
                city: "Online",
                state: "India",
                pincode: pincodeVal,
                dob: dobVal,
                gender: genderVal,
                pan: panVal,
                haveCreditCard: (creditCardVal === 'Yes' || creditCardVal === true),
                creditCardLimit: creditCardLimitVal ? Number(creditCardLimitVal) : null,
                addressType: addressTypeVal,
                leadSource: finalLeadSource,
                utmSource: finalUtmSource,
                source: finalSource
            };
            const cibilScoreVal = sessionStorage.getItem('pim_cibil');
            if (cibilScoreVal && !isNaN(Number(cibilScoreVal)) && Number(cibilScoreVal) >= 300) {
                canonicalBackendPayload.cibilScore = Number(cibilScoreVal);
            }

            fetch('https://api.paisainminutes.tech/api/loan-applications', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...(jwtToken ? { "Authorization": "Bearer " + jwtToken } : {})
                },
                body: JSON.stringify(canonicalBackendPayload),
                keepalive: true
            }).catch(() => {});

            let hasNavigated = false;
            let redirectUrl = '/loan-offers.php?phone=' + encodeURIComponent(phoneVal) + 
                              '&name=' + encodeURIComponent(nameVal) + 
                              '&salary=' + encodeURIComponent(salaryVal) + 
                              '&amount=' + encodeURIComponent(loanAmtVal) +
                              (finalUtmSource ? '&utm_source=' + encodeURIComponent(finalUtmSource) : '');

            const navigateNext = () => {
                if (hasNavigated) return;
                hasNavigated = true;
                window.location.href = redirectUrl;
            };

            // Post to backend endpoints asynchronously
            fetch('/submit-lead.php', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.data && data.data.redirect_url) {
                    redirectUrl = data.data.redirect_url;
                }
                navigateNext();
            })
            .catch(() => {
                navigateNext();
            });

            // Parallel background post to CRM & admin endpoints
            fetch('/admin/api/submit-lead.php', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(() => {});

            fetch('https://crm.paisainminutes.com/api/submit-lead.php', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                mode: 'cors',
                keepalive: true
            }).catch(() => {});

            // Safety timeout after 1.8 seconds max to guarantee navigation
            setTimeout(navigateNext, 1800);
        });
    }
});
</script>

<?php include 'includes/footer.php'; ?>
