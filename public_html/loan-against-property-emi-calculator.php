<?php
$canonical_url = "https://paisainminutes.com/loan-against-property-emi-calculator";
$page_title = "Loan Against Property EMI Calculator | LAP EMI & Interest Calculator Online";
$page_description = "Calculate your Loan Against Property (LAP) EMI, interest payable, and repayment schedule instantly. Plan your secured mortgage loan online with Paisa in Minutes.";
$page_keywords = "loan against property emi calculator, lap calculator, property loan emi calculator, mortgage loan emi calculator, loan against residential property, commercial property loan calculator";
$human_name = "Loan Against Property EMI Calculator";

$page_faqs = [
    [
        "question" => "What is a Loan Against Property (LAP) EMI Calculator?",
        "answer" => "A Loan Against Property (LAP) EMI Calculator is a free digital financial tool that calculates your exact monthly EMI, total interest liability, and overall loan repayment cost when you mortgage a residential, commercial, or industrial property."
    ],
    [
        "question" => "How is LAP EMI calculated?",
        "answer" => "LAP EMI is calculated using the standard reducing balance mathematical formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the Principal Loan Amount, R is the Monthly Interest Rate (Annual Rate / 12 / 100), and N is the Loan Tenure in months."
    ],
    [
        "question" => "What is the typical interest rate and tenure for Loan Against Property in India?",
        "answer" => "In India, Loan Against Property interest rates typically range from 8.50% to 15.00% p.a. depending on property valuation, lender policies, and borrower credit profile. Tenures usually range from 5 to 20 years."
    ],
    [
        "question" => "How much loan amount can I get against my property?",
        "answer" => "Banks and NBFCs usually offer a Loan-to-Value (LTV) ratio of 50% to 75% of the market value of residential properties, and 50% to 65% for commercial or industrial properties based on an independent valuation."
    ],
    [
        "question" => "What is the difference between a Personal Loan and a Loan Against Property?",
        "answer" => "A Personal Loan is an unsecured loan with smaller amounts (up to ₹1-5 Lakhs) and shorter tenures (1-5 years) with higher interest rates (10.49% to 28%). In contrast, a Loan Against Property is a secured loan requiring real estate collateral, offering much higher borrowing limits (up to ₹5-10 Crores), longer tenures (up to 15-20 years), and lower interest rates (starting around 8.50%-9.50%)."
    ]
];

include 'includes/header.php';
?>

<!-- Custom Styles for LAP Calculator Page -->
<style>
.sec-hero {
    background: var(--gradient-primary, linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%));
    padding: 7.5rem 0 5rem 0;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
    text-align: center;
}
.sec-hero-content {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1rem;
}
.sec-hero-badge {
    display: inline-block;
    padding: 0.4rem 1.25rem;
    background: rgba(0, 208, 156, 0.15);
    color: #00D09C;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(0, 208, 156, 0.3);
}
.sec-hero-title {
    font-size: 2.85rem;
    color: #FFFFFF !important;
    margin: 0.5rem 0 1.25rem 0;
    font-weight: 800;
    line-height: 1.2;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.sec-hero-desc {
    font-size: 1.15rem;
    color: #E2E8F0 !important;
    margin-bottom: 0;
    line-height: 1.7;
}

.calc-section {
    padding: 3rem 0 5rem 0;
    background: #F8FAFC;
}
.calc-card {
    background: #FFFFFF;
    border-radius: 24px;
    box-shadow: 0 20px 40px -15px rgba(27, 42, 107, 0.08);
    border: 1px solid #E2E8F0;
    padding: 3.5rem;
    position: relative;
    z-index: 10;
}

.calc-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 3.5rem;
    align-items: start;
}

@media (max-width: 991px) {
    .calc-card {
        padding: 2rem 1.5rem;
    }
    .calc-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }
    .sec-hero-title {
        font-size: 2.15rem;
    }
}

.calc-inputs-col {
    display: flex;
    flex-direction: column;
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
}

.input-display-box {
    display: inline-flex;
    align-items: center;
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
    width: 110px;
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
}

.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #00D09C;
    border: 3px solid #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 208, 156, 0.5);
    cursor: pointer;
    transition: transform 0.15s ease;
}

.slider-input::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    background: #059669;
}

.slider-input::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #00D09C;
    border: 3px solid #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 208, 156, 0.5);
    cursor: pointer;
}

.results-panel {
    background: #F8FAFC;
    border-radius: 20px;
    padding: 2.25rem;
    border: 1.5px solid #E2E8F0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.results-title {
    font-size: 1.35rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    text-align: center;
    color: #1E3A8A;
}

.result-emi-box {
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    border-radius: 14px;
    padding: 1.25rem;
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
    font-size: 1.85rem;
    font-weight: 800;
    color: #2563EB;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 0;
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
    font-size: 1.15rem;
}

.chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.donut-svg {
    transform: rotate(-90deg);
}

.chart-legend {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
}

.btn-calc-apply {
    background: #00D09C;
    color: #064E3B;
    border-radius: 50px;
    padding: 0.9rem 1.75rem;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 6px 15px -3px rgba(0, 208, 156, 0.4);
    width: 100%;
}

.btn-calc-apply:hover {
    background: #059669;
    color: #FFFFFF;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -3px rgba(0, 208, 156, 0.5);
}

/* Informational Content Sections */
.info-section {
    padding: 4.5rem 0;
}
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
}
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}
.info-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 2.25rem;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.04);
}
.info-card h3 {
    color: #1E3A8A;
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 1rem;
}
.info-card p, .info-card li {
    color: #475569;
    font-size: 0.975rem;
    line-height: 1.7;
}

/* Formula Box */
.formula-box {
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    font-family: monospace;
    font-size: 1.1rem;
    color: #1E3A8A;
    font-weight: 700;
    text-align: center;
}

/* Comparison Table */
.table-responsive {
    overflow-x: auto;
    margin: 2rem 0;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
}
.comparison-table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;
    text-align: left;
}
.comparison-table th, .comparison-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #E2E8F0;
    font-size: 0.95rem;
}
.comparison-table th {
    background: #1B2A6B;
    color: #FFFFFF;
    font-weight: 700;
}
.comparison-table tr:last-child td {
    border-bottom: none;
}
.comparison-table tr:nth-child(even) {
    background: #F8FAFC;
}

/* FAQs */
.faq-container {
    max-width: 860px;
    margin: 0 auto;
}
.faq-item {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: all 0.2s ease;
}
.faq-header {
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
}
.faq-header h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0F172A;
}
.faq-icon-wrapper svg {
    width: 20px;
    height: 20px;
    color: #64748B;
    transition: transform 0.2s ease;
}
.faq-body {
    padding: 0 1.5rem 1.25rem 1.5rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.7;
}

.cta-banner {
    background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%);
    color: #FFFFFF;
    padding: 4.5rem 0;
    text-align: center;
    margin-top: 3rem;
}
.cta-banner h2 {
    color: #FFFFFF;
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 1rem;
}
.cta-banner p {
    color: #E2E8F0;
    font-size: 1.15rem;
    max-width: 650px;
    margin: 0 auto 2rem auto;
}
</style>

<!-- HERO SECTION -->
<section class="sec-hero">
    <div class="container">
        <div class="sec-hero-content">
            <span class="sec-hero-badge">Secured Loan Calculator</span>
            <h1 class="sec-hero-title">Loan Against Property EMI Calculator</h1>
            <p class="sec-hero-desc">Calculate your exact monthly payments, total interest liability, and amortization schedule for mortgage loans against residential or commercial properties.</p>
        </div>
    </div>
</section>

<!-- CALCULATOR SECTION -->
<section class="calc-section">
    <div class="container">
        <div class="calc-card">
            <div class="calc-grid">
                <!-- Inputs Column -->
                <div class="calc-inputs-col">
                    <!-- Property / Loan Amount -->
                    <div class="calc-input-block">
                        <div class="input-group-header">
                            <label class="input-label" for="lapAmt">Desired Loan Amount</label>
                            <div class="input-display-box">
                                <span class="input-prefix">₹</span>
                                <input type="number" id="lapAmtBox" class="input-display" value="2500000" min="500000" max="50000000" step="50000">
                            </div>
                        </div>
                        <input type="range" id="lapAmt" class="slider-input" min="500000" max="50000000" step="50000" value="2500000">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748B;">
                            <span>₹5 Lakhs</span>
                            <span>₹5 Crores</span>
                        </div>
                    </div>

                    <!-- Interest Rate -->
                    <div class="calc-input-block">
                        <div class="input-group-header">
                            <label class="input-label" for="lapRate">Interest Rate (p.a.)</label>
                            <div class="input-display-box">
                                <input type="number" id="lapRateBox" class="input-display" value="9.50" min="7.5" max="18" step="0.05">
                                <span class="input-suffix">%</span>
                            </div>
                        </div>
                        <input type="range" id="lapRate" class="slider-input" min="7.5" max="18" step="0.05" value="9.50">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748B;">
                            <span>7.5%</span>
                            <span>18%</span>
                        </div>
                    </div>

                    <!-- Loan Tenure -->
                    <div class="calc-input-block">
                        <div class="input-group-header">
                            <label class="input-label" for="lapTime">Loan Tenure</label>
                            <div class="input-display-box">
                                <input type="number" id="lapTimeBox" class="input-display" value="15" min="1" max="20" step="1">
                                <span class="input-suffix">Yrs</span>
                            </div>
                        </div>
                        <input type="range" id="lapTime" class="slider-input" min="1" max="20" step="1" value="15">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748B;">
                            <span>1 Year</span>
                            <span>20 Years</span>
                        </div>
                    </div>

                    <!-- Key Benefits Pill -->
                    <div style="background: #F1F5F9; border-radius: 12px; padding: 1rem 1.25rem; font-size: 0.88rem; color: #334155;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #1E3A8A; margin-bottom: 0.35rem;">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Did You Know?
                        </div>
                        Loan Against Property (LAP) offers lower interest rates than unsecured personal loans because your real estate acts as security, allowing larger loan limits and extended tenures up to 20 years.
                    </div>
                </div>

                <!-- Results Column -->
                <div class="results-panel">
                    <h2 class="results-title">LAP Repayment Summary</h2>

                    <!-- EMI Display -->
                    <div class="result-emi-box">
                        <span class="result-emi-lbl">Monthly EMI</span>
                        <span class="result-emi-val" id="resEMI">₹26,128</span>
                    </div>

                    <!-- Breakdown items -->
                    <div>
                        <div class="result-item">
                            <span class="result-lbl">Principal Loan Amount</span>
                            <span class="result-val" id="resPrincipal">₹25,00,000</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total Interest Payable</span>
                            <span class="result-val" id="resInterest" style="color: #EA580C;">₹22,03,091</span>
                        </div>
                        <div class="result-item">
                            <span class="result-lbl">Total Payment (Principal + Interest)</span>
                            <span class="result-val" id="resTotal" style="color: #1E3A8A;">₹47,03,091</span>
                        </div>
                    </div>

                    <!-- Donut Chart -->
                    <div class="chart-container">
                        <svg width="150" height="150" class="donut-svg" viewBox="0 0 160 160">
                            <!-- Background Circle (Total / Principal) -->
                            <circle cx="80" cy="80" r="60" fill="transparent" stroke="#2563EB" stroke-width="18"></circle>
                            <!-- Foreground Segment (Interest) -->
                            <circle id="donutSegment" cx="80" cy="80" r="60" fill="transparent" stroke="#EA580C" stroke-width="18" stroke-dasharray="376.99" stroke-dashoffset="176"></circle>
                        </svg>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-dot" style="background: #2563EB;"></span>
                                <span>Principal (<span id="pctPrincipal">53%</span>)</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot" style="background: #EA580C;"></span>
                                <span>Interest (<span id="pctInterest">47%</span>)</span>
                            </div>
                        </div>
                    </div>

                    <!-- CTA -->
                    <button class="btn-calc-apply open-apply-modal" type="button">Apply for Loan Online</button>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- IN-DEPTH EDUCATIONAL GUIDE -->
<section class="info-section">
    <div class="container">
        <div style="max-width: 860px; margin: 0 auto;">
            <div class="section-title-wrapper text-center" style="margin-bottom: 3rem;">
                <span class="section-tag" style="color: #00D09C; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Complete Guide</span>
                <h2 style="font-size: 2.25rem; color: #1E3A8A; font-weight: 800; margin-top: 0.5rem;">How Loan Against Property (LAP) Works</h2>
                <p style="color: #64748B; font-size: 1.05rem; margin-top: 0.5rem;">Understand the mathematics, eligibility parameters, and key advantages of mortgaging your property.</p>
            </div>

            <!-- Content Card 1: What is LAP -->
            <div class="info-card" style="margin-bottom: 2rem;">
                <h3>What is a Loan Against Property?</h3>
                <p>A <strong>Loan Against Property (LAP)</strong> is a secured mortgage loan facility where you pledge a freehold residential, commercial, or industrial real estate asset as collateral with a bank or NBFC. Because the loan is backed by physical property, lenders face minimal credit risk, allowing them to offer substantially higher loan sanctions, competitive interest rates (starting around 8.50% - 9.50% p.a.), and comfortable repayment periods up to 15-20 years.</p>
                <p>LAP funds come with no end-use restrictions, making them ideal for business expansion, debt consolidation, higher education, medical emergencies, or purchasing high-value assets.</p>
            </div>

            <!-- Content Card 2: Formula -->
            <div class="info-card" style="margin-bottom: 2rem;">
                <h3>How is Loan Against Property EMI Calculated?</h3>
                <p>Banks calculate your monthly LAP installments using the standard reducing balance amortization formula:</p>
                <div class="formula-box">
                    EMI = [P &times; R &times; (1 + R)<sup>N</sup>] / [(1 + R)<sup>N</sup> - 1]
                </div>
                <p>Where:</p>
                <ul>
                    <li><strong>P (Principal Loan Amount):</strong> The total loan sanctioned by the lender against your property valuation.</li>
                    <li><strong>R (Monthly Rate of Interest):</strong> Annual interest rate divided by 12 months and divided by 100 (e.g. 9.50% p.a. = 9.50 / 12 / 100 = 0.007916).</li>
                    <li><strong>N (Tenure in Months):</strong> Number of monthly installments (e.g., 15 years = 180 months).</li>
                </ul>
            </div>

            <!-- Content Card 3: Comparison with Personal Loan -->
            <div class="info-card" style="margin-bottom: 2rem;">
                <h3>Loan Against Property (LAP) vs Personal Loan</h3>
                <p>Both loan options serve personal and business liquidity needs, but their structural terms, collateral requirements, and borrowing limits differ significantly:</p>
                
                <div class="table-responsive">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Loan Against Property (LAP)</th>
                                <th>Personal Loan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Collateral</strong></td>
                                <td>Secured (Requires residential/commercial property)</td>
                                <td>Unsecured (Zero collateral or guarantor)</td>
                            </tr>
                            <tr>
                                <td><strong>Loan Amount</strong></td>
                                <td>₹5 Lakhs up to ₹10 Crores (Up to 70% of property value)</td>
                                <td>₹5,000 up to ₹1,00,000 (Paisa in Minutes) / ₹5 Lakhs</td>
                            </tr>
                            <tr>
                                <td><strong>Interest Rate</strong></td>
                                <td>Lower: 8.50% - 14.00% p.a.</td>
                                <td>10.49% - 28.00% p.a.</td>
                            </tr>
                            <tr>
                                <td><strong>Tenure</strong></td>
                                <td>Long: 5 to 20 Years</td>
                                <td>Short: 3 to 60 Months</td>
                            </tr>
                            <tr>
                                <td><strong>Processing Time</strong></td>
                                <td>7 to 15 Days (Legal &amp; technical property valuation)</td>
                                <td>Instant to 2 Hours (100% paperless digital KYC)</td>
                            </tr>
                            <tr>
                                <td><strong>Best For</strong></td>
                                <td>Large capital needs, business expansion, major outlays</td>
                                <td>Immediate emergencies, quick cash needs, small ticket expenses</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Content Card 4: Key Factors Affecting LAP EMI -->
            <div class="info-card" style="margin-bottom: 2rem;">
                <h3>Key Factors Affecting Your LAP EMI</h3>
                <ul>
                    <li><strong>Property Valuation &amp; LTV Margin:</strong> Lenders typically finance up to 50% to 70% of the independent market valuation of your property. Higher valuation yields higher loan eligibility.</li>
                    <li><strong>Interest Rate Type:</strong> Choosing between fixed and floating interest rates affects future EMI stability. Floating rates decrease when RBI cuts repo rates.</li>
                    <li><strong>Borrower Credit Score:</strong> A CIBIL credit score of 750 or above secures the lowest interest rate margins from leading banks.</li>
                    <li><strong>Tenure Selected:</strong> Opting for longer tenures (e.g. 15-20 years) reduces your monthly EMI outflow but increases overall cumulative interest payable. Use our slider to find your optimal balance.</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- FAQ SECTION -->
<section class="section section-bg" id="faqs" style="background: #F8FAFC; padding: 4.5rem 0;">
    <div class="container">
        <div class="section-title-wrapper text-center" style="margin-bottom: 2.5rem;">
            <span class="section-tag" style="color: #00D09C; font-weight: 700;">FAQs</span>
            <h2 style="font-size: 2.25rem; color: #1E3A8A; font-weight: 800; margin-top: 0.5rem;">Frequently Asked Questions</h2>
        </div>

        <div class="faq-container">
            <?php foreach ($page_faqs as $faq): ?>
            <div class="faq-item">
                <div class="faq-header" onclick="toggleFaq(this)">
                    <h3><?php echo htmlspecialchars($faq['question']); ?></h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <?php echo htmlspecialchars($faq['answer']); ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CTA BANNER -->
<section class="cta-banner">
    <div class="container">
        <h2>Need Immediate Financial Assistance?</h2>
        <p>Explore RBI-regulated instant personal loan options up to ₹1 Lakh with minimal paperwork and 2-hour digital disbursal.</p>
        <button class="btn btn-primary open-apply-modal" type="button" style="background: #00D09C; color: #064E3B; border-radius: 50px; padding: 0.85rem 2.25rem; font-weight: 700; font-size: 1.05rem; border: none; cursor: pointer;">Check Your Eligibility Online</button>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const lapAmt = document.getElementById('lapAmt');
    const lapAmtBox = document.getElementById('lapAmtBox');
    const lapRate = document.getElementById('lapRate');
    const lapRateBox = document.getElementById('lapRateBox');
    const lapTime = document.getElementById('lapTime');
    const lapTimeBox = document.getElementById('lapTimeBox');

    const resPrincipal = document.getElementById('resPrincipal');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const resEMI = document.getElementById('resEMI');
    const donutSegment = document.getElementById('donutSegment');
    const pctPrincipal = document.getElementById('pctPrincipal');
    const pctInterest = document.getElementById('pctInterest');

    function formatCurrency(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculate() {
        const P = parseFloat(lapAmt.value) || 0;
        const annualRate = parseFloat(lapRate.value) || 0;
        const years = parseFloat(lapTime.value) || 0;

        const R = annualRate / 12 / 100; // Monthly interest rate
        const N = years * 12; // Total months

        let emi = 0;
        if (R > 0 && N > 0) {
            // EMI formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
            emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        } else if (N > 0) {
            emi = P / N;
        }

        const totalAmt = emi * N;
        const interest = totalAmt - P;

        resPrincipal.textContent = formatCurrency(P);
        resInterest.textContent = formatCurrency(interest);
        resTotal.textContent = formatCurrency(totalAmt);
        resEMI.textContent = formatCurrency(emi);

        // Chart Update (circumference = 2 * PI * 60 = ~376.99)
        const circ = 2 * Math.PI * 60;
        const interestPct = totalAmt > 0 ? (interest / totalAmt) : 0;
        const principalPct = totalAmt > 0 ? (P / totalAmt) : 1;

        pctInterest.textContent = Math.round(interestPct * 100) + '%';
        pctPrincipal.textContent = Math.round(principalPct * 100) + '%';

        // stroke-dashoffset = circ * (1 - fraction)
        donutSegment.style.strokeDashoffset = circ * (1 - interestPct);
    }

    // Sync input box and slider
    function sync(slider, box, min, max) {
        slider.addEventListener('input', () => {
            box.value = slider.value;
            calculate();
        });
        box.addEventListener('input', () => {
            let val = parseFloat(box.value);
            if (!isNaN(val)) {
                if (val >= min && val <= max) {
                    slider.value = val;
                }
                calculate();
            }
        });
        box.addEventListener('blur', () => {
            let val = parseFloat(box.value);
            if (isNaN(val) || val < min) val = min;
            if (val > max) val = max;
            box.value = val;
            slider.value = val;
            calculate();
        });
    }

    sync(lapAmt, lapAmtBox, 500000, 50000000);
    sync(lapRate, lapRateBox, 7.5, 18);
    sync(lapTime, lapTimeBox, 1, 20);

    calculate();
});

function toggleFaq(header) {
    const item = header.parentElement;
    const body = item.querySelector('.faq-body');
    const svg = item.querySelector('.faq-icon-wrapper svg');
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    svg.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}
</script>

<?php include 'includes/footer.php'; ?>
