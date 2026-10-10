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
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
}
.toggle-btn {
    padding: 0.85rem;
    border: 1px solid var(--border-color);
    background: var(--white);
    border-radius: var(--border-radius-sm);
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    text-align: center;
    transition: var(--transition-smooth);
}
.toggle-btn.active {
    background: var(--primary-color);
    color: var(--white);
    border-color: var(--primary-color);
}

.slab-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 2rem;
}
.slab-btn {
    padding: 0.85rem;
    border: 1px solid var(--border-color);
    background: var(--white);
    border-radius: var(--border-radius-sm);
    font-weight: 700;
    color: var(--text-dark);
    cursor: pointer;
    text-align: center;
    transition: var(--transition-smooth);
}
.slab-btn.active {
    background: var(--accent-color);
    color: var(--white);
    border-color: var(--accent-color);
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
            <h1 class="sec-hero-title">GST Calculator</h1>
            <p class="sec-hero-desc">Calculate Goods and Services Tax quickly. Add or remove GST slabs from item valuations to calculate net, gross, CGST, and SGST metrics.</p>
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
                    <!-- Exclusive / Inclusive Toggle -->
                    <label class="input-label" style="display: block; margin-bottom: 0.75rem;">GST Calculation Type</label>
                    <div class="toggle-group">
                        <button type="button" class="toggle-btn active" id="btnExclusive" data-type="exclusive">Add GST (Exclusive)</button>
                        <button type="button" class="toggle-btn" id="btnInclusive" data-type="inclusive">Remove GST (Inclusive)</button>
                    </div>

                    <!-- Base Amount -->
                    <div class="input-group-header">
                        <label class="input-label" for="baseAmt">Amount</label>
                        <div class="input-display-box">
                            <span class="input-prefix">₹</span>
                            <input type="number" id="baseAmtBox" class="input-display" value="10000" min="100" max="1000000">
                        </div>
                    </div>
                    <input type="range" id="baseAmt" class="slider-input" min="100" max="1000000" step="100" value="10000">

                    <!-- GST Rates Slabs -->
                    <label class="input-label" style="display: block; margin-bottom: 0.75rem;">GST Slab Rate</label>
                    <div class="slab-group">
                        <button type="button" class="slab-btn" data-rate="5">5%</button>
                        <button type="button" class="slab-btn" data-rate="12">12%</button>
                        <button type="button" class="slab-btn active" data-rate="18">18%</button>
                        <button type="button" class="slab-btn" data-rate="28">28%</button>
                    </div>
                </div>

                <!-- Results -->
                <div class="results-panel">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: var(--primary-color);">GST Tax Breakdown</h3>
                        <div class="result-item">
                            <span class="result-lbl" id="lblOriginal">Net Amount</span>
                            <span class="result-val" id="resOriginal">₹10,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">CGST (Central Share)</span>
                            <span class="result-val" id="resCGST">₹900</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">SGST (State Share)</span>
                            <span class="result-val" id="resSGST">₹900</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total GST Amount</span>
                            <span class="result-val" id="resTotalTax">₹1,800</span>
                        </div>
                        <div class="result-item" style="border-top: 2px solid var(--border-color); padding-top: 1.5rem;">
                            <span class="result-lbl" id="lblFinal" style="color: var(--text-dark); font-weight: 700;">Gross Amount</span>
                            <span class="result-val result-total" id="resFinal">₹11,800</span>
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
                    <h3 class="faq-question">What is GST Exclusive?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        GST Exclusive (Add GST) means the price of the product does not include GST. The tax percentage is calculated on the base price and added to compute the final gross billing amount.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is GST Inclusive?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        GST Inclusive (Remove GST) means the price of the product already contains the tax amount. The calculator subtracts the tax component to show the original net price and CGST/SGST shares.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Need Quick Financial Support?</h2>
        <p>Check instant personal loan eligibility up to ₹1,00,000 from RBI-regulated lending partners.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply for Personal Loan</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const baseAmt = document.getElementById('baseAmt');
    const baseAmtBox = document.getElementById('baseAmtBox');
    const btnExclusive = document.getElementById('btnExclusive');
    const btnInclusive = document.getElementById('btnInclusive');
    const slabBtns = document.querySelectorAll('.slab-btn');

    const resOriginal = document.getElementById('resOriginal');
    const resCGST = document.getElementById('resCGST');
    const resSGST = document.getElementById('resSGST');
    const resTotalTax = document.getElementById('resTotalTax');
    const resFinal = document.getElementById('resFinal');

    const lblOriginal = document.getElementById('lblOriginal');
    const lblFinal = document.getElementById('lblFinal');

    let calcType = 'exclusive';
    let gstRate = 18;

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const amt = parseFloat(baseAmt.value);
        let originalVal = 0;
        let finalVal = 0;
        let taxVal = 0;

        if (calcType === 'exclusive') {
            originalVal = amt;
            taxVal = amt * (gstRate / 100);
            finalVal = amt + taxVal;
            lblOriginal.textContent = 'Net Amount';
            lblFinal.textContent = 'Gross Amount';
        } else {
            finalVal = amt;
            originalVal = amt / (1 + gstRate / 100);
            taxVal = amt - originalVal;
            lblOriginal.textContent = 'Net Amount';
            lblFinal.textContent = 'Gross Amount';
        }

        const cgst = taxVal / 2;
        const sgst = taxVal / 2;

        resOriginal.textContent = formatCurrency(originalVal);
        resCGST.textContent = formatCurrency(cgst);
        resSGST.textContent = formatCurrency(sgst);
        resTotalTax.textContent = formatCurrency(taxVal);
        resFinal.textContent = formatCurrency(finalVal);
    }

    // Calculation Type Toggle
    btnExclusive.addEventListener('click', () => {
        calcType = 'exclusive';
        btnExclusive.classList.add('active');
        btnInclusive.classList.remove('active');
        calculate();
    });
    btnInclusive.addEventListener('click', () => {
        calcType = 'inclusive';
        btnInclusive.classList.add('active');
        btnExclusive.classList.remove('active');
        calculate();
    });

    // Rate Slabs click
    slabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            slabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gstRate = parseInt(btn.dataset.rate);
            calculate();
        });
    });

    // Sync input box and slider
    baseAmt.addEventListener('input', () => {
        baseAmtBox.value = baseAmt.value;
        calculate();
    });
    baseAmtBox.addEventListener('change', () => {
        let val = parseInt(baseAmtBox.value);
        if (isNaN(val)) val = parseInt(baseAmt.value);
        baseAmt.value = val;
        calculate();
    });

    calculate();
});
</script>

<?php include 'includes/footer.php'; ?>

