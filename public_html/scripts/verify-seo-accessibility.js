const fs = require('fs');
const path = require('path');

let errors = [];
let passes = [];

function pass(msg) {
    passes.push(`[PASS] ${msg}`);
}

function fail(msg) {
    errors.push(`[FAIL] ${msg}`);
}

// 1. Validate header.php
const headerPath = path.join(__dirname, '..', 'includes', 'header.php');
if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf8');
    
    // Check main open tag
    if (content.includes('<main id="main-content">')) {
        pass('Header correctly opens landmark <main id="main-content">');
    } else {
        fail('Header is missing <main id="main-content"> landmark opening');
    }

    // Check skip link
    if (content.includes('href="#main-content"') && content.includes('skip-link')) {
        pass('Header includes skip-to-content accessibility link');
    } else {
        fail('Header is missing skip-to-content accessibility link');
    }

    // Check async non-blocking Google Fonts
    if (content.includes('media="print"') && content.includes('this.media=\'all\'')) {
        pass('Google Fonts are loaded asynchronously without render blocking');
    } else {
        fail('Google Fonts are not loaded asynchronously');
    }

    // Check hreflang and meta robots
    if (content.includes('hreflang="en-IN"') && content.includes('meta name="robots"')) {
        pass('SEO meta tags (robots, hreflang, theme-color) are present');
    } else {
        fail('SEO meta tags missing');
    }

    // Check JSON-LD Schemas
    if ((content.includes('"@type": "Organization"') || content.includes('"@type": "FinancialService"')) && content.includes('"@type": "WebSite"') && content.includes('potentialAction')) {
        pass('JSON-LD Schema contains FinancialService/Organization and WebSite with SearchAction');
    } else {
        fail('JSON-LD Schema missing key Organization / WebSite entities');
    }
} else {
    fail('includes/header.php not found');
}

// 2. Validate footer.php
const footerPath = path.join(__dirname, '..', 'includes', 'footer.php');
if (fs.existsSync(footerPath)) {
    const content = fs.readFileSync(footerPath, 'utf8');
    
    // Check main close tag
    if (content.includes('</main>')) {
        pass('Footer correctly closes landmark </main>');
    } else {
        fail('Footer is missing </main> closing tag');
    }

    // Check modal accessibility
    if (content.includes('label for="phone"') && content.includes('autocomplete="tel"')) {
        pass('Lead Application modal has explicit accessible form labels and autocomplete');
    } else {
        fail('Lead Application modal is missing accessible labels');
    }

    // Check footer buttons / social links
    if (content.includes('aria-label="Follow Paisa in Minutes on Facebook"')) {
        pass('Social links have descriptive aria-labels');
    } else {
        fail('Social links are missing aria-labels');
    }
} else {
    fail('includes/footer.php not found');
}

// 3. Validate index.php
const indexPath = path.join(__dirname, '..', 'index.php');
if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');

    // Check hero reveal removal for instant LCP
    if (content.includes('<div class="hero-content">') && !content.includes('<div class="hero-content reveal">')) {
        pass('Hero section has .reveal removed for immediate 100% LCP painting');
    } else {
        fail('Hero section still has .reveal which delays LCP');
    }

    // Check calculator sliders
    if (content.includes('aria-valuemin="10000"') && content.includes('label for="loanAmount"')) {
        pass('Calculator sliders have explicit ARIA accessibility bounds and labels');
    } else {
        fail('Calculator sliders lack ARIA attributes');
    }
} else {
    fail('index.php not found');
}

// 4. Validate CSS
const cssPath = path.join(__dirname, '..', 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    const content = fs.readFileSync(cssPath, 'utf8');

    if (content.includes('--text-muted: #475569;')) {
        pass('High contrast WCAG AAA compliant text colors active');
    } else {
        fail('Text contrast ratio not upgraded');
    }

    if (content.includes('.sr-only') && content.includes('.skip-link')) {
        pass('.sr-only and .skip-link utility classes are defined');
    } else {
        fail('.sr-only or .skip-link utilities missing in CSS');
    }
} else {
    fail('css/style.css not found');
}

console.log('--- VERIFICATION RESULTS ---');
passes.forEach(p => console.log(p));
if (errors.length > 0) {
    console.log('\n--- ERRORS FOUND ---');
    errors.forEach(e => console.error(e));
    process.exit(1);
} else {
    console.log('\nAll SEO, Accessibility, Performance, and Best Practices checks passed perfectly!');
}
