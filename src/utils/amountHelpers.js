/**
 * Amount and Salary Normalization Utilities for PaisaCRM
 * Resolves range string formats ("₹25,000 - ₹50,000") and corrupted concatenated numbers (e.g. 2500050000 -> 50000)
 */

export function cleanLoanAmount(raw) {
  if (raw === null || raw === undefined || raw === '' || raw === 0 || raw === '0') return 0;
  
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
  if (isNaN(num) || num <= 0) return 0;

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
    if (num > 1000000) return 0;
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
  if (isNaN(num) || num <= 0) return 0;

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
    if (num > 500000) return 0;
  }

  return num;
}

/**
 * Convert any timestamp/date to Indian Standard Time (IST, UTC+5:30)
 * Handles ISO strings with Z, SQL datetime strings, and UTC server formatted strings.
 */
export function formatToIST(dateInput) {
  if (!dateInput) return { date: 'Today', time: '', full: 'Today' };

  let dateObj = null;

  if (typeof dateInput === 'string') {
    let str = dateInput.trim();
    if (str.endsWith('Z') || (str.includes('T') && (str.includes('+') || str.includes('Z')))) {
      dateObj = new Date(str);
    } else if (str.includes('T') && !str.includes('+') && !str.endsWith('Z')) {
      dateObj = new Date(str + 'Z');
    } else if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(str)) {
      // SQL datetime without tz e.g. 2026-09-07 05:45:05 (written in UTC)
      dateObj = new Date(str.replace(' ', 'T') + 'Z');
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      dateObj = new Date(str + 'T00:00:00+05:30');
    } else if (/^\d{1,2}\s+[A-Za-z]{3,4}\s+\d{4},\s+\d{1,2}:\d{2}\s+(AM|PM)/i.test(str)) {
      if (/UTC|GMT/i.test(str)) {
        dateObj = new Date(str);
      } else {
        return {
          date: str.split(',')[0].trim(),
          time: (str.split(',')[1] || '').trim(),
          full: str
        };
      }
    } else {
      dateObj = new Date(str);
    }
  } else if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'number') {
    dateObj = new Date(dateInput < 1e11 ? dateInput * 1000 : dateInput);
  }

  if (!dateObj || isNaN(dateObj.getTime())) {
    return { date: String(dateInput || 'Today'), time: '', full: String(dateInput || 'Today') };
  }

  const datePart = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(dateObj).replace('Sept', 'Sep');

  const timePart = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(dateObj).toUpperCase();

  return {
    date: datePart,
    time: timePart,
    full: `${datePart}, ${timePart}`
  };
}

export function sanitizeLead(lead) {
  if (!lead) return lead;

  const rawLoan = lead.loanAmount || lead.applied || lead.loan_amount || lead.amount;
  const cleanedLoan = cleanLoanAmount(rawLoan);

  const rawSalary = lead.salary || lead.monthlySalary || lead.monthly_salary || lead.income;
  const cleanedSalary = cleanSalary(rawSalary, lead.sal_val, lead.salary_range);

  // Normalize creation date to Indian Standard Time (IST)
  const istTime = formatToIST(lead.created_at || lead.createdAt || lead.created || lead.timestamp || lead.date);

  return {
    ...lead,
    applied: cleanedLoan,
    loanAmount: cleanedLoan,
    salary: cleanedSalary,
    monthlySalary: cleanedSalary,
    created: istTime.full,
    created_time: istTime.time
  };
}

export function safeNumber(val, fallback = 0) {
  if (val === null || val === undefined || val === '') return fallback;
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

export function formatINR(val, fallback = '0') {
  if (val === null || val === undefined || val === '') return fallback;
  const n = Number(val);
  if (isNaN(n)) return fallback;
  return n.toLocaleString('en-IN');
}
