<?php
/**
 * Paisa in Minutes - Modular Loan Eligibility Calculator Widget
 * 
 * Reusable PHP component for Personal Loan, Home Loan, and general Eligibility calculations.
 * 
 * @param array $config Optional override configuration array
 */

$calc_id          = $calc_config['id'] ?? 'eligCalc_' . rand(100, 999);
$calc_salary_val  = $calc_config['salary_val'] ?? 50000;
$calc_salary_min  = $calc_config['salary_min'] ?? 15000;
$calc_salary_max  = $calc_config['salary_max'] ?? 500000;
$calc_salary_step = $calc_config['salary_step'] ?? 1000;

$calc_emi_val     = $calc_config['emi_val'] ?? 10000;
$calc_emi_min     = $calc_config['emi_min'] ?? 0;
$calc_emi_max     = $calc_config['emi_max'] ?? 250000;
$calc_emi_step    = $calc_config['emi_step'] ?? 500;

$calc_rate_val    = $calc_config['rate_val'] ?? 10.99;
$calc_rate_min    = $calc_config['rate_min'] ?? 6;
$calc_rate_max    = $calc_config['rate_max'] ?? 24;
$calc_rate_step   = $calc_config['rate_step'] ?? 0.05;

$calc_tenure_val  = $calc_config['tenure_val'] ?? 5;
$calc_tenure_min  = $calc_config['tenure_min'] ?? 1;
$calc_tenure_max  = $calc_config['tenure_max'] ?? 30;
$calc_tenure_step = $calc_config['tenure_step'] ?? 1;
?>

<div class="loan-eligibility-widget" data-loan-eligibility-calculator id="<?php echo htmlspecialchars($calc_id); ?>">
    <div class="calc-card">
        <div class="calc-grid">
            <!-- 1. Input Controls Column -->
            <div class="calc-controls-col">
                
                <!-- Net Monthly Income -->
                <div class="calc-control-group">
                    <div class="calc-control-header">
                        <label class="calc-label" for="<?php echo $calc_id; ?>_salaryBox">Net Monthly Income</label>
                        <div class="calc-input-pill">
                            <span class="calc-pill-prefix">₹</span>
                            <input 
                                type="number" 
                                id="<?php echo $calc_id; ?>_salaryBox" 
                                data-calc-input="salary-box" 
                                class="calc-num-input" 
                                value="<?php echo htmlspecialchars((string)$calc_salary_val); ?>" 
                                min="<?php echo htmlspecialchars((string)$calc_salary_min); ?>" 
                                max="<?php echo htmlspecialchars((string)$calc_salary_max); ?>" 
                                step="<?php echo htmlspecialchars((string)$calc_salary_step); ?>"
                                aria-label="Net Monthly Income in Rupees"
                            >
                        </div>
                    </div>
                    <label for="<?php echo $calc_id; ?>_salarySlider" class="sr-only">Adjust Net Monthly Income Slider</label>
                    <input 
                        type="range" 
                        id="<?php echo $calc_id; ?>_salarySlider" 
                        data-calc-input="salary-slider" 
                        class="calc-slider" 
                        min="<?php echo htmlspecialchars((string)$calc_salary_min); ?>" 
                        max="<?php echo htmlspecialchars((string)$calc_salary_max); ?>" 
                        step="<?php echo htmlspecialchars((string)$calc_salary_step); ?>" 
                        value="<?php echo htmlspecialchars((string)$calc_salary_val); ?>"
                        aria-label="Net Monthly Income Slider"
                        aria-valuemin="<?php echo htmlspecialchars((string)$calc_salary_min); ?>"
                        aria-valuemax="<?php echo htmlspecialchars((string)$calc_salary_max); ?>"
                        aria-valuenow="<?php echo htmlspecialchars((string)$calc_salary_val); ?>"
                    >
                </div>

                <!-- Existing Monthly EMIs -->
                <div class="calc-control-group">
                    <div class="calc-control-header">
                        <label class="calc-label" for="<?php echo $calc_id; ?>_emiBox">Existing Monthly EMIs</label>
                        <div class="calc-input-pill">
                            <span class="calc-pill-prefix">₹</span>
                            <input 
                                type="number" 
                                id="<?php echo $calc_id; ?>_emiBox" 
                                data-calc-input="emi-box" 
                                class="calc-num-input" 
                                value="<?php echo htmlspecialchars((string)$calc_emi_val); ?>" 
                                min="<?php echo htmlspecialchars((string)$calc_emi_min); ?>" 
                                max="<?php echo htmlspecialchars((string)$calc_emi_max); ?>" 
                                step="<?php echo htmlspecialchars((string)$calc_emi_step); ?>"
                                aria-label="Existing Monthly EMIs in Rupees"
                            >
                        </div>
                    </div>
                    <label for="<?php echo $calc_id; ?>_emiSlider" class="sr-only">Adjust Existing Monthly EMIs Slider</label>
                    <input 
                        type="range" 
                        id="<?php echo $calc_id; ?>_emiSlider" 
                        data-calc-input="emi-slider" 
                        class="calc-slider" 
                        min="<?php echo htmlspecialchars((string)$calc_emi_min); ?>" 
                        max="<?php echo htmlspecialchars((string)$calc_emi_max); ?>" 
                        step="<?php echo htmlspecialchars((string)$calc_emi_step); ?>" 
                        value="<?php echo htmlspecialchars((string)$calc_emi_val); ?>"
                        aria-label="Existing Monthly EMIs Slider"
                        aria-valuemin="<?php echo htmlspecialchars((string)$calc_emi_min); ?>"
                        aria-valuemax="<?php echo htmlspecialchars((string)$calc_emi_max); ?>"
                        aria-valuenow="<?php echo htmlspecialchars((string)$calc_emi_val); ?>"
                    >
                </div>

                <!-- Interest Rate (p.a.) -->
                <div class="calc-control-group">
                    <div class="calc-control-header">
                        <label class="calc-label" for="<?php echo $calc_id; ?>_rateBox">Interest Rate (p.a.)</label>
                        <div class="calc-input-pill">
                            <input 
                                type="number" 
                                id="<?php echo $calc_id; ?>_rateBox" 
                                data-calc-input="rate-box" 
                                class="calc-num-input" 
                                value="<?php echo htmlspecialchars((string)$calc_rate_val); ?>" 
                                min="<?php echo htmlspecialchars((string)$calc_rate_min); ?>" 
                                max="<?php echo htmlspecialchars((string)$calc_rate_max); ?>" 
                                step="<?php echo htmlspecialchars((string)$calc_rate_step); ?>"
                                aria-label="Interest Rate per annum percentage"
                            >
                            <span class="calc-pill-suffix">%</span>
                        </div>
                    </div>
                    <label for="<?php echo $calc_id; ?>_rateSlider" class="sr-only">Adjust Interest Rate Slider</label>
                    <input 
                        type="range" 
                        id="<?php echo $calc_id; ?>_rateSlider" 
                        data-calc-input="rate-slider" 
                        class="calc-slider" 
                        min="<?php echo htmlspecialchars((string)$calc_rate_min); ?>" 
                        max="<?php echo htmlspecialchars((string)$calc_rate_max); ?>" 
                        step="<?php echo htmlspecialchars((string)$calc_rate_step); ?>" 
                        value="<?php echo htmlspecialchars((string)$calc_rate_val); ?>"
                        aria-label="Interest Rate Slider"
                        aria-valuemin="<?php echo htmlspecialchars((string)$calc_rate_min); ?>"
                        aria-valuemax="<?php echo htmlspecialchars((string)$calc_rate_max); ?>"
                        aria-valuenow="<?php echo htmlspecialchars((string)$calc_rate_val); ?>"
                    >
                </div>

                <!-- Tenure (Duration) -->
                <div class="calc-control-group">
                    <div class="calc-control-header">
                        <label class="calc-label" for="<?php echo $calc_id; ?>_tenureBox">Tenure (Duration)</label>
                        <div class="calc-input-pill">
                            <input 
                                type="number" 
                                id="<?php echo $calc_id; ?>_tenureBox" 
                                data-calc-input="tenure-box" 
                                class="calc-num-input" 
                                value="<?php echo htmlspecialchars((string)$calc_tenure_val); ?>" 
                                min="<?php echo htmlspecialchars((string)$calc_tenure_min); ?>" 
                                max="<?php echo htmlspecialchars((string)$calc_tenure_max); ?>" 
                                step="<?php echo htmlspecialchars((string)$calc_tenure_step); ?>"
                                aria-label="Tenure Duration in Years"
                            >
                            <span class="calc-pill-suffix">Yrs</span>
                        </div>
                    </div>
                    <label for="<?php echo $calc_id; ?>_tenureSlider" class="sr-only">Adjust Tenure Duration Slider</label>
                    <input 
                        type="range" 
                        id="<?php echo $calc_id; ?>_tenureSlider" 
                        data-calc-input="tenure-slider" 
                        class="calc-slider" 
                        min="<?php echo htmlspecialchars((string)$calc_tenure_min); ?>" 
                        max="<?php echo htmlspecialchars((string)$calc_tenure_max); ?>" 
                        step="<?php echo htmlspecialchars((string)$calc_tenure_step); ?>" 
                        value="<?php echo htmlspecialchars((string)$calc_tenure_val); ?>"
                        aria-label="Tenure Duration Slider"
                        aria-valuemin="<?php echo htmlspecialchars((string)$calc_tenure_min); ?>"
                        aria-valuemax="<?php echo htmlspecialchars((string)$calc_tenure_max); ?>"
                        aria-valuenow="<?php echo htmlspecialchars((string)$calc_tenure_val); ?>"
                    >
                </div>

            </div>

            <!-- 2. Live Eligibility Summary Card Panel -->
            <div class="calc-summary-panel">
                <h3 class="calc-summary-title">Eligibility Summary</h3>
                
                <div class="calc-summary-row">
                    <span class="calc-summary-label">Monthly Salary</span>
                    <span class="calc-summary-val" data-calc-output="salary">₹0</span>
                </div>

                <div class="calc-summary-row">
                    <span class="calc-summary-label">Disposable EMI Limit</span>
                    <span class="calc-summary-val" data-calc-output="disposable-emi">₹0</span>
                </div>

                <div class="calc-summary-row total-row">
                    <span class="calc-summary-label total-label">Max Loan Eligible</span>
                    <span class="calc-summary-val highlight-total" data-calc-output="max-loan">₹0</span>
                </div>
            </div>
        </div>
    </div>
</div>
