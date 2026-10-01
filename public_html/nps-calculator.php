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
            <h1 class="sec-hero-title">National Pension System (NPS) Calculator</h1>
            <p class="sec-hero-desc">Plan your retirement pension. Estimate your maturity corpus, tax-free lump-sum withdrawal, and monthly annuity pension payouts from your NPS investments.</p>
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
                    <!-- Monthly Contribution -->
                    <div class="input-group-header">
                        <label class="input-label" for="npsCont">Monthly Contribution</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="npsContBox" class="input-display" value="5000" min="500" max="150000" step="500">
                        </div>
                    </div>
                    <input type="range" id="npsCont" class="slider-input" min="500" max="150000" step="500" value="5000">

                    <!-- Expected Return Rate -->
                    <div class="input-group-header">
                        <label class="input-label" for="npsRate">Expected Return Rate (p.a.)</label>
                        <div class="input-display-box">
                            <input type="number" id="npsRateBox" class="input-display" value="10" min="5" max="15" step="0.5">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="npsRate" class="slider-input" min="5" max="15" step="0.5" value="10">

                    <!-- Current Age -->
                    <div class="input-group-header">
                        <label class="input-label" for="npsAge">Current Age</label>
                        <div class="input-display-box">
                            <input type="number" id="npsAgeBox" class="input-display" value="30" min="18" max="60">
                            <span class="input-prefix">Yrs</span>
                        </div>
                    </div>
                    <input type="range" id="npsAge" class="slider-input" min="18" max="60" step="1" value="30">

                    <!-- Annuity Purchase % -->
                    <div class="input-group-header">
                        <label class="input-label" for="npsAnn">Annuity Purchase Share</label>
                        <div class="input-display-box">
                            <input type="number" id="npsAnnBox" class="input-display" value="40" min="40" max="100">
                            <span class="input-prefix">%</span>
                        </div>
                    </div>
                    <input type="range" id="npsAnn" class="slider-input" min="40" max="100" step="5" value="40">
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">Retirement Plan</h3>
                        <div class="result-item">
                            <span class="result-lbl">Total Investment</span>
                            <span class="result-val" id="resInvested">₹18,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Maturity Corpus</span>
                            <span class="result-val" id="resMaturity">₹1,13,96,627</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Lump-sum Payout (60%)</span>
                            <span class="result-val" id="resLump">₹68,37,976</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Annuity Corpus (40%)</span>
                            <span class="result-val" id="resAnnCorpus">₹45,58,651</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" style="color: var(--text-dark); font-weight: 700;">Est. Monthly Pension</span>
                            <span class="result-val result-total" id="resPension">₹22,793</span>
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
                    <h3 class="faq-question">What is the minimum annuity purchase percentage?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Under PFRDA guidelines, you must purchase an annuity plan with at least 40% of your total NPS maturity corpus at age 60. The remaining 60% can be withdrawn as a completely tax-free lump-sum amount.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How does NPS compare to PPF or mutual funds for tax savings?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        NPS offers tax deductions up to ₹1.5 Lakhs under Section 80CCD(1) and an additional deduction of ₹50,000 under Section 80CCD(1B), making it highly tax-efficient compared to PPF or ELSS mutual funds.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Secure Your Golden Years Today</h2>
        <p>Register for your National Pension Scheme online and start building your tax-free retirement wealth.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Invest Now</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const npsCont = document.getElementById('npsCont');
    const npsContBox = document.getElementById('npsContBox');
    const npsRate = document.getElementById('npsRate');
    const npsRateBox = document.getElementById('npsRateBox');
    const npsAge = document.getElementById('npsAge');
    const npsAgeBox = document.getElementById('npsAgeBox');
    const npsAnn = document.getElementById('npsAnn');
    const npsAnnBox = document.getElementById('npsAnnBox');

    const resInvested = document.getElementById('resInvested');
    const resMaturity = document.getElementById('resMaturity');
    const resLump = document.getElementById('resLump');
    const resAnnCorpus = document.getElementById('resAnnCorpus');
    const resPension = document.getElementById('resPension');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const monthly = parseFloat(npsCont.value);
        const rate = parseFloat(npsRate.value) / 100 / 12; // Monthly rate
        const currentAge = parseInt(npsAge.value);
        const tenureYears = 60 - currentAge;
        const months = tenureYears * 12;
        const annuityPct = parseFloat(npsAnn.value) / 100;

        if (months <= 0) {
            resInvested.textContent = formatCurrency(0);
            resMaturity.textContent = formatCurrency(0);
            resLump.textContent = formatCurrency(0);
            resAnnCorpus.textContent = formatCurrency(0);
            resPension.textContent = formatCurrency(0);
            return;
        }

        // Future Value of Annuity formula: FV = P * [ (1 + r)^n - 1 ] * (1 + r) / r
        const fv = monthly * (Math.pow(1 + rate, months) - 1) * (1 + rate) / rate;
        const totalInvested = monthly * months;

        const annuityCorpus = fv * annuityPct;
        const lumpSum = fv * (1 - annuityPct);
        
        // Estimated annuity return rate of 6% p.a. (0.5% monthly pension yield)
        const monthlyPension = annuityCorpus * (0.06 / 12);

        resInvested.textContent = formatCurrency(totalInvested);
        resMaturity.textContent = formatCurrency(fv);
        resLump.textContent = formatCurrency(lumpSum);
        resAnnCorpus.textContent = formatCurrency(annuityCorpus);
        resPension.textContent = formatCurrency(monthlyPension);
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

    sync(npsCont, npsContBox);
    sync(npsRate, npsRateBox);
    sync(npsAge, npsAgeBox);
    sync(npsAnn, npsAnnBox);

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

