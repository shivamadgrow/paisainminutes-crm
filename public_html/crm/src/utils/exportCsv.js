import { isSuperAdmin } from './permissions.js';

function getCurrentUserSession() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem('paisa_crm_user');
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Utility to export JavaScript array of objects to Excel-compatible CSV file.
 * Security Note: Strictly restricted to Super Admin role.
 */
export function exportToCsv(filename, headers, rows) {
  const user = getCurrentUserSession();
  if (!isSuperAdmin(user)) {
    const errorMsg = '403 Forbidden: Data export is strictly restricted to Super Admin.';
    console.error(errorMsg);
    if (typeof alert === 'function') alert(errorMsg);
    return { ok: false, status: 403, error: errorMsg };
  }

  if (!rows || rows.length === 0) {
    alert('No data records available to export.');
    return { ok: false, status: 400, error: 'No data records available to export.' };
  }

  const escapeCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    let text = String(cell);
    // A cell that starts with = + - or @ would be run as a formula by Excel / Sheets (F-21): prefix an apostrophe.
    if (/^[=+\-@\t\r]/.test(text) && !/^\+?\d[\d\s-]*$/.test(text)) text = `'${text}`;
    const str = text.replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [];
  // Add Header Row
  csvRows.push(headers.map(escapeCell).join(','));

  // Add Data Rows
  for (const row of rows) {
    csvRows.push(row.map(escapeCell).join(','));
  }

  const csvString = csvRows.join('\r\n');
  // Include UTF-8 BOM for Microsoft Excel proper Hindi/Unicode rendering
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
