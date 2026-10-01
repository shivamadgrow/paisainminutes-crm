<?php
/**
 * Paisa in Minutes - Check Loan Eligibility Page
 * Slug: /check-eligibility
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$page_title = "Check Instant Personal Loan Eligibility Online | Paisa in Minutes";
$page_description = "Check your instant personal loan eligibility up to ₹1 Lakh in less than 60 seconds with zero paperwork and 100% digital approval from RBI registered NBFC lenders.";
$page_keywords = "check loan eligibility, personal loan eligibility, instant loan eligibility check, online loan calculator, paisa in minutes eligibility";
$canonical_url = "https://paisainminutes.com/check-eligibility";

$prefill_name = isset($_GET['name']) ? htmlspecialchars(trim($_GET['name'])) : ($_SESSION['pim_lead_name'] ?? '');
if (strtolower($prefill_name) === 'applicant') $prefill_name = '';

$prefill_phone = isset($_GET['phone']) ? preg_replace('/[^0-9]/', '', trim($_GET['phone'])) : ($_SESSION['pim_lead_phone'] ?? '');
if (strlen($prefill_phone) > 10) $prefill_phone = substr($prefill_phone, -10);

$prefill_email = isset($_GET['email']) ? htmlspecialchars(trim($_GET['email'])) : ($_SESSION['pim_lead_email'] ?? '');
if (strpos($prefill_email, '@paisainminutes.com') !== false || $prefill_email === '—' || $prefill_email === '-' || !filter_var($prefill_email, FILTER_VALIDATE_EMAIL)) {
    $prefill_email = '';
}

$prefill_loan = isset($_GET['loan_amount']) ? htmlspecialchars(trim($_GET['loan_amount'])) : (isset($_GET['amount']) ? htmlspecialchars(trim($_GET['amount'])) : '');
$prefill_salary = isset($_GET['monthly_salary']) ? htmlspecialchars(trim($_GET['monthly_salary'])) : (isset($_GET['salary']) ? htmlspecialchars(trim($_GET['salary'])) : ($_SESSION['pim_lead_salary'] ?? ''));
if ($prefill_salary === '₹35,000' || $prefill_salary === '35000') $prefill_salary = '';

$prefill_cibil = isset($_GET['cibil_score']) ? htmlspecialchars(trim($_GET['cibil_score'])) : (isset($_GET['cibil']) ? htmlspecialchars(trim($_GET['cibil'])) : ($_SESSION['pim_lead_cibil'] ?? ''));
if ($prefill_cibil === '750+' || $prefill_cibil === '—') $prefill_cibil = '';

$prefill_pincode = isset($_GET['pincode']) ? htmlspecialchars(trim($_GET['pincode'])) : '';

include 'includes/header.php';
?>

<style>
.apply-hero-section {
    padding: 5.6rem 0 2rem 0;
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
.apply-card-wrapper {
    background: #ffffff;
    border-radius: 20px;
    padding: 1.85rem 1.65rem;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
    color: var(--text-dark);
    box-sizing: border-box;
    border: 1px solid #E2E8F0;
}

@media (max-width: 576px) {
    .apply-card-wrapper {
        padding: 1.45rem 1.15rem !important;
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

.form-status {
    display: none;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    margin-top: 1rem;
}
.form-status.error {
    display: block !important;
    background: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FCA5A5;
}
.form-status.success {
    display: block !important;
    background: #ECFDF5;
    color: #059669;
    border: 1px solid #A7F3D0;
}
</style>

<!-- ELIGIBILITY FORM SECTION -->
<section class="apply-hero-section" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); position: relative; overflow: hidden;">
    <div class="container" style="max-width: 620px; margin: 0 auto; padding: 0 1rem;">
        
        <!-- Header Info -->
        <div style="text-align: center; margin-bottom: 1.75rem; color: #ffffff;">
            <h1 style="font-size: 2rem; font-weight: 800; line-height: 1.3; margin-bottom: 0.5rem; color: #ffffff; letter-spacing: -0.02em;">
                Check Loan Eligibility in <span style="color: #FCD34D;">60 Seconds</span>
            </h1>
            <p style="font-size: 0.95rem; color: #94A3B8; margin: 0; line-height: 1.5;">
                Calculate instant pre-approved personal loan limit up to ₹1 Lakh
            </p>
        </div>

        <!-- Dedicated Form Card -->
        <div class="apply-card-wrapper" style="background: #ffffff; border-radius: 24px; padding: 2.25rem 2rem; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25); width: 100%; box-sizing: border-box; border: 1px solid #E2E8F0;">
            <form id="eligibilityCheckForm" action="/loan-offers" method="GET">
                <!-- 1. PERSONAL INFORMATION -->
                <h3 class="form-section-title">Personal Information</h3>

                <div class="form-field-group">
                    <label for="eligName" class="form-field-label">Name <span class="required-star">*</span></label>
                    <input type="text" id="eligName" name="name" class="form-text-input" placeholder="Enter name" value="<?php echo $prefill_name; ?>" required>
                </div>

                <div class="form-field-group">
                    <label for="eligPhone" class="form-field-label">Mobile <span class="required-star">*</span></label>
                    <input type="tel" id="eligPhone" name="phone" class="form-text-input" placeholder="Enter 10-digit mobile number" maxlength="10" pattern="[6-9][0-9]{9}" value="<?php echo $prefill_phone; ?>" required>
                    <div id="eligCibilBadge" style="display:none; margin-top: 6px; font-size: 0.82rem; border-radius: 6px; padding: 5px 10px; transition: all 0.3s ease;"></div>
                </div>

                <div class="form-field-group">
                    <label for="eligEmail" class="form-field-label">Email <span class="required-star">*</span></label>
                    <input type="email" id="eligEmail" name="email" class="form-text-input" placeholder="Enter email" value="<?php echo $prefill_email; ?>" required>
                </div>

                <div class="form-field-group">
                    <label for="eligDob" class="form-field-label">Dob <span class="required-star">*</span></label>
                    <input type="date" id="eligDob" name="dob" class="form-text-input" placeholder="dd-mm-yyyy" required>
                </div>

                <div class="form-field-group">
                    <label class="form-field-label">Gender <span class="required-star">*</span></label>
                    <input type="hidden" id="eligGender" name="gender" value="Male">
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
                    <input type="hidden" id="eligAddressType" name="address_type" value="Rented">
                    <div class="form-pill-grid form-pill-grid-2">
                        <button type="button" class="form-pill-btn active" data-pill-group="address_type" data-value="Rented">Rented</button>
                        <button type="button" class="form-pill-btn" data-pill-group="address_type" data-value="Owned">Owned</button>
                    </div>
                </div>

                <div class="form-field-group">
                    <label for="eligPincode" class="form-field-label">Pincode <span class="required-star">*</span></label>
                    <input type="text" id="eligPincode" name="pincode" class="form-text-input" placeholder="Enter 6-digit PIN code" maxlength="6" pattern="[0-9]{6}" value="<?php echo $prefill_pincode; ?>" required>
                </div>

                <!-- 3. EMPLOYMENT & INCOME -->
                <h3 class="form-section-title">Employment & Income</h3>

                <div class="form-field-group">
                    <label class="form-field-label">EmploymentType <span class="required-star">*</span></label>
                    <input type="hidden" id="eligEmploymentType" name="employment_type" value="Salaried">
                    <div class="form-pill-grid form-pill-grid-2">
                        <button type="button" class="form-pill-btn active" data-pill-group="employment_type" data-value="Salaried">Salaried</button>
                        <button type="button" class="form-pill-btn" data-pill-group="employment_type" data-value="Self Employed">Self Employed</button>
                    </div>
                </div>

                <div class="form-field-group">
                    <label for="eligSalary" class="form-field-label">Salary <span class="required-star">*</span></label>
                    <input type="number" id="eligSalary" name="salary" class="form-text-input" placeholder="Enter salary" min="5000" step="1000" value="<?php echo is_numeric($prefill_salary) ? $prefill_salary : ''; ?>" required>
                </div>

                <div class="form-field-group">
                    <label for="eligLoanAmount" class="form-field-label">Required Loan Amount <span class="required-star">*</span></label>
                    <input type="number" id="eligLoanAmount" name="loan_amount" class="form-text-input" placeholder="Enter required loan amount" min="5000" max="500000" step="1000" value="<?php echo is_numeric($prefill_loan) ? $prefill_loan : ''; ?>" required>
                </div>

                <div class="form-field-group">
                    <label class="form-field-label">Mode Of Salary</label>
                    <input type="hidden" id="eligSalaryMode" name="mode_of_salary" value="Bank Transfer">
                    <div class="form-pill-grid form-pill-grid-3">
                        <button type="button" class="form-pill-btn" data-pill-group="mode_of_salary" data-value="Cash">Cash</button>
                        <button type="button" class="form-pill-btn" data-pill-group="mode_of_salary" data-value="UPI">UPI</button>
                        <button type="button" class="form-pill-btn active" data-pill-group="mode_of_salary" data-value="Bank Transfer">Bank Transfer</button>
                    </div>
                </div>

                <div class="form-field-group">
                    <label for="eligCompanyName" class="form-field-label">Company Name</label>
                    <input type="text" id="eligCompanyName" name="company_name" class="form-text-input" placeholder="Enter company name">
                </div>

                <!-- 4. IDENTITY VERIFICATION -->
                <h3 class="form-section-title">Identity Verification</h3>

                <div class="form-field-group">
                    <label for="eligPan" class="form-field-label">Pan <span class="required-star">*</span></label>
                    <input type="text" id="eligPan" name="pan" class="form-text-input" placeholder="Enter PAN (e.g., ABCDE1234F)" maxlength="10" style="text-transform: uppercase;" pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}" required>
                </div>

                <div class="form-field-group">
                    <label class="form-field-label">Have a credit card? <span class="required-star">*</span></label>
                    <input type="hidden" id="eligCreditCard" name="have_credit_card" value="No">
                    <div class="form-pill-grid form-pill-grid-2">
                        <button type="button" class="form-pill-btn" data-pill-group="have_credit_card" data-value="Yes">Yes</button>
                        <button type="button" class="form-pill-btn active" data-pill-group="have_credit_card" data-value="No">No</button>
                    </div>
                </div>

                <div class="form-field-group" id="eligCreditCardLimitGroup" style="display: none;">
                    <label for="eligCreditCardLimit" class="form-field-label">Credit Card Limit</label>
                    <input type="number" id="eligCreditCardLimit" name="credit_card_limit" class="form-text-input" placeholder="Enter credit card limit" min="0" step="1000">
                </div>

                <!-- 5. AGREEMENTS & SUBMIT -->
                <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #F1F5F9;">
                    <!-- Green Shield Safety Note -->
                    <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.78rem; color: #166534; line-height: 1.45; margin-bottom: 0.75rem;">
                        <svg viewBox="0 0 20 20" fill="#16A34A" style="width: 16px; height: 16px; flex-shrink: 0;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                        <span>Your data is safe with us and governed by <a href="/privacy-policy" target="_blank" style="color: #15803D; font-weight: 700; text-decoration: underline;">Paisa in Minutes's Privacy Policy</a>.</span>
                    </div>

                    <label class="form-terms-checkbox">
                        <input type="checkbox" id="eligAgreeTerms1" name="agree_terms" required>
                        <span>I agree to the <a href="/terms-and-conditions" target="_blank">Terms of Service</a> of Paisa in Minutes.</span>
                    </label>

                    <label class="form-terms-checkbox">
                        <input type="checkbox" id="eligAgreeTerms2" name="agree_partner_terms" required>
                        <span>I agree to the <a href="/partner-terms" target="_blank">Terms &amp; Conditions</a> of the partners of Paisa in Minutes.</span>
                    </label>
                </div>

                <button type="submit" id="btnCheckOffers" class="form-submit-btn">Submit</button>

                <!-- Status Message -->
                <div class="form-status" id="eligFormStatus" style="margin-top: 1rem;"></div>
            </form>
        </div>

        <!-- Trust Badges below Card -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.25rem; margin-top: 1.5rem; color: #94A3B8; font-size: 0.85rem; font-weight: 500;">
            <span style="display: flex; align-items: center; gap: 0.4rem;"><svg viewBox="0 0 20 20" fill="#10B981" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> 100% Digital & Paperless</span>
            <span style="display: flex; align-items: center; gap: 0.4rem;"><svg viewBox="0 0 20 20" fill="#10B981" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> 2 Min Approval</span>
            <span style="display: flex; align-items: center; gap: 0.4rem;"><svg viewBox="0 0 20 20" fill="#10B981" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg> Bank Level Security</span>
        </div>
    </div>
</section>

<!-- ELIGIBILITY CRITERIA SECTION -->
<section style="padding: 5rem 0; background: #F8FAFC;">
    <div class="container">
        <div class="section-heading-center" style="text-align: center; margin-bottom: 3.5rem;">
            <h2 style="font-size: 2.2rem; font-weight: 800; color: #0F172A;">Basic Eligibility Criteria</h2>
            <p style="color: #64748B; font-size: 1.05rem;">Simple requirements to qualify for instant personal loan up to ₹1 Lakh</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
            <div style="background: #ffffff; padding: 2rem; border-radius: 18px; border: 1px solid #E2E8F0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="width: 56px; height: 56px; background: #EFF6FF; color: #2563EB; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
                    <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;">Age Qualification</h3>
                <p style="color: #64748B; font-size: 0.92rem; margin: 0;">21 to 60 years old Indian citizen</p>
            </div>

            <div style="background: #ffffff; padding: 2rem; border-radius: 18px; border: 1px solid #E2E8F0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="width: 56px; height: 56px; background: #ECFDF5; color: #10B981; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
                    <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/></svg>
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;">Minimum Monthly Income</h3>
                <p style="color: #64748B; font-size: 0.92rem; margin: 0;">₹20,000 / month (Salaried or Self-Employed)</p>
            </div>

            <div style="background: #ffffff; padding: 2rem; border-radius: 18px; border: 1px solid #E2E8F0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="width: 56px; height: 56px; background: #FEF3C7; color: #D97706; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
                    <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;">Minimal Documentation</h3>
                <p style="color: #64748B; font-size: 0.92rem; margin: 0;">PAN Card, Aadhaar & Bank Statement</p>
            </div>

            <div style="background: #ffffff; padding: 2rem; border-radius: 18px; border: 1px solid #E2E8F0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="width: 56px; height: 56px; background: #F3E8FF; color: #9333EA; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
                    <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd"/></svg>
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;">Active Bank Account</h3>
                <p style="color: #64748B; font-size: 0.92rem; margin: 0;">Valid Savings Bank Account with NetBanking</p>
            </div>
        </div>
    </div>
</section>

<!-- HIGH-TRUST FINTECH ELIGIBILITY PROCESSING MODAL -->
<div id="eligProcessingModal" style="display: none; position: fixed; inset: 0; z-index: 999999; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); align-items: center; justify-content: center; padding: 1.25rem;">
    <div style="background: #ffffff; width: 100%; max-width: 480px; border-radius: 24px; padding: 2.5rem 2rem; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5); text-align: center; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
        
        <!-- Top Glow Accent -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #2563EB, #10B981, #F59E0B, #2563EB); background-size: 200% 100%; animation: pimGradientShift 2s linear infinite;"></div>

        <!-- Radar Pulse Loader Icon -->
        <div style="position: relative; width: 80px; height: 80px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #EFF6FF; animation: pimPulse 1.8s ease-out infinite;"></div>
            <div style="position: absolute; width: 64px; height: 64px; border-radius: 50%; background: #DBEAFE;"></div>
            <svg style="position: relative; width: 34px; height: 34px; color: #2563EB; animation: pimSpin 2s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
        </div>

        <h3 style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin: 0 0 0.5rem 0; letter-spacing: -0.02em;">Calculating Loan Eligibility</h3>
        <p style="font-size: 0.9rem; color: #64748B; margin: 0 0 1.75rem 0;">Scanning top RBI registered lenders for your profile</p>

        <!-- Progress Bar & Percentage -->
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.5rem;">
                <span id="pimStepStatusText">Analyzing Income & CIBIL Profile...</span>
                <span id="pimProgressPercent" style="color: #2563EB; font-size: 0.95rem;">25%</span>
            </div>
            <div style="width: 100%; height: 10px; background: #F1F5F9; border-radius: 50px; overflow: hidden; border: 1px solid #E2E8F0;">
                <div id="pimProgressBar" style="width: 25%; height: 100%; background: linear-gradient(90deg, #2563EB, #10B981); border-radius: 50px; transition: width 0.4s ease;"></div>
            </div>
        </div>

        <!-- 3 Live Checkpoints -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 1rem 1.25rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.85rem;">
            <div id="pimCheckStep1" style="display: flex; align-items: center; gap: 0.6rem; color: #0F172A; font-weight: 600; margin-bottom: 0.6rem;">
                <span id="pimCheckIcon1" style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #ECFDF5; color: #10B981; font-size: 0.75rem; font-weight: bold;">✓</span>
                <span id="pimCheckText1">Income & CIBIL Profile Analyzed</span>
            </div>
            <div id="pimCheckStep2" style="display: flex; align-items: center; gap: 0.6rem; color: #94A3B8; font-weight: 500; margin-bottom: 0.6rem; transition: all 0.3s ease;">
                <span id="pimCheckIcon2" style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #F1F5F9; color: #94A3B8; font-size: 0.75rem;">⏳</span>
                <span id="pimCheckText2">Scanning NBFC Lending Criteria...</span>
            </div>
            <div id="pimCheckStep3" style="display: flex; align-items: center; gap: 0.6rem; color: #94A3B8; font-weight: 500; transition: all 0.3s ease;">
                <span id="pimCheckIcon3" style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #F1F5F9; color: #94A3B8; font-size: 0.75rem;">⏳</span>
                <span id="pimCheckText3">Matching Pre-Approved Limits...</span>
            </div>
        </div>

        <!-- Warning Disclaimer -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.78rem; color: #94A3B8; font-weight: 500;">
            <svg style="width: 14px; height: 14px; color: #F59E0B;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            <span>Please do not refresh or press back button.</span>
        </div>

        <!-- Fallback Manual Button (shown if delayed) -->
        <div id="pimFallbackRedirectBtn" style="display: none; margin-top: 1.25rem;">
            <a id="pimManualRedirectLink" href="/loan-offers" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #ffffff; padding: 0.8rem 1.25rem; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                <span>View Pre-Approved Offers</span>
                <span>→</span>
            </a>
        </div>
    </div>
</div>

<style>
@keyframes pimPulse {
    0% { transform: scale(0.9); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 0; }
    100% { transform: scale(1.3); opacity: 0; }
}
@keyframes pimSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes pimGradientShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}
</style>

<!-- FORM SUBMISSION & AUTO REDIRECTION SCRIPT -->
<script>
document.addEventListener('DOMContentLoaded', () => {
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
                const limitGroup = document.getElementById('eligCreditCardLimitGroup');
                if (limitGroup) {
                    limitGroup.style.display = (val === 'Yes') ? 'block' : 'none';
                    if (val !== 'Yes') {
                        const limitInput = document.getElementById('eligCreditCardLimit');
                        if (limitInput) limitInput.value = '';
                    }
                }
            }
        });
    });

    // 2. Input Masks & Sanitizers
    const panInput = document.getElementById('eligPan');
    if (panInput) {
        panInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        });
    }

    const phoneInput = document.getElementById('eligPhone');
    const cibilBadge = document.getElementById('eligCibilBadge');
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


    const pincodeInput = document.getElementById('eligPincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    const nameInput = document.getElementById('eligName');
    const emailInput = document.getElementById('eligEmail');
    const dobInput = document.getElementById('eligDob');
    const salaryInput = document.getElementById('eligSalary');
    const loanInput = document.getElementById('eligLoanAmount');
    const companyInput = document.getElementById('eligCompanyName');

    // 3. Auto-fill from URL query parameters or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    let passedName = (urlParams.get('name') || urlParams.get('fullName') || '').trim();
    if (passedName.toLowerCase() === 'applicant') passedName = '';

    let passedPhone = (urlParams.get('phone') || urlParams.get('mobile') || '').replace(/\D/g, '');
    if (!passedPhone) {
        try { passedPhone = (sessionStorage.getItem('pim_phone') || sessionStorage.getItem('pim_lead_phone') || '').replace(/\D/g, ''); } catch(e){}
    }
    let passedEmail = (urlParams.get('email') || '').trim();
    if (passedEmail.includes('@paisainminutes.com')) passedEmail = '';

    const passedLoan = (urlParams.get('loan_amount') || urlParams.get('amount') || '').trim();
    const passedSalary = (urlParams.get('monthly_salary') || urlParams.get('salary') || '').trim();
    const passedPincode = (urlParams.get('pincode') || '').trim();

    if (nameInput && passedName && passedName.toLowerCase() !== 'applicant') {
        nameInput.value = passedName;
    }
    if (phoneInput && passedPhone && passedPhone.length === 10) {
        phoneInput.value = passedPhone;
    }
    if (emailInput && passedEmail && !passedEmail.includes('@paisainminutes.com') && passedEmail.includes('@')) {
        emailInput.value = passedEmail;
    }
    if (pincodeInput && passedPincode) {
        pincodeInput.value = passedPincode.replace(/\D/g, '').slice(0, 6);
    }
    if (salaryInput && passedSalary && !isNaN(passedSalary)) {
        salaryInput.value = passedSalary;
    }
    if (loanInput && passedLoan && !isNaN(passedLoan)) {
        loanInput.value = passedLoan;
    }

    const eligForm = document.getElementById('eligibilityCheckForm');
    const eligStatus = document.getElementById('eligFormStatus');
    const modal = document.getElementById('eligProcessingModal');
    const progressBar = document.getElementById('pimProgressBar');
    const progressPercent = document.getElementById('pimProgressPercent');
    const statusText = document.getElementById('pimStepStatusText');
    const checkStep2 = document.getElementById('pimCheckStep2');
    const checkIcon2 = document.getElementById('pimCheckIcon2');
    const checkStep3 = document.getElementById('pimCheckStep3');
    const checkIcon3 = document.getElementById('pimCheckIcon3');
    const fallbackBtn = document.getElementById('pimFallbackRedirectBtn');
    const manualLink = document.getElementById('pimManualRedirectLink');
    const submitBtn = document.getElementById('btnCheckOffers');

    function showError(msg, targetEl) {
        if (eligStatus) {
            eligStatus.className = 'form-status error';
            eligStatus.style.display = 'block';
            eligStatus.textContent = msg;
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
        if (targetEl) {
            targetEl.focus();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function processSubmission() {
        if (eligStatus) {
            eligStatus.style.display = 'none';
            eligStatus.className = 'form-status';
            eligStatus.textContent = '';
        }

        const nameVal = (nameInput?.value || '').trim();
        const phoneVal = (phoneInput?.value || '').replace(/\D/g, '');
        const emailVal = (emailInput?.value || '').trim();
        const dobVal = (dobInput?.value || '').trim();
        const genderVal = document.getElementById('eligGender')?.value || 'Male';
        const addressTypeVal = document.getElementById('eligAddressType')?.value || 'Current';
        const pincodeVal = (pincodeInput?.value || '').trim();
        const empTypeVal = document.getElementById('eligEmploymentType')?.value || 'Salaried';
        const salaryVal = (salaryInput?.value || '').trim();
        const loanAmountVal = (loanInput?.value || '').trim();
        const salaryModeVal = document.getElementById('eligSalaryMode')?.value || 'Bank Transfer';
        const companyNameVal = (companyInput?.value || '').trim();
        const panVal = (panInput?.value || '').trim().toUpperCase();
        const creditCardVal = document.getElementById('eligCreditCard')?.value || 'No';
        const creditCardLimitVal = (document.getElementById('eligCreditCardLimit')?.value || '').trim();

        // Validations
        if (!nameVal || nameVal.toLowerCase() === 'applicant') {
            showError('Please enter your Full Name.', nameInput);
            return;
        }

        if (phoneVal.length !== 10 || !/^[6-9]/.test(phoneVal)) {
            showError('Please enter a valid 10-digit mobile number starting with 6-9.', phoneInput);
            return;
        }

        if (!emailVal || !emailVal.includes('@') || emailVal.includes('@paisainminutes.com')) {
            showError('Please enter a valid personal Email Address.', emailInput);
            return;
        }

        if (!dobVal) {
            showError('Please select your Date of Birth.', dobInput);
            return;
        }

        if (pincodeVal.length !== 6 || !/^[0-9]{6}$/.test(pincodeVal)) {
            showError('Please enter a valid 6-digit Pincode.', pincodeInput);
            return;
        }

        if (!salaryVal || Number(salaryVal) < 5000) {
            showError('Please enter a valid Monthly Salary (min ₹5,000).', salaryInput);
            return;
        }

        if (!loanAmountVal || Number(loanAmountVal) < 5000) {
            showError('Please enter Required Loan Amount (min ₹5,000).', loanInput);
            return;
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panVal)) {
            showError('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).', panInput);
            return;
        }

        const agree1 = document.getElementById('eligAgreeTerms1');
        const agree2 = document.getElementById('eligAgreeTerms2');
        if ((agree1 && !agree1.checked) || (agree2 && !agree2.checked)) {
            showError('Please agree to the Terms of Service and Partner Terms & Conditions.', agree1);
            return;
        }

        const numSalary = parseInt(salaryVal.replace(/\D/g, '')) || 35000;
        const numAmount = parseInt(loanAmountVal.replace(/\D/g, '')) || 50000;
        // Customer has not clicked/chosen an offer partner yet: mark as Pending Selection
        let assignedCompany = 'Pending Selection';

        // Store in Session & Local Storage
        try {
            sessionStorage.setItem('pim_phone', phoneVal);
            sessionStorage.setItem('pim_lead_phone', phoneVal);
            sessionStorage.setItem('pim_lead_name', nameVal);
            sessionStorage.setItem('pim_lead_email', emailVal);
            sessionStorage.setItem('pim_lead_salary', salaryVal);
            sessionStorage.setItem('pim_lead_amount', loanAmountVal);
            sessionStorage.setItem('pim_lead_pan', panVal);
            sessionStorage.setItem('pim_assigned_company', assignedCompany);
            localStorage.setItem('pim_phone', phoneVal);
            localStorage.setItem('pim_lead_phone', phoneVal);
            localStorage.setItem('pim_lead_salary', salaryVal);
        } catch(e){}

        const fallbackRedirectUrl = '/loan-offers?phone=' + encodeURIComponent(phoneVal) +
                                    '&salary=' + encodeURIComponent(salaryVal) +
                                    '&loan_amount=' + encodeURIComponent(loanAmountVal) +
                                    '&name=' + encodeURIComponent(nameVal) +
                                    '&company=' + encodeURIComponent(assignedCompany);
        let finalRedirectUrl = fallbackRedirectUrl;
        let hasRedirected = false;

        if (manualLink) {
            manualLink.href = fallbackRedirectUrl;
        }

        const jwtToken = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token') || '';

        // Complete Lead Payload
        // 1. Detect UTM Source (Priority: URL query > sessionStorage > localStorage)
        const urlParams = new URLSearchParams(window.location.search);
        const activeUtm = (urlParams.get('utm_source') || 
                           sessionStorage.getItem('pim_utm_source') || 
                           localStorage.getItem('pim_utm_source') || '').trim();

        // 2. Separate WhatsApp vs Direct Website Source
        const hasUtm = Boolean(activeUtm && activeUtm !== '' && activeUtm !== 'undefined' && activeUtm !== 'null');
        const finalUtmSource = hasUtm ? activeUtm : null;
        const isWhatsApp = hasUtm && activeUtm.toLowerCase().includes('whatsapp');
        const finalSource = hasUtm ? activeUtm : "Check Eligibility Website";
        const finalLeadSource = hasUtm ? (isWhatsApp ? 'WhatsApp' : 'Campaign') : 'Direct Website';

        const leadPayload = {
            name: nameVal,
            fullName: nameVal,
            phone: phoneVal,
            mobile: phoneVal,
            phoneNumber: phoneVal,
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
            salary: numSalary,
            monthlySalary: numSalary,
            monthly_salary: salaryVal,
            loanAmount: numAmount,
            loan_amount: numAmount,
            applied: numAmount,
            amount: numAmount,
            modeOfSalary: salaryModeVal,
            mode_of_salary: salaryModeVal,
            companyName: companyNameVal,
            company_name: companyNameVal,
            pan: panVal,
            haveCreditCard: creditCardVal,
            have_credit_card: creditCardVal,
            creditCardLimit: creditCardLimitVal ? Number(creditCardLimitVal) : null,
            credit_card_limit: creditCardLimitVal ? Number(creditCardLimitVal) : null,
            assignedCompany: assignedCompany,
            company: assignedCompany,
            partner_name: assignedCompany,
            cibilScore: sessionStorage.getItem('pim_cibil') || '',
            cibil: sessionStorage.getItem('pim_cibil') || '',
            utm_source: finalUtmSource,
            lead_source: finalLeadSource,
            source: finalSource,
            status: "Fresh",
            token: jwtToken
        };

        // Submit to backends
        const submitToCrm = () => {
            // 1. Root submit-lead.php
            fetch('/submit-lead.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadPayload),
                keepalive: true
            }).then(r => r.json()).then(data => {
                if (data && (data.redirect_url || (data.data && data.data.redirect_url))) {
                    finalRedirectUrl = data.redirect_url || data.data.redirect_url;
                    if (manualLink) manualLink.href = finalRedirectUrl;
                }
            }).catch(() => {});

            // 2. Admin submit-lead.php
            fetch('/admin/api/submit-lead.php', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(leadPayload),
                keepalive: true
            })
            .then(r => r.json())
            .then(data => {
                if (data && (data.redirect_url || (data.data && data.data.redirect_url))) {
                    finalRedirectUrl = data.redirect_url || data.data.redirect_url;
                    if (manualLink) manualLink.href = finalRedirectUrl;
                }
            })
            .catch(() => {});

            // 3. Subdomain direct sync if accessible
            fetch('https://crm.paisainminutes.com/api/submit-lead.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadPayload),
                mode: 'cors',
                keepalive: true
            }).catch(() => {});
        };

        submitToCrm();

        // Guaranteed Redirection Function
        function proceedToOffers() {
            if (hasRedirected) return;
            hasRedirected = true;
            const dest = finalRedirectUrl || fallbackRedirectUrl || '/loan-offers';
            window.location.href = dest;
        }

        function runStepAnimationsAndProceed() {
            if (modal) {
                modal.style.display = 'flex';
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing Offers...';
            }

            setTimeout(() => {
                if (progressBar) progressBar.style.width = '60%';
                if (progressPercent) progressPercent.textContent = '60%';
                if (statusText) statusText.textContent = 'Scanning NBFC Lending Criteria...';
                if (checkStep2) {
                    checkStep2.style.color = '#0F172A';
                    checkStep2.style.fontWeight = '600';
                }
                if (checkIcon2) {
                    checkIcon2.style.background = '#ECFDF5';
                    checkIcon2.style.color = '#10B981';
                    checkIcon2.textContent = '✓';
                }
            }, 400);

            setTimeout(() => {
                if (progressBar) progressBar.style.width = '90%';
                if (progressPercent) progressPercent.textContent = '90%';
                if (statusText) statusText.textContent = 'Matching Pre-Approved Offers...';
                if (checkStep3) {
                    checkStep3.style.color = '#0F172A';
                    checkStep3.style.fontWeight = '600';
                }
                if (checkIcon3) {
                    checkIcon3.style.background = '#ECFDF5';
                    checkIcon3.style.color = '#10B981';
                    checkIcon3.textContent = '✓';
                }
            }, 900);

            setTimeout(() => {
                if (progressBar) progressBar.style.width = '100%';
                if (progressPercent) progressPercent.textContent = '100%';
                if (statusText) statusText.textContent = 'Offers Ready! Redirecting...';
            }, 1400);

            setTimeout(() => {
                proceedToOffers();
            }, 1700);

            setTimeout(() => {
                if (fallbackBtn) fallbackBtn.style.display = 'block';
                proceedToOffers();
            }, 2500);
        }

        runStepAnimationsAndProceed();
    }

    if (eligForm) {
        eligForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processSubmission();
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            processSubmission();
        });
    }
});
</script>

<?php include 'includes/footer.php'; ?>
