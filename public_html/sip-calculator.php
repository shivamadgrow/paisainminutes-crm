<?php
$page_title = "SIP Calculator Online — Calculate Returns | Paisa in Minutes";
$page_description = "Free online SIP calculator to estimate your mutual fund investment returns, wealth gain, and monthly SIP target growth.";
$page_keywords = "sip calculator, mutual fund calculator, sip returns, investment calculator";
include 'includes/header.php'; 
?>

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
            <h1 class="sec-hero-title">SIP Calculator</h1>
            <p class="sec-hero-desc">Calculate systematic wealth compounding. Estimate future maturity returns of monthly Systematic Investment Plans (SIP) in mutual funds.</p>
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
                    <!-- Monthly Investment -->
                    <div class="input-group-header">
                        <label class="input-label" for="sipAmt">Monthly Investment</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="sipAmtBox" class="input-display" value="5000" min="500" max="150000" step="500">
                        </div>
                    </div>
                    <input type="range" id="sipAmt" class="slider-input" min="500" max="150000" step="500" value="5000">

                    <!-- Expected Return Rate -->
                    <div class="input-group-header">
                        <label class="input-label" for="sipRate">Expected Return Rate (p.a.)</label>
                        <div class="input-display-box">
                            <input type="number" id="sipRateBox" class="input-display" value="12" min="1" max="30" step="0.5">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="sipRate" class="slider-input" min="1" max="30" step="0.5" value="12">

                    <!-- Time Period -->
                    <div class="input-group-header">
                        <label class="input-label" for="sipTime">Time Period</label>
                        <div class="input-display-box">
                            <input type="number" id="sipTimeBox" class="input-display" value="10" min="1" max="30">
                            <span class="input-prefix">Yrs</span>
                        </div>
                    </div>
                    <input type="range" id="sipTime" class="slider-input" min="1" max="30" step="1" value="10">
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">SIP Summary</h3>
                        <div class="result-item">
                            <span class="result-lbl">Invested Amount</span>
                            <span class="result-val" id="resInvested">₹6,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Est. Returns</span>
                            <span class="result-val" id="resInterest">₹5,23,439</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Maturity Value</span>
                            <span class="result-val result-total" id="resTotal">₹11,23,439</span>
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
                    <h3 class="faq-question">What is a Systematic Investment Plan (SIP)?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        An SIP is a method of investing a fixed sum of money regularly (monthly or weekly) into mutual fund schemes. This helps discipline your savings habit and averages out share acquisition costs over market cycles (Rupee Cost Averaging).
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How is SIP future value calculated?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        SIP returns are computed using the Future Value of Annuity formula: <strong>FV = P * [ (1 + r)^n - 1 ] * (1 + r) / r</strong>, where P is monthly deposit, r is monthly return rate (annual expected rate divided by 12), and n is number of monthly payments.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Launch Your Systematic Investment Plan Today</h2>
        <p>Compare top-rated equity mutual funds and open your automated monthly SIP in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Start SIP Now</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const sipAmt = document.getElementById('sipAmt');
    const sipAmtBox = document.getElementById('sipAmtBox');
    const sipRate = document.getElementById('sipRate');
    const sipRateBox = document.getElementById('sipRateBox');
    const sipTime = document.getElementById('sipTime');
    const sipTimeBox = document.getElementById('sipTimeBox');

    const resInvested = document.getElementById('resInvested');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const donutSegment = document.getElementById('donutSegment');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const monthly = parseFloat(sipAmt.value);
        const R = parseFloat(sipRate.value) / 100 / 12; // Monthly rate
        const T = parseFloat(sipTime.value);
        const months = T * 12;

        // FV = P * [ (1 + R)^months - 1 ] * (1 + R) / R
        const A = monthly * (Math.pow(1 + R, months) - 1) * (1 + R) / R;
        const invested = monthly * months;
        const interest = A - invested;

        resInvested.textContent = formatCurrency(invested);
        resInterest.textContent = formatCurrency(interest);
        resTotal.textContent = formatCurrency(A);

        // Chart Update
        const circ = 2 * Math.PI * 60; // 376.99
        const pct = interest / A;
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

    sync(sipAmt, sipAmtBox);
    sync(sipRate, sipRateBox);
    sync(sipTime, sipTimeBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

