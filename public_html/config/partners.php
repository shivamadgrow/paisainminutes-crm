<?php
/**
 * Paisa in Minutes - Partner Companies Configuration
 */

// Helper to resolve logo src cleanly with 100% fallback reliability
if (!function_exists('getPartnerLogoSrc')) {
    function getPartnerLogoSrc($filename, $fallbackDataUri) {
        $possiblePaths = [
            __DIR__ . '/../assets/images/' . $filename,
            __DIR__ . '/../assets/' . $filename,
            __DIR__ . '/../assets/images/partners/' . $filename
        ];

        foreach ($possiblePaths as $path) {
            if (file_exists($path) && filesize($path) > 0) {
                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                if ($ext === 'svg') {
                    $mime = 'image/svg+xml';
                } elseif ($ext === 'jpg' || $ext === 'jpeg') {
                    $mime = 'image/jpeg';
                } elseif ($ext === 'webp') {
                    $mime = 'image/webp';
                } else {
                    $mime = 'image/png';
                }
                return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
            }
        }

        return $fallbackDataUri;
    }
}

// 1. Rupay 91 Logo
$rupayLogoSrc = getPartnerLogoSrc(
    'rupay91.png', 
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60"><rect width="220" height="60" rx="8" fill="%230F172A"/><text x="20" y="38" font-family="sans-serif" font-weight="bold" font-size="22" fill="%232563EB">RuPay<tspan fill="%2310B981">91</tspan></text></svg>'
);

// 2. Jhatpat Loans Logo
$jhatpatLoansDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="21" fill="%231E3A8A">JHATPAT <tspan fill="%2310B981">LOANS</tspan></text></svg>';
$jhatpatLoansLogoSrc = getPartnerLogoSrc('jhatpatloans.png', $jhatpatLoansDataUri);

// 3. Insta Rupees Logo
$instarupeesDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="20" fill="%23000000">INSTA <tspan fill="%23DC2626">RUPEES</tspan></text></svg>';
$instarupeesLogoSrc = getPartnerLogoSrc('instarupees.png', $instarupeesDataUri);

// 4. Borrowera Logo
$borroweraDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="22" fill="%23EA580C">borrow<tspan fill="%231E3A8A">era</tspan></text></svg>';
$borroweraLogoSrc = getPartnerLogoSrc('borrowera.png', $borroweraDataUri);

// 5. Easy Finca₹e Logo
$easyfincareDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="20" fill="%231E293B">EASY <tspan fill="%23DC2626">FINCA₹E</tspan></text></svg>';
$easyfincareLogoSrc = getPartnerLogoSrc('easyfincare.png', $easyfincareDataUri);

// 6. MoneyDot Logo
$moneydotDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" fill="%23ffffff"/><defs><linearGradient id="mdGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" stop-color="%230284C7"/><stop offset="100%25" stop-color="%23059669"/></linearGradient></defs><rect x="6" y="6" width="48" height="48" rx="12" fill="url(%23mdGrad)"/><circle cx="30" cy="30" r="14" fill="%230284C7"/><text x="30" y="36" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23ffffff" text-anchor="middle">₹</text><text x="64" y="39" font-family="sans-serif" font-weight="900" font-size="24" fill="%23059669">Money<tspan fill="%230052CC">dot</tspan></text></svg>';
$moneydotLogoSrc = getPartnerLogoSrc('moneydot.png', $moneydotDataUri);

return [
    'rupay91' => [
        'slug' => 'rupay91',
        'name' => 'Rupay 91',
        'partnerName' => 'Rupay 91',
        'displayName' => 'Rupay 91',
        'logo' => $rupayLogoSrc,
        'local_logo' => $rupayLogoSrc,
        'badge' => 'Verified Partner',
        'badge_text' => 'Direct Application',
        'badge_icon' => 'flame',
        'badge_type' => 'featured',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '30 - 90 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.9',
        'min_salary' => '₹50,000',
        'min_salary_val' => 50000,
        'min_cibil' => '700+',
        'min_cibil_val' => 700,
        'min_slab' => 5,
        'tier' => 'high',
        'eligibility_badge' => 'Matched for ₹50,000+ Salary & 700+ CIBIL',
        'features' => [
            'Fast Digital Process',
            'Direct Bank Account Disbursal',
            'Zero Physical Paperwork'
        ],
        'target_url' => 'https://loans.rupay91.com/login'
    ],
    'jhatpatloans' => [
        'slug' => 'jhatpatloans',
        'name' => 'Jhatpat Loans',
        'partnerName' => 'Jhatpat Loans',
        'displayName' => 'Jhatpat Loans',
        'logo' => $jhatpatLoansLogoSrc,
        'local_logo' => $jhatpatLoansLogoSrc,
        'badge' => 'Fast Verification',
        'badge_text' => 'Digital Verification',
        'badge_icon' => 'zap',
        'badge_type' => 'instant',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 0.8% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '30 - 90 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.9',
        'min_salary' => '₹30,000',
        'min_salary_val' => 30000,
        'min_cibil' => '600+',
        'min_cibil_val' => 600,
        'min_slab' => 3,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Digital Online Process)',
        'features' => [
            'Hassle Free Digital Process',
            'Direct Bank Transfer on Approval',
            '100% Digital & Paperless'
        ],
        'target_url' => 'https://www.jhatpatloans.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'instarupees' => [
        'slug' => 'instarupees',
        'name' => 'Insta Rupees',
        'partnerName' => 'Insta Rupees',
        'displayName' => 'Insta Rupees',
        'logo' => $instarupeesLogoSrc,
        'local_logo' => $instarupeesLogoSrc,
        'badge' => 'Direct Credit',
        'badge_text' => 'Direct Application',
        'badge_icon' => 'zap',
        'badge_type' => 'popular',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '30 - 60 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.8',
        'min_salary' => '₹40,000',
        'min_salary_val' => 40000,
        'min_cibil' => '550+',
        'min_cibil_val' => 550,
        'min_slab' => 2,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Online Evaluation)',
        'features' => [
            'Paperless Digital Sanction',
            'Fast Application Processing',
            'No Preclosure Charges'
        ],
        'target_url' => 'https://www.instarupees.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'borrowera' => [
        'slug' => 'borrowera',
        'name' => 'Borrowera',
        'partnerName' => 'Borrowera',
        'displayName' => 'Borrowera',
        'logo' => $borroweraLogoSrc,
        'local_logo' => $borroweraLogoSrc,
        'badge' => 'Fast Track',
        'badge_text' => 'Digital Verification',
        'badge_icon' => 'zap',
        'badge_type' => 'instant',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '30 - 90 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.9',
        'min_salary' => '₹45,000',
        'min_salary_val' => 45000,
        'min_cibil' => '600+',
        'min_cibil_val' => 600,
        'min_slab' => 3,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Instant Online Credit)',
        'features' => [
            '100% Paperless Application',
            'Speedy Digital Verification',
            'Direct Account Credit in Minutes'
        ],
        'target_url' => 'https://www.borrowera.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'easyfincare' => [
        'slug' => 'easyfincare',
        'name' => 'Easy Finca₹e',
        'partnerName' => 'Easy Finca₹e',
        'displayName' => 'Easy Finca₹e',
        'logo' => $easyfincareLogoSrc,
        'local_logo' => $easyfincareLogoSrc,
        'badge' => 'Simplifying Finance',
        'badge_text' => 'Quick Disbursal',
        'badge_icon' => 'zap',
        'badge_type' => 'instant',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '60 - 90 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.8',
        'min_salary' => '₹45,000',
        'min_salary_val' => 45000,
        'min_cibil' => '550+',
        'min_cibil_val' => 550,
        'min_slab' => 2,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Simplifying Finance)',
        'features' => [
            'Minimal Documentation Required',
            'Fast Loan Processing',
            'Zero Hidden Charges'
        ],
        'target_url' => 'https://www.easyfincare.com/apply-now?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'moneydot' => [
        'enabled' => true,
        'slug' => 'moneydot',
        'name' => 'MoneyDot',
        'partnerName' => 'MoneyDot',
        'displayName' => 'MoneyDot',
        'logo' => $moneydotLogoSrc,
        'local_logo' => $moneydotLogoSrc,
        'badge' => 'Personal Loan App',
        'badge_text' => 'Personal Loan App',
        'badge_icon' => 'zap',
        'badge_type' => 'featured',
        'max_amount' => '₹1,00,000',
        'interest_rate' => '24% – 60% per annum',
        'apr' => '24% – 60% p.a.',
        'tenure' => '3 - 12 Months',
        'processing_fee' => 'Up to 5.1% of loan amount',
        'gst' => 'Applicable GST on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '—',
        'min_salary' => 'Partner Criteria',
        'min_salary_val' => 15000,
        'min_cibil' => 'Partner Criteria',
        'min_cibil_val' => 300,
        'min_slab' => 1,
        'tier' => 'mid',
        'eligibility_badge' => 'Personal Loan App (Digital Eligibility)',
        'features' => [
            'Digital Loan Application via MoneyDot App',
            'Flexible Tenure from 3 to 12 Months',
            'Processing Fee: Up to 5.1% + GST'
        ],
        'target_url' => 'https://play.google.com/store/apps/details?id=com.yrs.moneydot&hl=en_IN',
        'app_package' => 'com.yrs.moneydot',
        'is_app' => true
    ]
];
