/**
 * Amount and Salary Normalization Utilities for PaisaCRM
 * Resolves range string formats ("₹25,000 - ₹50,000") and corrupted concatenated numbers (e.g. 2500050000 -> 50000)
 */

export function cleanLoanAmount(raw) {
  if (raw === null || raw === undefined || raw === '') return 50000;
  
  // 1. If it's a string with range separators like '-', '–', '—', 'to'
  if (typeof raw === 'string') {
    const parts = raw.replace(/,/g, '').split(/[-–—to]/i).map(s => s.replace(/\D/g, '')).filter(Boolean);
    if (parts.length >= 2) {
      const n1 = Number(parts[0]);
      const n2 = Number(parts[1]);
      if (!isNaN(n2) && n2 > 0) return n2;
      if (!isNaN(n1) && n1 > 0) return n1;
    }
  }

  // 2. Numeric cleanup
  let num = Number(String(raw).replace(/[^\d.]/g, ''));
  if (isNaN(num) || num <= 0) return 50000;

  // 3. Detect and decode concatenated ranges (e.g. 2500050000 -> 25000 + 50000, 500010000 -> 5000 + 10000)
  if (num > 500000) {
    const s = String(Math.floor(num));
    for (let i = 3; i <= 6; i++) {
      if (i < s.length) {
        const p1 = Number(s.slice(0, i));
        const p2 = Number(s.slice(i));
        // Valid Indian retail loan ranges (1k to 10L)
        if (p1 >= 1000 && p1 <= 500000 && p2 >= 1000 && p2 <= 1000000 && p2 >= p1) {
          return p2; // Return the maximum/approved requested ticket
        }
      }
    }
    // Fallback if still abnormally huge
    if (num > 1000000) return 50000;
  }

  return num;
}

export function cleanSalary(raw, salVal, salRange) {
  // 1. Direct clean numeric sal_val takes highest priority
  if (salVal !== null && salVal !== undefined && salVal !== '') {
    const sv = Number(salVal);
    if (!isNaN(sv) && sv >= 5000 && sv <= 500000) {
      return sv;
    }
  }

  // 2. Check range string (e.g. "₹80,000–₹89,999", "₹70,000 - ₹79,999", "₹90,000+")
  const textToCheck = String(salRange || raw || '');
  if (
    textToCheck.includes('-') ||
    textToCheck.includes('–') ||
    textToCheck.includes('—') ||
    textToCheck.toLowerCase().includes('to')
  ) {
    const parts = textToCheck.replace(/,/g, '').split(/[-–—to]/i).map(s => s.replace(/\D/g, '')).filter(Boolean);
    if (parts.length >= 2) {
      const n1 = Number(parts[0]);
      const n2 = Number(parts[1]);
      if (!isNaN(n1) && !isNaN(n2) && n1 > 0 && n2 > 0) {
        return Math.round((n1 + n2) / 2);
      }
      if (!isNaN(n1) && n1 > 0) return n1;
    }
  }

  // 3. Numeric cleanup
  let num = Number(String(raw || '').replace(/[^\d.]/g, ''));
  if (isNaN(num) || num <= 0) return 30000;

  // 4. Detect concatenated salary range (e.g. 7000079999 -> 70000 + 79999 = 75000)
  if (num > 500000) {
    const s = String(Math.floor(num));
    if (s.length === 10) {
      const p1 = Number(s.slice(0, 5));
      const p2 = Number(s.slice(5));
      if (p1 >= 10000 && p1 <= 300000 && p2 >= 10000 && p2 <= 300000) {
        return Math.round((p1 + p2) / 2);
      }
    }
    for (let i = 4; i <= 6; i++) {
      if (i < s.length) {
        const p1 = Number(s.slice(0, i));
        const p2 = Number(s.slice(i));
        if (p1 >= 10000 && p1 <= 300000 && p2 >= 10000 && p2 <= 300000) {
          return Math.round((p1 + p2) / 2);
        }
      }
    }
    if (num > 500000) return 35000;
  }

  return num;
}

export function sanitizeLead(lead) {
  if (!lead) return lead;

  const rawLoan = lead.loanAmount || lead.applied || lead.loan_amount || lead.amount;
  const cleanedLoan = cleanLoanAmount(rawLoan);

  const rawSalary = lead.salary || lead.monthlySalary || lead.monthly_salary || lead.income;
  const cleanedSalary = cleanSalary(rawSalary, lead.sal_val, lead.salary_range);

  return {
    ...lead,
    applied: cleanedLoan,
    loanAmount: cleanedLoan,
    salary: cleanedSalary,
    monthlySalary: cleanedSalary
  };
}
