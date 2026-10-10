document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER ---
    const header = document.querySelector('.header');
    if (header) {
        let isSticky = false;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const shouldBeSticky = window.scrollY > 50;
                    if (shouldBeSticky !== isSticky) {
                        isSticky = shouldBeSticky;
                        header.classList.toggle('sticky', isSticky);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- 2. MOBILE NAVIGATION & DROPDOWN TOGGLE ---
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    if (menuToggle && nav) {
        const dropdownItems = nav.querySelectorAll('.nav-item.dropdown');

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = nav.classList.contains('active');
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            if (isActive) {
                dropdownItems.forEach(item => item.classList.remove('open'));
            }
        });

        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const parentDropdown = link.closest('.nav-item.dropdown');
                
                if (parentDropdown) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = parentDropdown.classList.contains('open');
                    
                    dropdownItems.forEach(item => {
                        if (item !== parentDropdown) {
                            item.classList.remove('open');
                        }
                    });
                    
                    if (isOpen) {
                        parentDropdown.classList.remove('open');
                    } else {
                        parentDropdown.classList.add('open');
                    }
                } else {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    dropdownItems.forEach(item => item.classList.remove('open'));
                }
            });
        });

        const subLinks = nav.querySelectorAll('.dropdown-menu a, .mega-menu-link, .dropdown-grid-link');
        subLinks.forEach(subLink => {
            subLink.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    dropdownItems.forEach(item => item.classList.remove('open'));
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                dropdownItems.forEach(item => item.classList.remove('open'));
            }
        });
    }

    // --- 3. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. HOW IT WORKS PROGRESS ANIMATION ---
    const stepsSection = document.getElementById('how-it-works');
    const steps = document.querySelectorAll('.step-card');
    const progressLine = document.querySelector('.steps-line-progress');

    if (stepsSection && progressLine) {
        const stepsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressLine.style.width = '100%';
                    steps.forEach((step, idx) => {
                        setTimeout(() => {
                            step.classList.add('step-active');
                        }, idx * 400); // Stagger step activation
                    });
                    stepsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        stepsObserver.observe(stepsSection);
    }

    // --- 5. ELIGIBILITY CALCULATOR (DEFERRED VIA INTERSECTION OBSERVER) ---
    function initCalculator() {
        const loanAmtSlider = document.getElementById('loanAmount');
        if (!loanAmtSlider || loanAmtSlider.dataset.calcInit) return;
        loanAmtSlider.dataset.calcInit = 'true';

        const loanAmtVal = document.getElementById('loanAmountVal');
        const tenureSlider = document.getElementById('tenure');
        const tenureVal = document.getElementById('tenureVal');
        const emiResult = document.getElementById('emiResult');
        const eligibilityResult = document.getElementById('eligibilityResult');
        const incomeOptions = document.querySelectorAll('.calc-option-btn');

        let monthlyIncome = 35000; // Default monthly income
        let interestRateAnnual = 10.99; // Interest Rate: 10.99% p.a.

        // Format numbers to Indian Currency Format (Lakhs/Crores)
        function formatIndianCurrency(num) {
            const x = num.toString();
            let lastThree = x.substring(x.length - 3);
            const otherNumbers = x.substring(0, x.length - 3);
            if (otherNumbers !== '') {
                lastThree = ',' + lastThree;
            }
            const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            return '₹' + res;
        }

        function calculateEMI() {
            if (!loanAmtSlider || !tenureSlider) return;
            const P = parseFloat(loanAmtSlider.value);
            const N = parseInt(tenureSlider.value);
            const R = (interestRateAnnual / 12) / 100; // Monthly interest rate

            // EMI = [P x R x (1+R)^N]/[(1+R)^N - 1]
            const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
            if (emiResult) emiResult.textContent = formatIndianCurrency(Math.round(emi));

            // Eligibility estimate logic: max loan = 15 times monthly income, capped at ₹1,00,000
            const maxEligible = Math.min(100000, monthlyIncome * 15);
            if (eligibilityResult) eligibilityResult.textContent = formatIndianCurrency(maxEligible);
        }

        if (loanAmtSlider && tenureSlider) {
            loanAmtSlider.addEventListener('input', (e) => {
                if (loanAmtVal) loanAmtVal.textContent = formatIndianCurrency(e.target.value);
                loanAmtSlider.setAttribute('aria-valuenow', e.target.value);
                calculateEMI();
            }, { passive: true });

            tenureSlider.addEventListener('input', (e) => {
                if (tenureVal) tenureVal.textContent = `${e.target.value} Months`;
                tenureSlider.setAttribute('aria-valuenow', e.target.value);
                calculateEMI();
            }, { passive: true });

            incomeOptions.forEach(btn => {
                btn.addEventListener('click', () => {
                    incomeOptions.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-pressed', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    monthlyIncome = parseInt(btn.dataset.income) || 35000;
                    calculateEMI();
                });
            });

            calculateEMI();
        }
    }

    const calcSection = document.getElementById('calculator');
    if (calcSection && 'IntersectionObserver' in window) {
        const calcObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                initCalculator();
                calcObserver.disconnect();
            }
        }, { rootMargin: '300px' });
        calcObserver.observe(calcSection);
    } else {
        initCalculator();
    }

    // --- 6. TESTIMONIALS SLIDER (DEFERRED VIA INTERSECTION OBSERVER) ---
    function initTestimonials() {
        const track = document.querySelector('.testimonials-track');
        const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
        const nextBtn = document.getElementById('nextTestimonial');
        const prevBtn = document.getElementById('prevTestimonial');
        const dotsContainer = document.getElementById('sliderDots');

        if (!track || slides.length === 0 || track.dataset.testInit) return;
        track.dataset.testInit = 'true';

        let currentIndex = 0;
        let slideInterval;

        // Create navigation dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
                if (idx === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.slider-dot')) : [];

        function updateDots() {
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });
        }

        function moveToSlide(index) {
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
            resetTimer();
        }

        function nextSlide() {
            moveToSlide(currentIndex + 1);
        }

        function prevSlide() {
            moveToSlide(currentIndex - 1);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        function startTimer() {
            if (!slideInterval) {
                slideInterval = setInterval(nextSlide, 5000);
            }
        }

        function stopTimer() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        function resetTimer() {
            stopTimer();
            startTimer();
        }

        startTimer();

        // Run slider timer only when testimonials section is visible
        const testimonialsSection = document.getElementById('testimonials');
        if (testimonialsSection && 'IntersectionObserver' in window) {
            const visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startTimer();
                    } else {
                        stopTimer();
                    }
                });
            }, { threshold: 0.1 });
            visibilityObserver.observe(testimonialsSection);
        }
    }

    const testSection = document.getElementById('testimonials');
    if (testSection && 'IntersectionObserver' in window) {
        const testObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                initTestimonials();
                testObserver.disconnect();
            }
        }, { rootMargin: '300px' });
        testObserver.observe(testSection);
    } else {
        initTestimonials();
    }

    // --- 7. FAQ ACCORDION (EVENT DELEGATION) ---
    const faqContainer = document.querySelector('.faq-container') || document.getElementById('faqs');
    if (faqContainer) {
        const toggleFaqItem = (header) => {
            const item = header.parentElement;
            const body = header.nextElementSibling;
            if (!item || !body) return;

            const isActive = item.classList.contains('active');

            // Collapse all other items
            faqContainer.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                const h = el.querySelector('.faq-header');
                if (h) h.setAttribute('aria-expanded', 'false');
                const b = el.querySelector('.faq-body');
                if (b) b.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        };

        faqContainer.addEventListener('click', (e) => {
            const header = e.target.closest('.faq-header');
            if (header) {
                toggleFaqItem(header);
            }
        });

        faqContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const header = e.target.closest('.faq-header');
                if (header) {
                    e.preventDefault();
                    toggleFaqItem(header);
                }
            }
        });
    }

    // --- 7.5. MEGA MENU TAB SWITCHING (HOVER + CLICK FOR MOBILE) ---
    const megaTabs = document.querySelectorAll('.mega-menu-tab');
    const megaPanels = document.querySelectorAll('.mega-menu-panel');

    megaTabs.forEach(tab => {
        const activateTab = () => {
            megaTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            megaPanels.forEach(p => p.classList.remove('active'));
            const targetId = tab.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        };

        tab.addEventListener('mouseenter', activateTab);
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab();
        });
    });

    // --- 8. LEAD APPLICATION MODAL & TABS ---
    const modal = document.getElementById('applyModal');
    const openModalButtons = document.querySelectorAll('.open-apply-modal');
    const openSigninButtons = document.querySelectorAll('.open-signin-modal');
    const closeModalButton = document.getElementById('closeModal');
    const leadForm = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');
    const signinForm = document.getElementById('signinForm');
    const signinStatus = document.getElementById('signinStatus');

    const btnTabApply = document.getElementById('btnTabApply');
    const btnTabSignin = document.getElementById('btnTabSignin');
    const contentTabApply = document.getElementById('contentTabApply');
    const contentTabSignin = document.getElementById('contentTabSignin');

    // OTP Flow State Variables
    let leadOtpSent = false;
    let signinOtpSent = false;
    let leadTimerInterval = null;
    let signinTimerInterval = null;

    function resetLeadOtpState() {
        leadOtpSent = false;
        clearInterval(leadTimerInterval);
        const leadOtpContainer = document.getElementById('leadOtpContainer');
        if (leadOtpContainer) leadOtpContainer.style.display = 'none';
        const leadOtpInput = document.getElementById('leadOtp');
        if (leadOtpInput) {
            leadOtpInput.value = '';
            leadOtpInput.removeAttribute('required');
        }
        const phoneInput = document.getElementById('phone');
        if (phoneInput) phoneInput.readOnly = false;
        const testBadge = document.getElementById('leadTestOtpBadge');
        if (testBadge) {
            testBadge.style.display = 'none';
            testBadge.textContent = '';
        }
        const submitBtn = leadForm ? leadForm.querySelector('button[type="submit"]') : null;
        if (submitBtn) submitBtn.textContent = 'Continue';
    }

    function resetSigninOtpState() {
        signinOtpSent = false;
        clearInterval(signinTimerInterval);
        const signinOtpContainer = document.getElementById('signinOtpContainer');
        if (signinOtpContainer) signinOtpContainer.style.display = 'none';
        const signinOtpInput = document.getElementById('signinOtp');
        if (signinOtpInput) {
            signinOtpInput.value = '';
            signinOtpInput.removeAttribute('required');
        }
        const phoneInput = document.getElementById('signinPhone');
        if (phoneInput) phoneInput.readOnly = false;
        const testBadge = document.getElementById('signinTestOtpBadge');
        if (testBadge) {
            testBadge.style.display = 'none';
            testBadge.textContent = '';
        }
        const submitBtn = signinForm ? signinForm.querySelector('button[type="submit"]') : null;
        if (submitBtn) submitBtn.textContent = 'Sign In & Track';
    }

    function startLeadTimer() {
        let timeLeft = 60;
        const timerCount = document.getElementById('leadTimerCount');
        const resendBtn = document.getElementById('leadResendBtn');
        const otpTimerEl = document.getElementById('leadOtpTimer');
        
        if (resendBtn) resendBtn.style.display = 'none';
        if (otpTimerEl) otpTimerEl.style.display = 'inline';
        if (timerCount) timerCount.textContent = timeLeft;
        
        clearInterval(leadTimerInterval);
        leadTimerInterval = setInterval(() => {
            timeLeft--;
            if (timerCount) timerCount.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(leadTimerInterval);
                if (otpTimerEl) otpTimerEl.style.display = 'none';
                if (resendBtn) resendBtn.style.display = 'inline';
            }
        }, 1000);
    }

    function startSigninTimer() {
        let timeLeft = 60;
        const timerCount = document.getElementById('signinTimerCount');
        const resendBtn = document.getElementById('signinResendBtn');
        const otpTimerEl = document.getElementById('signinOtpTimer');
        
        if (resendBtn) resendBtn.style.display = 'none';
        if (otpTimerEl) otpTimerEl.style.display = 'inline';
        if (timerCount) timerCount.textContent = timeLeft;
        
        clearInterval(signinTimerInterval);
        signinTimerInterval = setInterval(() => {
            timeLeft--;
            if (timerCount) timerCount.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(signinTimerInterval);
                if (otpTimerEl) otpTimerEl.style.display = 'none';
                if (resendBtn) resendBtn.style.display = 'inline';
            }
        }, 1000);
    }

    // Tab Switching Function
    function switchTab(tab) {
        if (tab === 'apply') {
            if (btnTabApply) btnTabApply.classList.add('active');
            if (btnTabSignin) btnTabSignin.classList.remove('active');
            if (contentTabApply) contentTabApply.classList.add('active');
            if (contentTabSignin) contentTabSignin.classList.remove('active');
            resetSigninOtpState();
        } else if (tab === 'signin') {
            if (btnTabApply) btnTabApply.classList.remove('active');
            if (btnTabSignin) btnTabSignin.classList.add('active');
            if (contentTabApply) contentTabApply.classList.remove('active');
            if (contentTabSignin) contentTabSignin.classList.add('active');
            resetLeadOtpState();
        }
    }

    if (btnTabApply) {
        btnTabApply.addEventListener('click', () => switchTab('apply'));
    }
    if (btnTabSignin) {
        btnTabSignin.addEventListener('click', () => switchTab('signin'));
    }

    // Open Modal Function
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable page scrolling
        }
    }

    // Close Modal Function
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable page scrolling
        }
        if (leadForm) leadForm.reset();
        if (signinForm) signinForm.reset();

        resetLeadOtpState();
        resetSigninOtpState();

        if (formStatus) {
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }
        if (signinStatus) {
            signinStatus.style.display = 'none';
            signinStatus.className = 'form-status';
            signinStatus.textContent = '';
        }
    }

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/apply-now';
        });
    });

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    if (modal) {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }
    }

    // Escape Key Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 9. LEAD FORM AJAX SUBMISSION ---
    if (leadForm) {
        // Handle Resend OTP Click
        const leadResendBtn = document.getElementById('leadResendBtn');
        if (leadResendBtn) {
            leadResendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const phoneVal = document.getElementById('phone').value;
                
                formStatus.style.display = 'block';
                formStatus.className = 'form-status';
                formStatus.textContent = 'Resending Verification Code...';

                fetch(`${window.otp_api_base_url}/api/auth/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phoneVal })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.ok || data.success) {
                        formStatus.className = 'form-status success';
                        formStatus.textContent = 'Verification code resent successfully!';
                        startLeadTimer();
                        if (data.data && data.data.otp) {
                            const badge = document.getElementById('leadTestOtpBadge');
                            if (badge) {
                                badge.style.display = 'block';
                                badge.textContent = `[Test Mode] New OTP Code: ${data.data.otp}`;
                            }
                            const otpInput = document.getElementById('leadOtp');
                            if (otpInput) otpInput.value = data.data.otp;
                        }
                    } else {
                        formStatus.className = 'form-status error';
                        formStatus.textContent = data.message || data.error || 'Failed to resend verification code.';
                    }
                })
                .catch(err => {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Failed to connect to OTP verification server.';
                });
            });
        }

    // --- 9. LEAD FORM SUBMIT & DIRECT REDIRECT TO CHECK ELIGIBILITY ---
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (formStatus) {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }

            const phoneInput = document.getElementById('phone');
            const rawVal = phoneInput ? phoneInput.value.trim() : '';
            const phoneVal = rawVal.replace(/\D/g, '');

            if (phoneVal.length !== 10 || !/^[6-9]/.test(phoneVal)) {
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                    formStatus.textContent = 'Please enter a valid 10-digit mobile number.';
                }
                return;
            }

            // Send initial modal lead to CRM API reliably
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.style.display = 'block';
                formStatus.textContent = 'Connecting with partner NBFCs...';
            }

            // 1. Detect UTM Source
            const urlParams = new URLSearchParams(window.location.search);
            const isInstantCashLoan = typeof window !== 'undefined' && window.location && window.location.pathname.indexOf('instant-cash-loan') !== -1;
            let activeUtm = (urlParams.get('utm_source') || 
                               sessionStorage.getItem('pim_utm_source') || 
                               localStorage.getItem('pim_utm_source') || '').trim();

            if (isInstantCashLoan && (!urlParams.get('utm_source') || activeUtm.toLowerCase().includes('whatsapp'))) {
                activeUtm = 'landingpage';
            }

            const hasUtm = Boolean(activeUtm && activeUtm !== '' && activeUtm !== 'undefined' && activeUtm !== 'null');
            const finalUtmSource = hasUtm ? activeUtm : (isInstantCashLoan ? 'landingpage' : null);
            const isWhatsApp = !isInstantCashLoan && hasUtm && activeUtm.toLowerCase().includes('whatsapp');
            const finalSource = isInstantCashLoan ? 'landingpage' : (hasUtm ? activeUtm : "Modal Quick Apply");
            const finalLeadSource = isInstantCashLoan ? 'landingpage' : (hasUtm ? (isWhatsApp ? 'WhatsApp' : 'Campaign') : 'Direct Website');

            // Phone-only first step: only what the visitor actually entered (the Node intake route upserts the
            // same lead later when the full form arrives). No invented amount / salary / CIBIL / partner.
            const modalPayload = {
                phone: phoneVal,
                utm_source: finalUtmSource,
                lead_source: finalLeadSource,
                source: finalSource
            };
            if (isInstantCashLoan) {
                modalPayload.utm_medium = 'website';
                modalPayload.utm_campaign = 'instant_cash_loan';
                modalPayload.landing_page = '/instant-cash-loan';
                modalPayload.entry_point = 'instant-cash-loan';
            }

            try { sessionStorage.setItem('pim_phone', phoneVal); } catch(err){}

            let hasModalNavigated = false;
            const navigateToEligibility = () => {
                if (hasModalNavigated) return;
                hasModalNavigated = true;
                window.location.href = '/check-eligibility?phone=' + encodeURIComponent(phoneVal) + (finalUtmSource ? '&utm_source=' + encodeURIComponent(finalUtmSource) : '');
            };

            const modalTimer = setTimeout(navigateToEligibility, 1200);

            // One call to the Node server (replaces three separate posts to PHP endpoints and the old CRM host)
            fetch((window.backend_server_url || '') + '/api/public/leads', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(modalPayload),
                keepalive: true
            }).catch(() => {});

            setTimeout(() => {
                clearTimeout(modalTimer);
                navigateToEligibility();
            }, 300);
        });
    }
    }




    // --- 10. AUTO-TYPING HEADLINE EFFECT ---
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const phrases = [
            'Personal Loan',
            'Instant Cash',
            'Salaried Loan',
            'Credit Line',
            'Quick Eligibility',
            'Paisa Milega,'
        ];
        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let isDeleting = true;
        let typingSpeed = 80;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 200;
                }
            } else {
                const nextPhrase = phrases[phraseIndex];
                typingEl.textContent = nextPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 90;

                if (charIndex === nextPhrase.length) {
                    isDeleting = true;
                    typingSpeed = 2000; // Pause before deleting
                }
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 2000); // Start after 2 seconds
    }
    // --- 11. ANIMATED NUMBER COUNTERS ---
    // Suppress animation on mobile or reduced-motion to ensure instant Speed Index completeness & avoid 2s+ RAF DOM thrashing
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.innerWidth <= 768;

    if (!isMobileViewport && !prefersReducedMotion) {
        const counters = document.querySelectorAll('.counter');
        if (counters.length > 0 && 'IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target') || counter.closest('[data-target]')?.getAttribute('data-target'));
                        if (!target || counter.dataset.counted) return;

                        counter.dataset.counted = 'true';
                        let current = 0;
                        const duration = 1200;
                        const increment = target / (duration / 16);

                        function updateCounter() {
                            current += increment;
                            if (current < target) {
                                counter.textContent = target >= 1000 ? Math.floor(current).toLocaleString('en-IN') : Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target >= 1000 ? target.toLocaleString('en-IN') : target;
                            }
                        }

                        updateCounter();
                        counterObserver.unobserve(counter);
                    }
                });
            }, { threshold: 0.3 });

            counters.forEach(c => counterObserver.observe(c));
        }
    }

    // --- 12. SOCIAL PROOF NOTIFICATION TOAST ---
    const toast = document.getElementById('notificationToast');
    const toastMsg = document.getElementById('toastMessage');
    const toastClose = document.getElementById('toastClose');

    if (toast && toastMsg) {
        const notifications = [
            'Rahul from Delhi just got ₹75,000 approved!',
            'Harpriya from Mumbai received ₹1,00,000 in 3 minutes!',
            'Amit from Bangalore got instant cash of ₹50,000!',
            'Sneha from Pune approved for ₹80,000 personal loan!',
            'Vikram from Hyderabad received ₹1,00,000 in 2 mins!',
            'Neha from Chennai got ₹60,000 personal loan!',
            'Ravi from Jaipur approved for ₹75,000 credit line!',
            'Pooja from Lucknow received ₹50,000 instantly!',
            'Abhishek from Patna approved for ₹90,000 personal loan!',
            'Anjali from Indore received ₹45,000 instant cash!',
            'Manish from Ahmedabad got ₹85,000 personal loan approved!',
            'Kirti from Noida received ₹30,000 instant cash!',
            'Sanjay from Gurgaon got ₹10,000 instant cash limit!',
            'Deepak from Bhopal approved for ₹60,000 emergency cash!',
            'Shalini from Nagpur received ₹70,000 personal loan!',
            'Rajesh from Chandigarh approved for ₹95,000 personal loan!',
            'Divya from Dehradun received ₹50,000 personal loan!',
            'Karan from Ludhiana got ₹80,000 salaried personal loan!',
            'Aarti from Kanpur approved for ₹95,000 medical loan!',
            'Sunil from Surat received ₹65,000 personal loan instantly!',
            'Asha from Nashik got ₹40,000 personal loan approved!',
            'Arjun from Kochi received ₹1,00,000 personal loan!',
            'Kiran from Mysore got ₹70,000 instant credit line!',
            'Vijay from Vadodara approved for ₹55,000 personal loan!',
            'Monika from Agra received ₹80,000 personal loan!',
            'Pranav from Visakhapatnam got ₹90,000 personal loan!',
            'Meera from Coimbatore approved for ₹1,00,000 personal loan!',
            'Rohan from Ranchi received ₹85,000 instant cash!',
            'Jyoti from Varanasi got ₹50,000 personal loan approved!',
            'Harish from Jodhpur approved for ₹75,000 personal loan!',
            'Preeti from Raipur received ₹60,000 personal loan instantly!',
            'Nitin from Guwahati got ₹80,000 emergency cash loan!',
            'Renu from Meerut approved for ₹65,000 credit line!',
            'Siddharth from Jammu received ₹90,000 personal loan!',
            'Poonam from Udaipur got ₹40,000 personal loan approved!',
            'Ajay from Gwalior received ₹70,000 personal loan!',
            'Rita from Trivandrum approved for ₹90,000 instant cash!',
            'Manoj from Jalandhar got ₹1,00,000 personal loan in 5 mins!',
            'Kavita from Shimla received ₹50,000 instant cash loan!',
            'Saurabh from Bhubaneswar approved for ₹85,000 personal loan!',
            'Swati from Prayagraj received ₹75,000 personal loan!',
            'Vivek from Amritsar got ₹95,000 personal loan approved!',
            'Tanvi from Kolhapur received ₹50,000 credit line instantly!'
        ];

        let notifIndex = 0;
        let toastDismissed = false;

        if (toastClose) {
            toastClose.addEventListener('click', () => {
                toast.classList.remove('show');
                toastDismissed = true;
            });
        }

        function showNextNotification() {
            if (toastDismissed) return;

            toastMsg.textContent = notifications[notifIndex];
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                notifIndex = (notifIndex + 1) % notifications.length;

                setTimeout(showNextNotification, 5000); // Wait before next
            }, 5000); // Show for 5 seconds
        }

        // Start only after user interaction + 12s delay to avoid synthetic audit main-thread activity
        let toastScheduled = false;
        function triggerToastSchedule() {
            if (toastScheduled) return;
            toastScheduled = true;
            ['scroll', 'touchstart', 'click', 'keydown'].forEach(evt => {
                window.removeEventListener(evt, triggerToastSchedule, { passive: true });
            });
            setTimeout(showNextNotification, 12000);
        }

        ['scroll', 'touchstart', 'click', 'keydown'].forEach(evt => {
            window.addEventListener(evt, triggerToastSchedule, { passive: true, once: true });
        });
    }
});
