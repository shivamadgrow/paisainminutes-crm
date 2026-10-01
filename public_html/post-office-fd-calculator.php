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

.select-input {
    width: 100%;
    padding: 0.85rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 2rem;
    background: var(--white);
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

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
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
            <span class="section-tag" style="color: var(--accent-color); font-weight: 700;">Calculator</span>
            <h1 class="sec-hero-title">Post Office Time Deposit (FD) Calculator</h1>
            <p class="sec-hero-desc">Calculate your sovereign savings. Estimate maturity values and interest compounding yields for Indian Post Office Time Deposit accounts.</p>
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
                    <!-- Total Investment -->
                    <div class="input-group-header">
                        <label class="input-label" for="poAmt">Total Investment</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="poAmtBox" class="input-display" value="100000" min="1000" max="5000000">
                        </div>
                    </div>
                    <input type="range" id="poAmt" class="slider-input" min="1000" max="5000000" step="1000" value="100000">

                    <!-- Time Period Select -->
                    <label class="input-label" for="poTenure" style="display: block; margin-bottom: 0.75rem;">Time Period (POTD Tenure)</label>
                    <select id="poTenure" class="select-input">
                        <option value="1" data-rate="6.90">1 Year Time Deposit (6.90% p.a.)</option>
                        <option value="2" data-rate="7.00">2 Years Time Deposit (7.00% p.a.)</option>
                        <option value="3" data-rate="7.10">3 Years Time Deposit (7.10% p.a.)</option>
                        <option value="5" data-rate="7.50" selected>5 Years Time Deposit (7.50% p.a. - Tax Saving)</option>
                    </select>

                    <!-- Rate Display -->
                    <div class="input-group-header" style="margin-top: 1rem;">
                        <span class="input-label">Interest Rate (Compounded Quarterly)</span>
                        <span class="result-val" id="poRateVal" style="color: var(--accent-color);">7.50%</span>
                    </div>
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">Post Office Summary</h3>
                        <div class="result-item">
                            <span class="result-lbl">Invested Amount</span>
                            <span class="result-val" id="resInvested">₹1,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Est. Interest</span>
                            <span class="result-val" id="resInterest">₹44,995</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Maturity Value</span>
                            <span class="result-val result-total" id="resTotal">₹1,44,995</span>
                        </div>
                    </div>

                    <div class="chart-container">
                        <svg width="160" height="160" class="donut-svg">
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#E2E8F0" stroke-width="16"></circle>
                            <circle id="donutSegment" cx="80" cy="80" r="60" fill="transparent" stroke="var(--accent-color)" stroke-width="16" stroke-dasharray="376.99" stroke-dashoffset="100"></circle>
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
                    <h3 class="faq-question">What is the compounding frequency of Post Office Time Deposits?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Post Office Time Deposit (POTD) interest is calculated and compounded **quarterly**, but paid out to the investor annually or accumulated until the maturity date of the account.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Are Post Office FDs eligible for tax deductions?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Only the **5-Year Post Office Time Deposit** is eligible for tax deductions under Section 80C of the Income Tax Act up to the maximum limit of ₹1.5 Lakhs per financial year. 1, 2, and 3-year options do not qualify.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Start Your Sovereign Safe Savings Today</h2>
        <p>Invest in Post Office Time Deposits with 100% government guarantee online in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Invest Now</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const poAmt = document.getElementById('poAmt');
    const poAmtBox = document.getElementById('poAmtBox');
    const poTenure = document.getElementById('poTenure');
    const poRateVal = document.getElementById('poRateVal');

    const resInvested = document.getElementById('resInvested');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const donutSegment = document.getElementById('donutSegment');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(poAmt.value);
        const selectedOpt = poTenure.options[poTenure.selectedIndex];
        const R = parseFloat(selectedOpt.dataset.rate) / 100;
        const T = parseInt(poTenure.value);
        const N = 4; // Quarterly compounding

        // Update Rate Label
        poRateVal.textContent = (R * 100).toFixed(2) + '%';

        // A = P * (1 + R/4)^(4*T)
        const A = P * Math.pow(1 + R/N, N * T);
        const interest = A - P;

        resInvested.textContent = formatCurrency(P);
        resInterest.textContent = formatCurrency(interest);
        resTotal.textContent = formatCurrency(A);

        // Chart Update
        const circ = 2 * Math.PI * 60; // 376.99
        const pct = interest / A;
        donutSegment.style.strokeDashoffset = circ * (1 - pct);
    }

    poAmt.addEventListener('input', () => {
        poAmtBox.value = poAmt.value;
        calculate();
    });
    poAmtBox.addEventListener('change', () => {
        let val = parseFloat(poAmtBox.value);
        if (isNaN(val)) val = parseFloat(poAmt.value);
        poAmt.value = val;
        calculate();
    });
    poTenure.addEventListener('change', calculate);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

