<?php
/**
 * Paisa in Minutes - Single Source of Truth for Financial Figures & Site Metadata
 */

if (!defined('PIM_FINANCIALS_LOADED')) {
    define('PIM_FINANCIALS_LOADED', true);

    define('FINANCIAL_MIN_INTEREST_RATE', '10.99% p.a.');
    define('FINANCIAL_MAX_LOAN_AMOUNT', '₹1 Lakh');
    define('FINANCIAL_MAX_LOAN_AMOUNT_NUM', '1,00,000');
    define('FINANCIAL_AGE_ELIGIBILITY', '21-60 years');
    define('FINANCIAL_TENURE_RANGE', '3 - 60 months');
    define('FINANCIAL_MIN_SALARY_METRO', '₹18,000');
    define('FINANCIAL_MIN_SALARY_NON_METRO', '₹15,000');
    define('FINANCIAL_MAX_PROCESSING_FEE', 'Up to 5% of loan amount + applicable GST');
    define('FINANCIAL_MAX_APR', 'Up to 48% p.a.');

    // Worked Example Figures (Compliant with <= 5% Processing Fee Cap)
    // Loan Amount: ₹30,000 | Duration: 3 Months | Interest Rate: 10.99% p.a.
    define('EXAMPLE_LOAN_AMOUNT', 30000);
    define('EXAMPLE_LOAN_TENURE_MONTHS', 3);
    define('EXAMPLE_INTEREST_RATE_PA', '10.99%');
    define('EXAMPLE_PF_PERCENT', 5.0);
    define('EXAMPLE_PF_AMOUNT', 1500);          // 5% of ₹30,000 = ₹1,500
    define('EXAMPLE_GST_AMOUNT', 270);           // 18% GST on ₹1,500 = ₹270
    define('EXAMPLE_TOTAL_DEDUCTIBLES', 1770);   // PF + GST = ₹1,770
    define('EXAMPLE_IN_HAND_AMOUNT', 28230);     // ₹30,000 - ₹1,770 = ₹28,230
    define('EXAMPLE_MONTHLY_EMI', 10184);        // EMI @ 10.99% p.a. for 3 months
    define('EXAMPLE_TOTAL_INTEREST', 552);       // (₹10,184 * 3) - ₹30,000 = ₹552
    define('EXAMPLE_TOTAL_REPAYABLE', 30552);    // ₹30,000 + ₹552 = ₹30,552
}
