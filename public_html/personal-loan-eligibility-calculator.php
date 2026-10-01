<?php
$page_title = "Personal Loan Eligibility Calculator | Check Max Loan Limit Online";
$page_description = "Calculate your personal loan eligibility online based on monthly salary, existing EMIs, interest rate, and tenure using our RBI compliant FOIR calculator.";
$canonical_url = "https://paisainminutes.com/personal-loan-eligibility-calculator";
$human_name = "Personal Loan Eligibility Calculator";

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
            <h1 class="sec-hero-title">Personal Loan Eligibility Calculator</h1>
            <p class="sec-hero-desc">Estimate your maximum borrowing limit. Calculate eligible Personal Loan amounts based on salary incomes, rates, and existing EMI obligations.</p>
        </div>
    </div>
</section>

<!-- CALCULATOR SECTION -->
<section class="calc-section">
    <div class="container">
        <?php
        $calc_config = [
            'id'          => 'personalLoanCalc',
            'salary_val'  => 50000,
            'salary_min'  => 15000,
            'salary_max'  => 500000,
            'salary_step' => 1000,
            'emi_val'     => 10000,
            'emi_min'     => 0,
            'emi_max'     => 250000,
            'emi_step'    => 500,
            'rate_val'    => 10.99,
            'rate_min'    => 8,
            'rate_max'    => 24,
            'rate_step'   => 0.1,
            'tenure_val'  => 5,
            'tenure_min'  => 1,
            'tenure_max'  => 5,
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
                    <h3 class="faq-question">What is FOIR and how does it affect loan eligibility?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        FOIR stands for Fixed Obligation to Income Ratio. It is the percentage of your monthly income that goes towards debt repayments. Most lenders cap FOIR at 50% to 60% for personal loans to ensure you retain sufficient cash for living expenses.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How can I increase my personal loan eligibility limits?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        You can boost your loan eligibility by: (1) closing active credit cards or micro-loans to lower your current EMIs, (2) applying with a co-borrower (like a working spouse), or (3) extending the loan repayment tenure.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Apply for Your Personal Loan Today</h2>
        <p>Get pre-approved personal loans up to ₹25 Lakhs with instant digital verification in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Online</button>
    </div>
</section>

<!-- Dedicated Loan Eligibility Calculator JavaScript Module -->
<script src="/js/loan-eligibility-calculator.js?v=<?php echo file_exists(__DIR__ . '/js/loan-eligibility-calculator.js') ? filemtime(__DIR__ . '/js/loan-eligibility-calculator.js') : '1'; ?>" defer></script>

<?php include 'includes/footer.php'; ?>
