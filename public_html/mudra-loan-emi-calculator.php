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

.toggle-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 2rem;
}
.toggle-btn {
    padding: 0.85rem 0.5rem;
    border: 1px solid var(--border-color);
    background: var(--white);
    border-radius: var(--border-radius-sm);
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    text-align: center;
    font-size: 0.9rem;
    transition: var(--transition-smooth);
}
.toggle-btn.active {
    background: var(--primary-color);
    color: var(--white);
    border-color: var(--primary-color);
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
            <h1 class="sec-hero-title">Mudra Loan EMI Calculator</h1>
            <p class="sec-hero-desc">Calculate government-backed microfinance. Estimate monthly repayments for Shishu, Kishor, and Tarun category Mudra loans online.</p>
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
                    <!-- Mudra Slabs Toggles -->
                    <label class="input-label" style="display: block; margin-bottom: 0.75rem;">Mudra Loan Category</label>
                    <div class="toggle-group">
                        <button type="button" class="toggle-btn" id="btnShishu" data-min="10000" data-max="50000" data-val="50000">Shishu (Up to ₹50K)</button>
                        <button type="button" class="toggle-btn active" id="btnKishor" data-min="50001" data-max="500000" data-val="300000">Kishor (₹50K - ₹5L)</button>
                        <button type="button" class="toggle-btn" id="btnTarun" data-min="500001" data-max="1000000" data-val="800000">Tarun (₹5L - ₹10L)</button>
                    </div>

                    <!-- Loan Amount -->
                    <div class="input-group-header">
                        <label class="input-label" for="mudraAmt">Loan Amount</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="mudraAmtBox" class="input-display" value="300000" min="50001" max="500000" step="5000">
                        </div>
                    </div>
                    <input type="range" id="mudraAmt" class="slider-input" min="50001" max="500000" step="5000" value="300000">

                    <!-- Interest Rate -->
                    <div class="input-group-header">
                        <label class="input-label" for="mudraRate">Interest Rate (p.a.)</label>
                        <div class="input-display-box">
                            <input type="number" id="mudraRateBox" class="input-display" value="10.00" min="8" max="15" step="0.1">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="mudraRate" class="slider-input" min="8" max="15" step="0.1" value="10.00">

                    <!-- Tenure -->
                    <div class="input-group-header">
                        <label class="input-label" for="mudraTime">Tenure (Duration)</label>
                        <div class="input-display-box">
                            <input type="number" id="mudraTimeBox" class="input-display" value="3" min="1" max="5">
                            <span class="input-prefix">Yrs</span>
                        </div>
                    </div>
                    <input type="range" id="mudraTime" class="slider-input" min="1" max="5" step="1" value="3">
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">Mudra EMI Summary</h3>
                        <div class="result-item">
                            <span class="result-lbl">Principal Amount</span>
                            <span class="result-val" id="resInvested">₹3,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total Interest</span>
                            <span class="result-val" id="resInterest">₹48,486</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total Amount</span>
                            <span class="result-val" id="resTotal">₹3,48,486</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Monthly EMI</span>
                            <span class="result-val result-total" id="resEMI">₹9,680</span>
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
                    <h3 class="faq-question">What is Pradhan Mantri MUDRA Yojana (PMMY)?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        PMMY is a central government scheme that facilitates microfinance loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises. The loans are categorized as Shishu, Kishor, and Tarun based on fund requirements.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Do Mudra loans require security collateral?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        No. Under government mandates, banks and NBFC partners are prohibited from demanding any collateral security or third-party guarantees for Mudra loan products up to ₹10 Lakhs.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Boost Your Micro Enterprise Today</h2>
        <p>Get collateral-free Mudra financing up to ₹10 Lakhs with easy structured repayments.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Online</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const mudraAmt = document.getElementById('mudraAmt');
    const mudraAmtBox = document.getElementById('mudraAmtBox');
    const mudraRate = document.getElementById('mudraRate');
    const mudraRateBox = document.getElementById('mudraRateBox');
    const mudraTime = document.getElementById('mudraTime');
    const mudraTimeBox = document.getElementById('mudraTimeBox');

    const btnShishu = document.getElementById('btnShishu');
    const btnKishor = document.getElementById('btnKishor');
    const btnTarun = document.getElementById('btnTarun');

    const resInvested = document.getElementById('resInvested');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const resEMI = document.getElementById('resEMI');
    const donutSegment = document.getElementById('donutSegment');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(mudraAmt.value);
        const R = parseFloat(mudraRate.value) / 12 / 100; // Monthly interest
        const N = parseInt(mudraTime.value) * 12; // Months

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

    function setupCategory(btn) {
        const min = parseInt(btn.dataset.min);
        const max = parseInt(btn.dataset.max);
        const val = parseInt(btn.dataset.val);

        mudraAmt.min = min;
        mudraAmt.max = max;
        mudraAmt.value = val;
        mudraAmtBox.min = min;
        mudraAmtBox.max = max;
        mudraAmtBox.value = val;

        btnShishu.classList.remove('active');
        btnKishor.classList.remove('active');
        btnTarun.classList.remove('active');
        btn.classList.add('active');

        calculate();
    }

    btnShishu.addEventListener('click', () => setupCategory(btnShishu));
    btnKishor.addEventListener('click', () => setupCategory(btnKishor));
    btnTarun.addEventListener('click', () => setupCategory(btnTarun));

    // Sync input box and slider
    mudraAmt.addEventListener('input', () => {
        mudraAmtBox.value = mudraAmt.value;
        calculate();
    });
    mudraAmtBox.addEventListener('change', () => {
        let val = parseFloat(mudraAmtBox.value);
        if (isNaN(val)) val = parseFloat(mudraAmt.value);
        mudraAmt.value = val;
        calculate();
    });

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

    sync(mudraRate, mudraRateBox);
    sync(mudraTime, mudraTimeBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

