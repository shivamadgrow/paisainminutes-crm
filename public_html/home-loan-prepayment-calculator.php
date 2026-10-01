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
            <h1 class="sec-hero-title">Home Loan Prepayment Calculator</h1>
            <p class="sec-hero-desc">Reduce your home loan liability. Estimate total interest savings and tenure reductions when making principal prepayments on outstanding home loans.</p>
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
                        <label class="input-label" for="hlPreP">Outstanding Loan Principal</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="hlPrePBox" class="input-display" value="5000000" min="500000" max="50000000" step="50000">
                        </div>
                    </div>
                    <input type="range" id="hlPreP" class="slider-input" min="500000" max="50000000" step="50000" value="5000000">

                    <!-- Interest Rate -->
                    <div class="input-group-header">
                        <label class="input-label" for="hlPreRate">Interest Rate (p.a.)</label>
                        <div class="input-display-box">
                            <input type="number" id="hlPreRateBox" class="input-display" value="8.50" min="6" max="15" step="0.05">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="hlPreRate" class="slider-input" min="6" max="15" step="0.05" value="8.50">

                    <!-- Remaining Tenure -->
                    <div class="input-group-header">
                        <label class="input-label" for="hlPreTime">Remaining Tenure</label>
                        <div class="input-display-box">
                            <input type="number" id="hlPreTimeBox" class="input-display" value="20" min="3" max="30">
                            <span class="input-prefix">Yrs</span>
                        </div>
                    </div>
                    <input type="range" id="hlPreTime" class="slider-input" min="3" max="30" step="1" value="20">

                    <!-- Prepayment Amount -->
                    <div class="input-group-header">
                        <label class="input-label" for="hlPreAmt">One-time Prepayment</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="hlPreAmtBox" class="input-display" value="200000" min="10000" max="5000000" step="10000">
                        </div>
                    </div>
                    <input type="range" id="hlPreAmt" class="slider-input" min="10000" max="5000000" step="10000" value="200000">
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">Prepayment Savings</h3>
                        <div class="result-item">
                            <span class="result-lbl">Original EMI</span>
                            <span class="result-val" id="resOriginalEMI">₹43,391</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Original Interest</span>
                            <span class="result-val" id="resOriginalInterest">₹54,13,879</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">New Interest Payable</span>
                            <span class="result-val" id="resNewInterest">₹46,80,210</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">New Tenure</span>
                            <span class="result-val" id="resNewTenure">18.1 Yrs</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Interest Saved</span>
                            <span class="result-val result-total" id="resInterestSaved">₹7,33,669</span>
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
                    <h3 class="faq-question">What are the prepayment charges on floating-rate home loans?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Under RBI regulations, banks and housing finance companies are prohibited from levying any prepayment or foreclosure penalty charges on floating-rate home loans borrowed by individual borrowers.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Is it better to reduce EMI or reduce tenure during prepayment?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Keeping your monthly EMI constant and reducing your tenure yields far higher total interest savings because the principal amount gets paid off much faster, reducing the timeline of interest compounding.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Refinance Your Active Home Loan Online</h2>
        <p>Switch to lower interest rates with our home loan balance transfer facility. Zero hassle processing.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Balance Transfer</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const hlPreP = document.getElementById('hlPreP');
    const hlPrePBox = document.getElementById('hlPrePBox');
    const hlPreRate = document.getElementById('hlPreRate');
    const hlPreRateBox = document.getElementById('hlPreRateBox');
    const hlPreTime = document.getElementById('hlPreTime');
    const hlPreTimeBox = document.getElementById('hlPreTimeBox');
    const hlPreAmt = document.getElementById('hlPreAmt');
    const hlPreAmtBox = document.getElementById('hlPreAmtBox');

    const resOriginalEMI = document.getElementById('resOriginalEMI');
    const resOriginalInterest = document.getElementById('resOriginalInterest');
    const resNewInterest = document.getElementById('resNewInterest');
    const resNewTenure = document.getElementById('resNewTenure');
    const resInterestSaved = document.getElementById('resInterestSaved');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(hlPreP.value);
        const R = parseFloat(hlPreRate.value) / 12 / 100; // Monthly interest rate
        const N = parseInt(hlPreTime.value) * 12; // Months
        const X = parseFloat(hlPreAmt.value); // Prepayment

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
        resNewTenure.textContent = (newN / 12).toFixed(1) + ' Yrs';
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

    sync(hlPreP, hlPrePBox);
    sync(hlPreRate, hlPreRateBox);
    sync(hlPreTime, hlPreTimeBox);
    sync(hlPreAmt, hlPreAmtBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

