/**
 * Paisa in Minutes — Loan Eligibility Calculator Module
 * 
 * Modular, accessible, and high-performance calculator implementing
 * tiered FOIR (Fixed Obligation to Income Ratio) and EMI-to-Principal formulations.
 *
 * @version 2.0.0
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.LoanEligibilityCalculator = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * FOIR (Fixed Obligation to Income Ratio) Configuration Tiers
     *
     * Concept & Rationale:
     * --------------------
     * FOIR is a standard credit assessment metric utilized by RBI-regulated banks & NBFCs.
     * It indicates the maximum percentage of an applicant's net monthly income that can be 
     * allocated towards servicing all fixed debt obligations (existing EMIs + proposed new loan EMI).
     * 
     * Why FOIR Scales with Income:
     * High-income borrowers have a higher absolute disposable income remaining even after accounting
     * for household living costs (rent, food, utility expenses). Consequently, financial institutions
     * permit higher FOIR thresholds (e.g. 60% for net salaries >= ₹75,000) compared to lower-income 
     * brackets (50%), enabling higher credit limits safely without inducing debt burden.
     */
    const DEFAULT_FOIR_TIERS = [
        { minIncome: 75000, foirPercent: 0.60 }, // 60% FOIR for ₹75,000+ monthly income
        { minIncome: 0,     foirPercent: 0.50 }  // 50% FOIR base tier (< ₹75,000)
    ];

    /**
     * Formats numbers into the Indian numbering system with ₹ currency symbol (e.g., ₹46,09,234)
     * 
     * @param {number} amount 
     * @returns {string} Formatted Indian Currency String
     */
    function formatIndianCurrency(amount) {
        if (isNaN(amount) || amount <= 0) return '₹0';
        const rounded = Math.round(amount);
        return '₹' + rounded.toLocaleString('en-IN');
    }

    /**
     * Calculates the Disposable EMI Limit available for the new loan.
     * 
     * Mathematical Formula:
     * ---------------------
     * Disposable EMI = Max(0, (Net Monthly Income × Applicable FOIR) − Existing Monthly EMIs)
     * 
     * @param {number} netIncome - Monthly net take-home income in INR
     * @param {number} existingEMI - Sum of all active monthly EMI commitments in INR
     * @param {Array<{minIncome: number, foirPercent: number}>} [foirTiers] - Custom FOIR configuration tiers
     * @returns {number} Net disposable monthly EMI capacity in INR
     */
    function calculateDisposableEMILimit(netIncome, existingEMI, foirTiers = DEFAULT_FOIR_TIERS) {
        const income = Math.max(0, parseFloat(netIncome) || 0);
        const obligations = Math.max(0, parseFloat(existingEMI) || 0);

        // Find applicable FOIR tier based on income
        let activeFoir = 0.50;
        for (const tier of foirTiers) {
            if (income >= tier.minIncome) {
                activeFoir = tier.foirPercent;
                break;
            }
        }

        const maxTotalPermissibleEMI = income * activeFoir;
        const disposableEMI = maxTotalPermissibleEMI - obligations;
        return Math.max(0, disposableEMI);
    }

    /**
     * Calculates the Maximum Eligible Loan Principal based on disposable EMI, interest rate, and tenure.
     * 
     * Standard EMI-to-Principal Reverse Amortization Formula:
     * ------------------------------------------------------
     * Standard Monthly EMI formula:
     *   E = P × [ R × (1+R)^N ] / [ (1+R)^N - 1 ]
     * 
     * Solving algebraically for Loan Principal (P):
     *   P = E / ( [ R × (1+R)^N ] / [ (1+R)^N - 1 ] )
     * 
     * Where:
     *   E = Disposable Monthly EMI Limit
     *   R = Monthly Fractional Interest Rate = (Annual Interest Rate / 12 / 100)
     *   N = Total Installment Months = (Tenure in Years × 12)
     *
     * @param {number} disposableEMI - Monthly disposable EMI capacity in INR
     * @param {number} annualRate - Annual interest rate in percent (e.g. 8.50 for 8.5%)
     * @param {number} tenureYears - Loan duration in years (e.g. 5, 20)
     * @returns {number} Maximum eligible loan principal amount in INR
     */
    function calculateMaxLoanEligible(disposableEMI, annualRate, tenureYears) {
        const emi = Math.max(0, parseFloat(disposableEMI) || 0);
        const rate = parseFloat(annualRate) || 0;
        const tenure = parseFloat(tenureYears) || 0;

        if (emi <= 0 || rate <= 0 || tenure <= 0) {
            return 0;
        }

        const R = (rate / 12) / 100; // Monthly fractional rate
        const N = tenure * 12;        // Total tenure in months

        const compoundFactor = Math.pow(1 + R, N);
        const emiFactor = (R * compoundFactor) / (compoundFactor - 1);

        if (!isFinite(emiFactor) || emiFactor <= 0) {
            return 0;
        }

        const maxPrincipal = emi / emiFactor;
        return isFinite(maxPrincipal) ? maxPrincipal : 0;
    }

    /**
     * Debounce utility for smooth slider dragging without UI stutter
     * @param {Function} func 
     * @param {number} waitMs 
     * @returns {Function}
     */
    function debounce(func, waitMs = 120) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), waitMs);
        };
    }

    /**
     * Calculator Instance Controller
     * Handles DOM queries, input-slider sync, ARIA attributes, and reactive recomputations.
     */
    class CalculatorInstance {
        constructor(containerEl, options = {}) {
            this.container = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
            if (!this.container) return;

            this.options = Object.assign({
                foirTiers: DEFAULT_FOIR_TIERS,
                debounceMs: 100
            }, options);

            this.initElements();
            if (this.hasRequiredElements()) {
                this.bindEvents();
                this.recalculate();
            }
        }

        initElements() {
            const root = this.container;
            this.elements = {
                salarySlider: root.querySelector('[data-calc-input="salary-slider"]') || root.querySelector('#plSalary, #hlSalary'),
                salaryBox: root.querySelector('[data-calc-input="salary-box"]') || root.querySelector('#plSalaryBox, #hlSalaryBox'),
                
                emiSlider: root.querySelector('[data-calc-input="emi-slider"]') || root.querySelector('#plExistEMI, #hlExistEMI'),
                emiBox: root.querySelector('[data-calc-input="emi-box"]') || root.querySelector('#plExistEMIBox, #hlExistEMIBox'),
                
                rateSlider: root.querySelector('[data-calc-input="rate-slider"]') || root.querySelector('#plEligRate, #hlEligRate'),
                rateBox: root.querySelector('[data-calc-input="rate-box"]') || root.querySelector('#plEligRateBox, #hlEligRateBox'),
                
                tenureSlider: root.querySelector('[data-calc-input="tenure-slider"]') || root.querySelector('#plEligTime, #hlEligTime'),
                tenureBox: root.querySelector('[data-calc-input="tenure-box"]') || root.querySelector('#plEligTimeBox, #hlEligTimeBox'),
                
                resSalary: root.querySelector('[data-calc-output="salary"]') || root.querySelector('#resSalary'),
                resDisposableEMI: root.querySelector('[data-calc-output="disposable-emi"]') || root.querySelector('#resNewEMI'),
                resMaxLoan: root.querySelector('[data-calc-output="max-loan"]') || root.querySelector('#resMaxLoan')
            };
        }

        hasRequiredElements() {
            const e = this.elements;
            return !!(e.salarySlider && e.salaryBox && e.emiSlider && e.emiBox && 
                      e.rateSlider && e.rateBox && e.tenureSlider && e.tenureBox &&
                      e.resSalary && e.resDisposableEMI && e.resMaxLoan);
        }

        bindEvents() {
            const e = this.elements;
            const debouncedRecalc = debounce(() => this.recalculate(), this.options.debounceMs);

            const setupPair = (slider, box, isFloat = false) => {
                // Slider drag/input event
                slider.addEventListener('input', () => {
                    box.value = slider.value;
                    slider.setAttribute('aria-valuenow', slider.value);
                    debouncedRecalc();
                });

                // Numeric input box commit events
                const handleBoxCommit = () => {
                    let val = isFloat ? parseFloat(box.value) : parseInt(box.value, 10);
                    const min = isFloat ? parseFloat(slider.min) : parseInt(slider.min, 10);
                    const max = isFloat ? parseFloat(slider.max) : parseInt(slider.max, 10);

                    if (isNaN(val)) val = min;
                    if (val < min) val = min;
                    if (val > max) val = max;

                    box.value = val;
                    slider.value = val;
                    slider.setAttribute('aria-valuenow', val);
                    this.recalculate();
                };

                box.addEventListener('change', handleBoxCommit);
                box.addEventListener('blur', handleBoxCommit);
                box.addEventListener('keydown', (evt) => {
                    if (evt.key === 'Enter') {
                        evt.preventDefault();
                        handleBoxCommit();
                    }
                });
            };

            setupPair(e.salarySlider, e.salaryBox, false);
            setupPair(e.emiSlider, e.emiBox, false);
            setupPair(e.rateSlider, e.rateBox, true);
            setupPair(e.tenureSlider, e.tenureBox, false);
        }

        recalculate() {
            const e = this.elements;
            const salary = parseFloat(e.salarySlider.value) || 0;
            const existingEMI = parseFloat(e.emiSlider.value) || 0;
            const annualRate = parseFloat(e.rateSlider.value) || 0;
            const tenureYears = parseFloat(e.tenureSlider.value) || 0;

            const disposableEMI = calculateDisposableEMILimit(salary, existingEMI, this.options.foirTiers);
            const rawMaxLoan = calculateMaxLoanEligible(disposableEMI, annualRate, tenureYears);
            const maxLoan = Math.min(100000, rawMaxLoan);

            // Update DOM displays
            e.resSalary.textContent = formatIndianCurrency(salary);
            e.resDisposableEMI.textContent = formatIndianCurrency(disposableEMI);
            e.resMaxLoan.textContent = formatIndianCurrency(maxLoan);
        }
    }

    /**
     * Auto-initializes all calculator widgets on the DOM
     */
    function initAll() {
        const containers = document.querySelectorAll('[data-loan-eligibility-calculator], .loan-eligibility-widget, .calc-section');
        containers.forEach(el => {
            if (!el.dataset.calcInitialized) {
                el.dataset.calcInitialized = 'true';
                new CalculatorInstance(el);
            }
        });
    }

    // Auto-init on DOM ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    return {
        DEFAULT_FOIR_TIERS,
        calculateDisposableEMILimit,
        calculateMaxLoanEligible,
        formatIndianCurrency,
        CalculatorInstance,
        initAll
    };
}));
