/**
 * Utility to export JavaScript array of objects to Excel-compatible CSV file.
 */
export function exportToCsv(filename, headers, rows) {
  if (!rows || rows.length === 0) {
    alert('No data records available to export.');
    return;
  }

  const escapeCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
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
