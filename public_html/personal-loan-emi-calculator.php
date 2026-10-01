<?php include 'includes/header.php'; ?>

<!-- Custom Styles for Calculator Page -->
<style>
.sec-hero {
    background: var(--gradient-primary);
    padding: 8rem 0 4.5rem 0;
    position: relative;
    overflow: hidden;
    color: var(--white);
    text-align: center;
}
.sec-hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
}
.sec-hero-badge {
    display: inline-block;
    padding: 0.4rem 1.2rem;
    background: rgba(74, 141, 255, 0.18);
    color: #60A5FA;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(74, 141, 255, 0.3);
}
.sec-hero-title {
    font-size: 3rem;
    color: #FFFFFF !important;
    margin: 0.5rem 0 1.25rem 0;
    font-weight: 800;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.sec-hero-desc {
    font-size: 1.15rem;
    color: #E2E8F0 !important;
    margin-bottom: 0;
    line-height: 1.7;
}

.calc-section {
    padding: 3rem 0 6rem 0;
    background: #F8FAFC;
}
.calc-card {
    background: var(--white);
    border-radius: 24px;
    box-shadow: 0 20px 40px -15px rgba(27, 42, 107, 0.08);
    border: 1px solid #E2E8F0;
    padding: 3.5rem;
    margin-top: 0;
    position: relative;
    z-index: 10;
}

.calc-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 3.5rem;
    align-items: center;
}

@media (max-width: 991px) {
    .calc-card {
        padding: 2rem;
    }
    .calc-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }
}

.calc-inputs-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
}

.calc-input-block {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 0 0.25rem;
}

.input-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    min-height: 42px;
}

.input-label {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1E3A8A;
    line-height: 1.2;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
}

.input-display-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #F8FAFC;
    border: 1.5px solid #CBD5E1;
    border-radius: 10px;
    padding: 0.35rem 0.85rem;
    gap: 0.35rem;
    height: 40px;
    box-sizing: border-box;
    transition: all 0.2s ease;
}

.input-display-box:focus-within {
    background: #FFFFFF;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.input-prefix,
.input-suffix {
    color: #2563EB;
    font-weight: 700;
    font-size: 1.05rem;
    white-space: nowrap;
    user-select: none;
}

.input-display {
    border: none;
    background: transparent;
    font-weight: 700;
    color: #0F172A;
    font-size: 1.15rem;
    outline: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

#plAmtBox {
    width: 85px;
    text-align: left;
}
#plRateBox {
    width: 55px;
    text-align: right;
}
#plTimeBox {
    width: 35px;
    text-align: right;
}

/* Remove number spinners */
.input-display::-webkit-outer-spin-button,
.input-display::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.input-display[type=number] {
    -moz-appearance: textfield;
}

.slider-input {
    width: 100%;
    height: 8px;
    background: #E2E8F0;
    border-radius: 4px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    margin-top: 0.25rem;
    margin-bottom: 0;
}

.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #2563EB;
    border: 3px solid #FFFFFF;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
    cursor: pointer;
    transition: transform 0.15s ease;
}

.slider-input::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    background: #1D4ED8;
}

.slider-input::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #2563EB;
    border: 3px solid #FFFFFF;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
    cursor: pointer;
}

.calc-highlights-card {
    background: #F8FAFC;
    border: 1.5px dashed #CBD5E1;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.highlight-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

@media (max-width: 576px) {
    .highlight-row {
        flex-direction: column;
        gap: 0.75rem;
    }
}

.highlight-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.highlight-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #EFF6FF;
    color: #2563EB;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.highlight-icon svg {
    width: 18px;
    height: 18px;
}

.highlight-item strong {
    font-size: 0.88rem;
    color: #1E3A8A;
    display: block;
    line-height: 1.2;
}

.highlight-item p {
    font-size: 0.78rem;
    color: #64748B;
    margin: 0;
}

.btn-calc-apply {
    background: #2563EB;
    color: #FFFFFF;
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 6px 15px -3px rgba(37, 99, 235, 0.3);
    margin-top: 0.25rem;
}

.btn-calc-apply:hover {
    background: #1D4ED8;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -3px rgba(37, 99, 235, 0.4);
}

.results-panel {
    background: #F8FAFC;
    border-radius: 20px;
    padding: 2.25rem;
    border: 1.5px solid #E2E8F0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.results-title {
    font-size: 1.35rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #1E3A8A;
    font-family: var(--font-heading);
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.9rem 0;
    border-bottom: 1px dashed #CBD5E1;
}

.result-item:last-of-type {
    border-bottom: none;
}

.result-lbl {
    color: #64748B;
    font-weight: 600;
    font-size: 0.95rem;
}

.result-val {
    font-weight: 800;
    color: #0F172A;
    font-size: 1.2rem;
}

.result-emi-box {
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    margin-top: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-emi-lbl {
    color: #1E3A8A;
    font-weight: 700;
    font-size: 1.05rem;
}

.result-emi-val {
    font-size: 1.75rem;
    font-weight: 800;
    color: #2563EB;
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    position: relative;
}

.donut-svg {
    transform: rotate(-90deg);
}

.cta-banner {
    background: var(--gradient-accent);
    color: var(--white);
    padding: 5rem 0;
    text-align: center;
    margin-top: 4rem;
}
.cta-banner h2 {
    color: var(--white);
    font-size: 2.25rem;
    margin-bottom: 1rem;
}
</style>

<!-- HERO SECTION -->
<section class="sec-hero">
    <div class="container">
        <div class="sec-hero-content">
            <span class="sec-hero-badge">Financial Tool</span>
            <h1 class="sec-hero-title">Personal Loan EMI Calculator</h1>
            <p class="sec-hero-desc">Calculate your monthly loan payments. Estimate your unsecured Personal Loan EMI, interest payables, and final payoff schedules instantly.</p>
        </div>
    </div>
</section>

<!-- CALCULATOR SECTION -->
<section class="calc-section">
    <div class="container">
        <div class="calc-card">
            <div class="calc-grid">
                <!-- Inputs -->
                <div class="calc-inputs-col">
                    <!-- Loan Amount -->
                    <div class="calc-input-block">
                        <div class="input-group-header">
                            <label class="input-label" for="plAmt">Loan Amount</label>
                            <div class="input-display-box">
                                <span class="input-prefix">₹</span>
                                <input type="number" id="plAmtBox" class="input-display" value="200000" min="10000" max="2500000" step="5000">
                            </div>
                        </div>
                        <input type="range" id="plAmt" class="slider-input" min="10000" max="2500000" step="5000" value="200000">
                    </div>

                    <!-- Interest Rate -->
                    <div class="calc-input-block">
                        <div class="input-group-header">
                            <label class="input-label" for="plRate">Interest Rate (p.a.)</label>
                            <div class="input-display-box">
                                <input type="number" id="plRateBox" class="input-display" value="10.99" min="8" max="36" step="0.1">
                                <span class="input-suffix">%</span>
                            </div>
                        </div>
                        <input type="range" id="plRate" class="slider-input" min="8" max="36" step="0.1" value="10.99">
                    </div>

                    <!-- Tenure -->
                    <div class="calc-input-block">
                        <div class="input-group-header">
                            <label class="input-label" for="plTime">Tenure (Duration)</label>
                            <div class="input-display-box">
                                <input type="number" id="plTimeBox" class="input-display" value="36" min="6" max="60">
                                <span class="input-suffix">Mths</span>
                            </div>
                        </div>
                        <input type="range" id="plTime" class="slider-input" min="6" max="60" step="1" value="36">
                    </div>

                    <!-- Quick Highlights Card -->
                    <div class="calc-highlights-card">
                        <div class="highlight-row">
                            <div class="highlight-item">
                                <div class="highlight-icon">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                </div>
                                <div>
                                    <strong>Instant Lead Approval</strong>
                                    <p>Decision within 2 minutes</p>
                                </div>
                            </div>
                            <div class="highlight-item">
                                <div class="highlight-icon">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                </div>
                                <div>
                                    <strong>100% RBI Partnered</strong>
                                    <p>256-Bit SSL Encrypted</p>
                                </div>
                            </div>
                        </div>
                        <button class="btn-calc-apply open-apply-modal">Apply for Personal Loan Now →</button>
                    </div>
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 class="results-title">EMI Summary</h3>
                        <div class="result-item">
                            <span class="result-lbl">Principal Amount</span>
                            <span class="result-val" id="resInvested">₹2,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total Interest</span>
                            <span class="result-val" id="resInterest">₹39,088</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total Amount</span>
                            <span class="result-val" id="resTotal">₹2,39,088</span>
                        </div>
                        <div class="result-emi-box">
                            <span class="result-emi-lbl">Monthly EMI</span>
                            <span class="result-emi-val" id="resEMI">₹6,641</span>
                        </div>
                    </div>

                    <div class="chart-container">
                        <svg width="160" height="160" class="donut-svg">
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#E2E8F0" stroke-width="16"></circle>
                            <circle id="donutSegment" cx="80" cy="80" r="60" fill="transparent" stroke="#2563EB" stroke-width="16" stroke-dasharray="376.99" stroke-dashoffset="100"></circle>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ SECTION -->
<section class="section section-bg" id="faqs">
    <div class="container">
        <div class="section-title-wrapper text-center">
            <span class="section-tag">FAQs</span>
            <h2 class="section-title"><?php echo htmlspecialchars($human_name); ?> FAQs</h2>
        </div>
        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is a Personal Loan EMI?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        EMI stands for Equated Monthly Installment. It is a fixed monthly payment made by a borrower to a lender on a scheduled date. It comprises both principal and interest repayments.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How does tenure affect Personal Loan EMIs?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Longer tenures reduce your monthly EMI amount, making repayment more budget-friendly. However, longer tenures increase the overall interest payout significantly over the lifetime of the loan.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- RELATED LOANS & AMOUNT TIERS (Contextual Internal Linking) -->
<section class="section" style="background: #FFFFFF; padding: 4rem 0; border-top: 1px solid #E2E8F0;">
    <div class="container">
        <div class="section-title-wrapper text-center">
            <span class="section-tag">Calculate by Amount</span>
            <h2 class="section-title">Explore Personal Loans by Borrowing Need</h2>
            <p class="section-subtitle">Check eligibility, documents, and 2-hour digital disbursal across our most popular loan tiers.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 2rem;">
            <a href="/personal-loan" style="display: block; background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1E40AF; font-size: 1.1rem; margin-bottom: 0.35rem;">Personal Loan Online</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Complete overview of personal loans up to ₹50 Lakh @10.49% p.a.</p>
            </a>
            <a href="/5-lakh-personal-loan" style="display: block; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹5 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Monthly EMI from ₹10,744/mo for 5 yrs with paperless KYC.</p>
            </a>
            <a href="/10-lakh-personal-loan" style="display: block; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹10 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Monthly EMI from ₹21,488/mo for debt consolidation &amp; emergencies.</p>
            </a>
            <a href="/20-lakh-personal-loan" style="display: block; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹20 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Monthly EMI from ₹42,976/mo with flexible tenure up to 60 months.</p>
            </a>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Need an Instant Personal Loan?</h2>
        <p>Get pre-approved loans up to ₹50 Lakhs with interest rates starting from 10.49% p.a. online in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Online</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const plAmt = document.getElementById('plAmt');
    const plAmtBox = document.getElementById('plAmtBox');
    const plRate = document.getElementById('plRate');
    const plRateBox = document.getElementById('plRateBox');
    const plTime = document.getElementById('plTime');
    const plTimeBox = document.getElementById('plTimeBox');

    const resInvested = document.getElementById('resInvested');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const resEMI = document.getElementById('resEMI');
    const donutSegment = document.getElementById('donutSegment');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(plAmt.value);
        const R = parseFloat(plRate.value) / 12 / 100; // Monthly interest
        const N = parseInt(plTime.value); // Months

        // EMI = [P x R x (1+R)^N]/[(1+R)^N - 1]
        const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        const totalAmt = emi * N;
        const interest = totalAmt - P;

        resInvested.textContent = formatCurrency(P);
        resInterest.textContent = formatCurrency(interest);
        resTotal.textContent = formatCurrency(totalAmt);
        resEMI.textContent = formatCurrency(emi);

        // Chart Update
        const circ = 2 * Math.PI * 60; // 376.99
        const pct = interest / totalAmt;
        donutSegment.style.strokeDashoffset = circ * (1 - pct);
    }

    // Sync input box and slider
    function sync(slider, box) {
        slider.addEventListener('input', () => {
            box.value = slider.value;
            calculate();
        });
        box.addEventListener('change', () => {
            let val = parseFloat(box.value);
            if (isNaN(val)) val = parseFloat(slider.value);
            slider.value = val;
            calculate();
        });
    }

    sync(plAmt, plAmtBox);
    sync(plRate, plRateBox);
    sync(plTime, plTimeBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>
