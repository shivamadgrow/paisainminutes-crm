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
            <h1 class="sec-hero-title">Mutual Fund Lump-Sum Calculator</h1>
            <p class="sec-hero-desc">Estimate your wealth creation. Compute estimated maturity values of one-time mutual fund investments based on expected compound annual return rates.</p>
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
                        <label class="input-label" for="mfAmt">Total Investment</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="mfAmtBox" class="input-display" value="100000" min="5000" max="5000000">
                        </div>
                    </div>
                    <input type="range" id="mfAmt" class="slider-input" min="5000" max="5000000" step="5000" value="100000">

                    <!-- Expected Return Rate -->
                    <div class="input-group-header">
                        <label class="input-label" for="mfRate">Expected Return Rate (p.a.)</label>
                        <div class="input-display-box">
                            <input type="number" id="mfRateBox" class="input-display" value="12" min="1" max="30" step="0.5">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="mfRate" class="slider-input" min="1" max="30" step="0.5" value="12">

                    <!-- Time Period -->
                    <div class="input-group-header">
                        <label class="input-label" for="mfTime">Time Period</label>
                        <div class="input-display-box">
                            <input type="number" id="mfTimeBox" class="input-display" value="10" min="1" max="30">
                            <span class="input-prefix">Yrs</span>
                        </div>
                    </div>
                    <input type="range" id="mfTime" class="slider-input" min="1" max="30" step="1" value="10">
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">Wealth Estimate Summary</h3>
                        <div class="result-item">
                            <span class="result-lbl">Invested Amount</span>
                            <span class="result-val" id="resInvested">₹1,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Est. Returns</span>
                            <span class="result-val" id="resInterest">₹2,10,585</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Total Value</span>
                            <span class="result-val result-total" id="resTotal">₹3,10,585</span>
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
                    <h3 class="faq-question">What is mutual fund CAGR?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        CAGR (Compound Annual Growth Rate) represents the annualized rate of compounding growth that your principal capital earns over a specific multi-year investment horizon.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How does one-time lump-sum differ from SIP compounding?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        In a lump-sum investment, your entire capital is deposited at once and compounds for the entire tenure. In an SIP, capital is invested incrementally monthly, meaning later installments compound for progressively shorter timeframes.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Start Your Direct Investment Plans Online</h2>
        <p>Compare top-rated mutual funds online, finish your KYC, and open your direct account instantly.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Invest Now</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const mfAmt = document.getElementById('mfAmt');
    const mfAmtBox = document.getElementById('mfAmtBox');
    const mfRate = document.getElementById('mfRate');
    const mfRateBox = document.getElementById('mfRateBox');
    const mfTime = document.getElementById('mfTime');
    const mfTimeBox = document.getElementById('mfTimeBox');

    const resInvested = document.getElementById('resInvested');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const donutSegment = document.getElementById('donutSegment');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(mfAmt.value);
        const R = parseFloat(mfRate.value) / 100;
        const T = parseFloat(mfTime.value);

        // A = P * (1 + R)^T
        const A = P * Math.pow(1 + R, T);
        const interest = A - P;

        resInvested.textContent = formatCurrency(P);
        resInterest.textContent = formatCurrency(interest);
        resTotal.textContent = formatCurrency(A);

        // Chart Update
        const circ = 2 * Math.PI * 60; // 376.99
        const pct = interest / A;
        donutSegment.style.strokeDashoffset = circ * (1 - pct);
    }

    // Sync inputs and sliders
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

    sync(mfAmt, mfAmtBox);
    sync(mfRate, mfRateBox);
    sync(mfTime, mfTimeBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

