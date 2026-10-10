<?php
/**
 * Paisa in Minutes - Single Source of Truth for Financial Figures & Site Metadata
 * Harmonized with Title, Meta Descriptions, Header Schema, Amount-Tier Cluster, and Lead Modals
 */

if (!defined('PIM_FINANCIALS_LOADED')) {
    define('PIM_FINANCIALS_LOADED', true);

    define('FINANCIAL_MIN_INTEREST_RATE', '10.49% p.a.');
    define('FINANCIAL_MIN_INTEREST_RATE_NUM', 10.49);
    define('FINANCIAL_MAX_LOAN_AMOUNT', '₹1 Lakh');
    define('FINANCIAL_MAX_LOAN_AMOUNT_NUM', '1,00,000');
    define('FINANCIAL_MIN_LOAN_AMOUNT', '₹10,000');
    define('FINANCIAL_MIN_LOAN_AMOUNT_NUM', 10000);
    define('FINANCIAL_AGE_ELIGIBILITY', '21 to 60 years');
    define('FINANCIAL_TENURE_RANGE', '3 to 60 months');
    define('FINANCIAL_MIN_SALARY_METRO', '₹20,000 / month');
    define('FINANCIAL_MIN_SALARY_NON_METRO', '₹15,000 / month');
    define('FINANCIAL_PROCESSING_FEE', '1% to 3% (+ applicable GST)');
    define('FINANCIAL_MAX_PROCESSING_FEE', 'Up to 3% of loan amount + applicable GST');
    define('FINANCIAL_MAX_APR', 'Up to 24% p.a.');

    // Worked Example Figures (Compliant with <= 3% Processing Fee Cap)
    // Representative Example: Loan Amount: ₹1,00,000 | Tenure: 12 Months | Interest Rate: 10.49% p.a.
    define('EXAMPLE_LOAN_AMOUNT', 100000);
    define('EXAMPLE_LOAN_TENURE_MONTHS', 12);
    define('EXAMPLE_INTEREST_RATE_PA', '10.49%');
    define('EXAMPLE_PF_PERCENT', 2.0);
    define('EXAMPLE_PF_AMOUNT', 2000);          // 2% of ₹1,00,000 = ₹2,000
    define('EXAMPLE_GST_AMOUNT', 360);           // 18% GST on ₹2,000 = ₹360
    define('EXAMPLE_TOTAL_DEDUCTIBLES', 2360);   // PF + GST = ₹2,360
    define('EXAMPLE_IN_HAND_AMOUNT', 97640);     // ₹1,00,000 - ₹2,360 = ₹97,640
    define('EXAMPLE_MONTHLY_EMI', 8815);         // Monthly EMI @ 10.49% p.a. for 12 months
    define('EXAMPLE_TOTAL_INTEREST', 5780);      // Total interest paid over 12 months
    define('EXAMPLE_TOTAL_REPAYABLE', 105780);   // Principal + Total Interest = ₹1,05,780
}
