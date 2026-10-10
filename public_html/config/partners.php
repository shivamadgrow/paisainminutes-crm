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

// 4. UdhaarNow Logo
$udhaarnowDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="21" fill="%2316A34A">Udhaar<tspan fill="%231E3A8A">Now</tspan></text></svg>';
$udhaarnowLogoSrc = getPartnerLogoSrc('udhaarnow.png', $udhaarnowDataUri);

// 5. LoanWithin Logo
$loanwithinDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="21" fill="%2315803D">LOAN <tspan fill="%23000000">WITHIN</tspan></text></svg>';
$loanwithinLogoSrc = getPartnerLogoSrc('loanwithin.png', $loanwithinDataUri);

// 6. ShubhCash Logo
$shubhcashDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="22" fill="%23EA580C">Shubh<tspan fill="%2315803D">cash</tspan></text></svg>';
$shubhcashLogoSrc = getPartnerLogoSrc('shubhcash.png', $shubhcashDataUri);

// 7. Borrowera Logo
$borroweraDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="22" fill="%23EA580C">borrow<tspan fill="%231E3A8A">era</tspan></text></svg>';
$borroweraLogoSrc = getPartnerLogoSrc('borrowera.png', $borroweraDataUri);

// 8. Easy Fincare Logo
$easyfincareDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="20" fill="%231E293B">EASY <tspan fill="%23DC2626">FINCARE</tspan></text></svg>';
$easyfincareLogoSrc = getPartnerLogoSrc('easyfincare.png', $easyfincareDataUri);

// 9. Ticket 2 Loan Logo
$ticket2loanDataUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 60" width="260" height="60"><rect width="260" height="60" rx="10" fill="%23ffffff"/><text x="14" y="38" font-family="sans-serif" font-weight="900" font-size="21" fill="%23EA580C">Ticket<tspan fill="%23F59E0B">2Loan</tspan></text></svg>';
$ticket2loanLogoSrc = getPartnerLogoSrc('ticket2loan.png', $ticket2loanDataUri);

return [
    'rupay91' => [
        'slug' => 'rupay91',
        'name' => 'Rupay 91',
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
    'udhaarnow' => [
        'slug' => 'udhaarnow',
        'name' => 'UdhaarNow',
        'logo' => $udhaarnowLogoSrc,
        'local_logo' => $udhaarnowLogoSrc,
        'badge' => 'Verified Partner',
        'badge_text' => 'Direct Application',
        'badge_icon' => 'shield-check',
        'badge_type' => 'verified',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '30 - 90 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.8',
        'min_salary' => '₹35,000',
        'min_salary_val' => 35000,
        'min_cibil' => '500+',
        'min_cibil_val' => 500,
        'min_slab' => 1,
        'tier' => 'base',
        'eligibility_badge' => 'Matched (Flexible Credit Line)',
        'features' => [
            'Digital Pre-Matched Limit',
            'Minimal KYC Required',
            'Fast Application Processing'
        ],
        'target_url' => 'https://www.udhaarnow.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'loanwithin' => [
        'slug' => 'loanwithin',
        'name' => 'LoanWithin',
        'logo' => $loanwithinLogoSrc,
        'local_logo' => $loanwithinLogoSrc,
        'badge' => 'Verified Partner',
        'badge_text' => 'Direct Application',
        'badge_icon' => 'trophy',
        'badge_type' => 'trusted',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '60 - 120 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.9',
        'min_salary' => '₹45,000',
        'min_salary_val' => 45000,
        'min_cibil' => '550+',
        'min_cibil_val' => 550,
        'min_slab' => 2,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Direct Lender Application)',
        'features' => [
            'Paperless Fast Track Disbursal',
            'Zero Collateral Required',
            '100% Data Encrypted & Safe'
        ],
        'target_url' => 'https://www.loanwithin.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'shubhcash' => [
        'slug' => 'shubhcash',
        'name' => 'ShubhCash',
        'logo' => $shubhcashLogoSrc,
        'local_logo' => $shubhcashLogoSrc,
        'badge' => 'Direct Credit',
        'badge_text' => 'Quick Disbursal',
        'badge_icon' => 'flame',
        'badge_type' => 'popular',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'apr' => '14% – 24% p.a.',
        'tenure' => '30 - 60 Days',
        'processing_fee' => '1% – 3% of loan amount',
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => '4.9',
        'min_salary' => '₹35,000',
        'min_salary_val' => 35000,
        'min_cibil' => '500+',
        'min_cibil_val' => 500,
        'min_slab' => 1,
        'tier' => 'base',
        'eligibility_badge' => 'Matched (Quick Disbursal Partner)',
        'features' => [
            '100% Online Application',
            'Direct Bank Credit on Sanction',
            'Zero Prepayment Penalty'
        ],
        'target_url' => 'https://www.shubhcash.com/apply-now?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ],
    'borrowera' => [
        'slug' => 'borrowera',
        'name' => 'Borrowera',
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
        'name' => 'Easy Fincare',
        'logo' => $easyfincareLogoSrc,
        'local_logo' => $easyfincareLogoSrc,
        'badge' => 'Simplifying Finance',
        'badge_text' => 'Quick Disbursal',
        'badge_icon' => 'shield-check',
        'badge_type' => 'trusted',
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
    'ticket2loan' => [
        'slug' => 'ticket2loan',
        'name' => 'Ticket 2 Loan',
        'logo' => $ticket2loanLogoSrc,
        'local_logo' => $ticket2loanLogoSrc,
        'badge' => 'Smart • Simple',
        'badge_text' => 'Quick Disbursal',
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
        'min_salary' => '₹25,000',
        'min_salary_val' => 25000,
        'min_cibil' => '500+',
        'min_cibil_val' => 500,
        'min_slab' => 1,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Smart • Simple • Secure)',
        'features' => [
            'Smart, Simple & Secure Digital Process',
            'Direct Bank Credit on Sanction',
            '100% Paperless with Minimal Documentation'
        ],
        'target_url' => 'https://www.ticket2loan.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}'
    ]
];
