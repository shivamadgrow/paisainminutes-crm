<?php
$page_title = "Home Loan Eligibility Calculator | Check Maximum Housing Loan Limit";
$page_description = "Calculate your maximum home loan eligibility limit online based on net income, current monthly obligations, interest rates, and loan tenure up to 30 years.";
$canonical_url = "https://paisainminutes.com/home-loan-eligibility-calculator";
$human_name = "Home Loan Eligibility Calculator";

include 'includes/header.php';
?>

<!-- Loan Eligibility Calculator Stylesheet -->
<link rel="stylesheet" href="/css/loan-eligibility-calculator.css?v=<?php echo file_exists(__DIR__ . '/css/loan-eligibility-calculator.css') ? filemtime(__DIR__ . '/css/loan-eligibility-calculator.css') : '1'; ?>">

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
.calc-section .calc-card {
    margin-top: -4rem;
    position: relative;
    z-index: 10;
}
</style>

<!-- HERO SECTION -->
<section class="sec-hero">
    <div class="container">
        <div class="sec-hero-content">
            <span class="section-tag" style="color: var(--accent-color); font-weight: 700;">Calculator</span>
            <h1 class="sec-hero-title">Home Loan Eligibility Calculator</h1>
            <p class="sec-hero-desc">Estimate your maximum borrowing limit. Calculate eligible Home Loan amounts based on salary incomes, rates, and existing EMI obligations.</p>
        </div>
    </div>
</section>

<!-- CALCULATOR SECTION -->
<section class="calc-section">
    <div class="container">
        <?php
        $calc_config = [
            'id'          => 'homeLoanCalc',
            'salary_val'  => 100000,
            'salary_min'  => 25000,
            'salary_max'  => 1000000,
            'salary_step' => 5000,
            'emi_val'     => 20000,
            'emi_min'     => 0,
            'emi_max'     => 500000,
            'emi_step'    => 1000,
            'rate_val'    => 8.50,
            'rate_min'    => 6,
            'rate_max'    => 15,
            'rate_step'   => 0.05,
            'tenure_val'  => 20,
            'tenure_min'  => 5,
            'tenure_max'  => 30,
            'tenure_step' => 1
        ];
        include 'includes/loan-eligibility-calculator-widget.php';
        ?>
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
                    <h3 class="faq-question">What is FOIR in Home Loans?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        For home loans, banks allow a higher Fixed Obligation to Income Ratio (FOIR) up to 60% of your net monthly income, since home assets represent appreciating collateral security with longer repayment horizons.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Does credit score affect Home Loan eligibility?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes, absolutely. A credit score above 750 is highly recommended. Lenders offer the lowest home loan interest rates to borrowers with excellent credit histories and reject applicants with histories of defaults.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Apply for Your Home Loan Today</h2>
        <p>Get pre-approved home loans up to ₹10 Crores with instant online eligibility approvals.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Online</button>
    </div>
</section>

<!-- Dedicated Loan Eligibility Calculator JavaScript Module -->
<script src="/js/loan-eligibility-calculator.js?v=<?php echo file_exists(__DIR__ . '/js/loan-eligibility-calculator.js') ? filemtime(__DIR__ . '/js/loan-eligibility-calculator.js') : '1'; ?>" defer></script>

<?php include 'includes/footer.php'; ?>
