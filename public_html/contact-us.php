<?php
$page_title = "Contact Us | Paisa in Minutes";
$page_description = "Get in touch with Paisa in Minutes. Have questions about loans, eligibility, or application status? Send us a message or reach our support team.";
$page_keywords = "contact us, paisa in minutes contact, customer support, loan enquiry, contact form";
include 'includes/header.php';
?>

<!-- CONTACT HERO SECTION -->
<section class="contact-hero">
    <div class="container" style="position: relative; z-index: 2;">
        <span class="contact-hero-badge">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0h-2v2h2V9z" clip-rule="evenodd"/></svg>
            We're Here To Help
        </span>
        <h1 style="color: #ffffff !important; font-size: 3.1rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
            Contact <span style="color: #4A8DFF;">Us</span>
        </h1>
        <p style="color: #94A3B8 !important; font-size: 1.15rem; max-width: 650px; margin: 0 auto; line-height: 1.65;">
            Have questions about instant personal loans, credit scores, or application status? Get in touch with our expert team today.
        </p>
    </div>
</section>

<!-- MAIN CONTACT CONTENT SECTION -->
<section class="contact-section">
    <div class="container">
        <div class="contact-grid">
            
            <!-- CONTACT INFO SIDEBAR -->
            <div class="contact-info-wrapper">
                <div class="contact-info-header">
                    <h2>Get In Touch</h2>
                    <p>Reach out to us directly or fill out the enquiry form. We aim to respond within 24 business hours.</p>
                </div>

                <div class="contact-card-list">
                    <div class="contact-card-item">
                        <div class="contact-icon">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div class="contact-details">
                            <h4>Our Address</h4>
                            <p>Delhi, India</p>
                        </div>
                    </div>

                    <div class="contact-card-item">
                        <div class="contact-icon">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <div class="contact-details">
                            <h4>Call Us</h4>
                            <p><a href="tel:+919990666578">+91 9990 666578</a></p>
                        </div>
                    </div>

                    <div class="contact-card-item">
                        <div class="contact-icon">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <div class="contact-details">
                            <h4>Email Us</h4>
                            <p><a href="mailto:info@paisainminutes.com">info@paisainminutes.com</a></p>
                        </div>
                    </div>

                    <div class="contact-card-item">
                        <div class="contact-icon">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div class="contact-details">
                            <h4>Business Hours</h4>
                            <p>Monday - Saturday: 9:30 AM - 6:30 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CONTACT FORM CARD (Matching user's reference mockup) -->
            <div class="contact-form-card">
                <span class="contact-form-subtitle">Send Message</span>
                <h2 class="contact-form-title">Contact Form</h2>

                <div id="contactStatus" class="form-status" style="display:none; margin-bottom: 1.5rem;"></div>

                <form id="contactUsForm" class="contact-form-element">
                    <div class="contact-form-grid">
                        
                        <!-- Full Name -->
                        <div class="form-group">
                            <label for="contactName" class="contact-label">Full Name</label>
                            <input type="text" id="contactName" name="name" class="contact-input" placeholder="Enter Full Name" required>
                        </div>

                        <!-- Mobile Number -->
                        <div class="form-group">
                            <label for="contactPhone" class="contact-label">Mobile Number</label>
                            <input type="tel" id="contactPhone" name="phone" class="contact-input" placeholder="Enter Mobile Number" pattern="[6-9][0-9]{9}" maxlength="10" required>
                        </div>

                        <!-- Email Address -->
                        <div class="form-group">
                            <label for="contactEmail" class="contact-label">Email Address</label>
                            <input type="email" id="contactEmail" name="email" class="contact-input" placeholder="Enter Email Address" required>
                        </div>

                        <!-- Subject -->
                        <div class="form-group">
                            <label for="contactSubject" class="contact-label">Subject</label>
                            <input type="text" id="contactSubject" name="subject" class="contact-input" placeholder="Enter Subject" required>
                        </div>
                    </div>

                    <!-- Message -->
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label for="contactMessage" class="contact-label">Message</label>
                        <textarea id="contactMessage" name="message" class="contact-textarea" rows="5" placeholder="Write Your Message" required></textarea>
                    </div>

                    <!-- Consent Checkbox Container Box (Tick option before paragraph) -->
                    <div class="contact-consent-box">
                        <label class="contact-checkbox-label">
                            <input type="checkbox" id="contactAgreeConsent" name="agree_consent" value="yes" required>
                            <span class="consent-text">
                                I agree to be contacted by the company regarding my enquiry. I confirm that the information provided by me is accurate and consent to the collection and use of my personal information for the purpose of responding to my request.
                            </span>
                        </label>
                    </div>

                    <!-- Submit Button -->
                    <div style="margin-top: 1.75rem;">
                        <button type="submit" id="btnSubmitContact" class="btn-contact-submit">
                            <span>Send Message</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="send-icon">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</section>

<!-- JavaScript AJAX handling -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactUsForm');
    const contactStatus = document.getElementById('contactStatus');
    const submitBtn = document.getElementById('btnSubmitContact');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            const agree = document.getElementById('contactAgreeConsent').checked;

            if (!name || !phone || !email || !message) {
                showStatus('Please fill in all required fields.', 'error');
                return;
            }

            if (!agree) {
                showStatus('Please check the consent box to proceed.', 'error');
                return;
            }

            // Disable button & set loading state
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';

            const formData = new FormData(contactForm);

            fetch('/submit-contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                if (data.status === 'success') {
                    showStatus(data.message || 'Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    showStatus(data.message || 'Failed to send message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Contact Form Error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                showStatus('An unexpected error occurred. Please try again later.', 'error');
            });
        });
    }

    function showStatus(msg, type) {
        if (!contactStatus) return;
        contactStatus.style.display = 'block';
        contactStatus.className = 'form-status ' + (type === 'success' ? 'status-success' : 'status-error');
        contactStatus.style.padding = '0.9rem 1.25rem';
        contactStatus.style.borderRadius = '12px';
        contactStatus.style.fontSize = '0.95rem';
        contactStatus.style.fontWeight = '500';
        
        if (type === 'success') {
            contactStatus.style.background = '#ECFDF5';
            contactStatus.style.color = '#065F46';
            contactStatus.style.border = '1px solid #A7F3D0';
        } else {
            contactStatus.style.background = '#FEF2F2';
            contactStatus.style.color = '#991B1B';
            contactStatus.style.border = '1px solid #FCA5A5';
        }
        
        contactStatus.textContent = msg;
    }
});
</script>

<?php include 'includes/footer.php'; ?>
