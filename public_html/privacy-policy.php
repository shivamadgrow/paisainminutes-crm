<?php
$page_title = "Privacy Policy | Paisa in Minutes";
$page_description = "Review the Paisa in Minutes Privacy Policy covering customer data protection, DPDP Act 2023 compliance, credit bureau consent, and security standards.";
$page_keywords = "privacy policy, data security, paisa in minutes privacy, credit bureau consent";
include 'includes/header.php';
?>

<!-- Custom Styles for Policy Page -->
<style>
.policy-hero {
    background: var(--gradient-primary);
    padding: 7.5rem 0 4rem 0;
    color: var(--white);
    text-align: center;
}
.policy-hero-badge {
    display: inline-block;
    padding: 0.4rem 1.2rem;
    background: rgba(74, 141, 255, 0.18);
    color: #60A5FA;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(74, 141, 255, 0.3);
}
.policy-hero h1 {
    font-size: 2.8rem;
    font-family: var(--font-heading);
    font-weight: 800;
    color: #FFFFFF !important;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.policy-hero p {
    font-size: 1.1rem;
    color: #E2E8F0 !important;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
}
.policy-content-sec {
    padding: 4rem 0;
    background: var(--light-gray);
}
.policy-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    padding: 3rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    max-width: 900px;
    margin: 0 auto;
    color: var(--text-dark);
    line-height: 1.8;
}
.policy-card h2 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin: 2rem 0 1rem 0;
    font-family: var(--font-heading);
}
.policy-card h2:first-of-type {
    margin-top: 0;
}
.policy-card p {
    margin-bottom: 1rem;
    color: #4B5563;
}
.policy-card ul {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    color: #4B5563;
}
.policy-card li {
    margin-bottom: 0.5rem;
}
.policy-effective-date {
    display: inline-block;
    padding: 0.4rem 1rem;
    background: rgba(74, 141, 255, 0.1);
    color: var(--accent-color);
    border-radius: var(--border-radius-pill);
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
}
</style>

<section class="policy-hero">
    <div class="container">
        <span class="policy-hero-badge">Data Privacy</span>
        <h1>Privacy Policy</h1>
        <p>Transparency, trust, and complete data privacy for all everyday Indians.</p>
    </div>
</section>

<section class="policy-content-sec">
    <div class="container">
        <div class="policy-card">
            <span class="policy-effective-date">Last Updated: August 2026</span>

            <h2>1. Introduction & Regulatory Information</h2>
            <p>Welcome to <strong>Paisa in Minutes</strong> (paisainminutes.com). We operate as a digital loan facilitation platform acting solely as a lead generator for RBI-registered Non-Banking Financial Companies (NBFCs) and regulated lending institutions. We prioritize user privacy and handle all data in compliance with the Reserve Bank of India (RBI) Fair Practices Code, Digital Lending Guidelines, and applicable Indian Information Technology laws.</p>

            <h2>2. Information We Collect</h2>
            <p>To evaluate credit eligibility and facilitate seamless loan application processing through our lending partners, we collect the following personal and financial information:</p>
            <ul>
                <li><strong>Identity & Contact Data:</strong> Full Name, Mobile Number, Email Address, Residential Address, and Date of Birth.</li>
                <li><strong>Government Identifiers:</strong> Permanent Account Number (PAN) and Aadhaar details (voluntarily provided for digital KYC).</li>
                <li><strong>Financial & Employment Profile:</strong> Monthly income, employment type (salaried/self-employed), existing loan obligations, and credit history details.</li>
                <li><strong>Technical Data:</strong> IP Address, browser type, device information, and session logs for security and fraud prevention purposes.</li>
            </ul>

            <h2>3. Purpose of Data Collection & Credit Bureau Consent</h2>
            <p>By submitting your details on Paisa in Minutes, you explicitly authorize Paisa in Minutes and its lending partners to:</p>
            <ul>
                <li>Verify your credit profile by fetching your official credit score and credit report from RBI-authorized Credit Reporting Agencies (CIBIL, CRIF High Mark, Equifax, or Experian).</li>
                <li>Match your financial profile with eligible loan products offered by our registered partner NBFCs and banks.</li>
                <li>Contact you via Call, SMS, RCS, Email, or WhatsApp regarding application status, pre-approved loan offers, and financial updates.</li>
            </ul>

            <h2>4. Data Sharing & Third-Party Partners</h2>
            <p>Paisa in Minutes does not sell, rent, or lease your personal information to unverified third parties. We share data strictly with:</p>
            <ul>
                <li><strong>RBI-Registered Lenders:</strong> Regulated NBFCs and banks for evaluating and disbursing loan applications.</li>
                <li><strong>Technology & Service Providers:</strong> Verified verification gateways, OTP service providers, and cloud server partners bound by strict non-disclosure agreements.</li>
                <li><strong>Regulatory & Legal Authorities:</strong> Statutory bodies when mandated under Indian law or legal proceedings.</li>
            </ul>

            <h2>5. Data Security Standards</h2>
            <p>We enforce bank-grade security protocols to protect your personal data. All data transmitted between your device and our servers uses 256-bit SSL encryption. We employ strict access controls, firewalls, and regular security audits to prevent unauthorized data access or loss.</p>

            <h2>6. User Rights & Data Retention</h2>
            <p>You have the right to withdraw your consent for communications or request data correction at any time. We retain user data only for as long as necessary to fulfill the purposes for which it was collected or to comply with statutory legal requirements.</p>

            <h2>7. Contact Information</h2>
            <p>For any questions, data access requests, or privacy concerns, please contact our Compliance Team:</p>
            <p>
                <strong>Email:</strong> info@paisainminutes.com<br>
                <strong>Phone:</strong> +91 9990 666578<br>
                <strong>Office:</strong> Delhi, India
            </p>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
