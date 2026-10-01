<?php include 'includes/header.php'; ?>

<!-- Custom Styles for Calculator Page -->
<style>
.sec-hero {
    background: var(--gradient-primary);
    padding: 7.5rem 0 5.5rem 0;
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
.sec-hero-title {
    font-size: 3rem;
    color: var(--white);
    margin: 1.5rem 0;
    font-weight: 800;
}
.sec-hero-desc {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 2rem;
    line-height: 1.7;
}

.calc-section {
    padding: 4rem 0 6rem 0;
}
.calc-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-color);
    padding: 3rem;
    margin-top: -4rem;
    position: relative;
    z-index: 10;
}
.calc-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 3.5rem;
}
@media (max-width: 991px) {
    .calc-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }
}

.input-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}
.input-label {
    font-weight: 700;
    color: var(--text-dark);
}
.input-display-box {
    display: flex;
    align-items: center;
    background: var(--light-gray);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    padding: 0.35rem 0.75rem;
}
.input-prefix {
    color: var(--text-muted);
    font-weight: 600;
    margin-right: 0.25rem;
}
.input-display {
    border: none;
    background: transparent;
    font-weight: 700;
    color: var(--primary-color);
    width: 110px;
    text-align: right;
    font-size: 1.05rem;
}
.input-display:focus {
    outline: none;
}
.slider-input {
    width: 100%;
    height: 6px;
    background: #E2E8F0;
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
    margin-bottom: 2rem;
}
.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent-color);
    cursor: pointer;
}

.results-panel {
    background: var(--light-gray);
    border-radius: var(--border-radius-md);
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px dashed var(--border-color);
}
.result-item:last-child {
    border-bottom: none;
}
.result-lbl {
    color: var(--text-muted);
    font-weight: 600;
}
.result-val {
    font-weight: 800;
    color: var(--primary-color);
    font-size: 1.25rem;
}
.result-total {
    font-size: 1.6rem;
    color: var(--accent-color);
}
</style>

<!-- HERO SECTION -->
<section class="sec-hero">
    <div class="container">
        <div class="sec-hero-content">
            <span class="section-tag" style="color: var(--accent-color); font-weight: 700;">Calculator</span>
            <h1 class="sec-hero-title">Personal Loan Prepayment Calculator</h1>
            <p class="sec-hero-desc">Close your high-interest personal loan faster. Estimate total interest savings and tenure reductions when making principal prepayments on active personal loans.</p>
        </div>
    </div>
</section>

<!-- CALCULATOR SECTION -->
<section class="calc-section">
    <div class="container">
        <div class="calc-card">
            <div class="calc-grid">
                <!-- Inputs -->
                <div>
                    <!-- Outstanding Loan Amount -->
                    <div class="input-group-header">
                        <label class="input-label" for="plPreP">Outstanding Loan Principal</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="plPrePBox" class="input-display" value="200000" min="10000" max="2500000" step="5000">
                        </div>
                    </div>
                    <input type="range" id="plPreP" class="slider-input" min="10000" max="2500000" step="5000" value="200000">

                    <!-- Interest Rate -->
                    <div class="input-group-header">
                        <label class="input-label" for="plPreRate">Interest Rate (p.a.)</label>
                        <div class="input-display-box">
                            <input type="number" id="plPreRateBox" class="input-display" value="10.99" min="8" max="36" step="0.1">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="plPreRate" class="slider-input" min="8" max="36" step="0.1" value="10.99">

                    <!-- Remaining Tenure -->
                    <div class="input-group-header">
                        <label class="input-label" for="plPreTime">Remaining Tenure</label>
                        <div class="input-display-box">
                            <input type="number" id="plPreTimeBox" class="input-display" value="36" min="6" max="60">
                            <span class="input-prefix">Mths</span>
                        </div>
                    </div>
                    <input type="range" id="plPreTime" class="slider-input" min="6" max="60" step="1" value="36">

                    <!-- Prepayment Amount -->
                    <div class="input-group-header">
                        <label class="input-label" for="plPreAmt">One-time Prepayment</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="plPreAmtBox" class="input-display" value="50000" min="5000" max="500000" step="5000">
                        </div>
                    </div>
                    <input type="range" id="plPreAmt" class="slider-input" min="5000" max="500000" step="5000" value="50000">
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">Prepayment Savings</h3>
                        <div class="result-item">
                            <span class="result-lbl">Original EMI</span>
                            <span class="result-val" id="resOriginalEMI">₹6,641</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Original Interest</span>
                            <span class="result-val" id="resOriginalInterest">₹39,088</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">New Interest Payable</span>
                            <span class="result-val" id="resNewInterest">₹25,210</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">New Tenure</span>
                            <span class="result-val" id="resNewTenure">25.5 Mths</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Interest Saved</span>
                            <span class="result-val result-total" id="resInterestSaved">₹13,878</span>
                        </div>
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
                    <h3 class="faq-question">What are personal loan prepayment/foreclosure charges?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Unlike home loans, lenders standardly levy prepayment/foreclosure penalty charges on personal loans (typically ranging between 2% and 5% of the outstanding principal amount), especially during the first 12 months.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Does prepaying my personal loan improve my credit score?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes. Prepaying reduces your overall outstanding debt balance (Credit Utilization Ratio) and lowers your monthly debt load, which banks view positively, boosting your CIBIL score.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Balance Transfer Your Personal Loan</h2>
        <p>Switch to lower interest rates and consolidate your high-interest personal debt online instantly.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Balance Transfer</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const plPreP = document.getElementById('plPreP');
    const plPrePBox = document.getElementById('plPrePBox');
    const plPreRate = document.getElementById('plPreRate');
    const plPreRateBox = document.getElementById('plPreRateBox');
    const plPreTime = document.getElementById('plPreTime');
    const plPreTimeBox = document.getElementById('plPreTimeBox');
    const plPreAmt = document.getElementById('plPreAmt');
    const plPreAmtBox = document.getElementById('plPreAmtBox');

    const resOriginalEMI = document.getElementById('resOriginalEMI');
    const resOriginalInterest = document.getElementById('resOriginalInterest');
    const resNewInterest = document.getElementById('resNewInterest');
    const resNewTenure = document.getElementById('resNewTenure');
    const resInterestSaved = document.getElementById('resInterestSaved');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(plPreP.value);
        const R = parseFloat(plPreRate.value) / 12 / 100; // Monthly interest rate
        const N = parseInt(plPreTime.value); // Months
        const X = parseFloat(plPreAmt.value); // Prepayment

        // Original EMI
        const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        const originalTotalInterest = emi * N - P;

        // Verify if prepayment is larger than principal
        if (X >= P) {
            resOriginalEMI.textContent = formatCurrency(emi);
            resOriginalInterest.textContent = formatCurrency(originalTotalInterest);
            resNewInterest.textContent = formatCurrency(0);
            resNewTenure.textContent = '0 Months';
            resInterestSaved.textContent = formatCurrency(originalTotalInterest);
            return;
        }

        // New Tenure N' = -ln(1 - (P-X)*R/E) / ln(1+R)
        const valInsideLog = 1 - ((P - X) * R) / emi;
        let newN = N;
        if (valInsideLog > 0) {
            newN = -Math.log(valInsideLog) / Math.log(1 + R);
        } else {
            newN = 0;
        }

        const newTotalInterest = emi * newN - (P - X);
        let interestSaved = originalTotalInterest - newTotalInterest;
        if (interestSaved < 0) interestSaved = 0;

        resOriginalEMI.textContent = formatCurrency(emi);
        resOriginalInterest.textContent = formatCurrency(originalTotalInterest);
        resNewInterest.textContent = formatCurrency(newTotalInterest);
        resNewTenure.textContent = Math.round(newN) + ' Mths';
        resInterestSaved.textContent = formatCurrency(interestSaved);
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

    sync(plPreP, plPrePBox);
    sync(plPreRate, plPreRateBox);
    sync(plPreTime, plPreTimeBox);
    sync(plPreAmt, plPreAmtBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

