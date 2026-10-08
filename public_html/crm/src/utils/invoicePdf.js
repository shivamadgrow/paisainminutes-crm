import { jsPDF } from 'jspdf';
import { PAISA_LOGO_BASE64 } from './logoBase64.js';

/**
 * Draws the Indian Rupee (₹) symbol as clean vector strokes at (x, y).
 * @param {jsPDF} doc
 * @param {number} x Left position (mm)
 * @param {number} y Baseline position (mm)
 * @param {number} size Size in points (default: 10)
 * @param {number[]} color RGB array e.g. [10, 57, 119]
 */
export function drawRupee(doc, x, y, size = 10, color = [15, 23, 42]) {
  const s = size / 10;
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.35 * s);

  // Top horizontal bar
  doc.line(x, y - 3.4 * s, x + 2.5 * s, y - 3.4 * s);
  // Second horizontal bar
  doc.line(x, y - 2.2 * s, x + 2.3 * s, y - 2.2 * s);
  // Vertical stem
  doc.line(x + 0.4 * s, y - 3.4 * s, x + 0.4 * s, y - 1.0 * s);
  // Upper curve (loop of R)
  doc.roundedRect(x + 0.4 * s, y - 3.4 * s, 1.6 * s, 1.7 * s, 0.6 * s, 0.6 * s, 'S');
  // Downward diagonal leg
  doc.line(x + 0.9 * s, y - 1.7 * s, x + 2.4 * s, y);
}

/**
 * Formats a number to Indian numbering system (e.g. 10,000 or 1,18,000).
 */
export function formatINR(val) {
  const num = Number(val || 0);
  return num.toLocaleString('en-IN');
}

/**
 * Generates and downloads a complete, professional Tax Invoice PDF
 * matching the exact information displayed in the CRM.
 *
 * @param {Object} invoice Invoice data from API / database
 * @returns {Promise<{ success: boolean, filename: string, doc: jsPDF }>}
 */
export async function generateInvoicePdf(invoice) {
  if (!invoice) {
    throw new Error('Invoice data is required to generate PDF');
  }

  const invoiceNo = String(invoice.invoiceNo || 'INV-2026-6024').trim();
  const filename = `${invoiceNo}.pdf`;

  // Financial calculations
  const netCommission = Number(invoice.netCommission || 0);
  const gstAmount = Number(
    invoice.gstAmount !== undefined && invoice.gstAmount !== null
      ? invoice.gstAmount
      : Math.round(netCommission * 0.18)
  );
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);
  const totalPayable = Number(
    invoice.totalPayable !== undefined && invoice.totalPayable !== null
      ? invoice.totalPayable
      : netCommission + gstAmount
  );

  const partnerName = invoice.partnerName || 'Lending Partner';
  const period = invoice.period || '—';
  const dateIssued = invoice.dateIssued || new Date().toISOString().slice(0, 10);
  const dueDate = invoice.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10);
  const status = invoice.status || 'Unpaid';
  const sacCode = invoice.sacCode || '998311';
  const description = invoice.description || 'Affiliate lead generation commission';

  // Initialize jsPDF A4 portrait document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // -------------------------------------------------------------
  // 1. TOP HEADER & LOGO
  // -------------------------------------------------------------
  let currentY = 16;

  // Add Company Logo if available
  if (PAISA_LOGO_BASE64) {
    try {
      doc.addImage('data:image/png;base64,' + PAISA_LOGO_BASE64, 'PNG', margin, currentY, 48, 14);
    } catch (e) {
      // Fallback text if image fail
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(10, 57, 119); // #0A3977
      doc.text('Paisa in Minutes', margin, currentY + 10);
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(10, 57, 119);
    doc.text('Paisa in Minutes', margin, currentY + 10);
  }

  // Right-side: TAX INVOICE Header & Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229); // #4F46E5 Indigo
  doc.text('TAX INVOICE', pageWidth - margin, currentY + 2, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(10, 57, 119); // #0A3977
  doc.text(invoiceNo, pageWidth - margin, currentY + 9, { align: 'right' });

  // Status Badge
  const isPaid = status.toLowerCase() === 'paid';
  const isOverdue = status.toLowerCase() === 'overdue';
  const badgeWidth = 26;
  const badgeHeight = 6.5;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = currentY + 12;

  if (isPaid) {
    doc.setFillColor(209, 250, 229); // Emerald 100
    doc.setDrawColor(167, 243, 208); // Emerald 200
    doc.setTextColor(5, 150, 105);   // Emerald 600
  } else if (isOverdue) {
    doc.setFillColor(254, 226, 226); // Rose 100
    doc.setDrawColor(254, 202, 202); // Rose 200
    doc.setTextColor(225, 29, 72);   // Rose 600
  } else {
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(253, 230, 138); // Amber 200
    doc.setTextColor(217, 119, 6);   // Amber 600
  }

  doc.setLineWidth(0.2);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(status.toUpperCase(), badgeX + badgeWidth / 2, badgeY + 4.5, { align: 'center' });

  currentY += 26;

  // Divider Line
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 7;

  // -------------------------------------------------------------
  // 2. BILLED FROM & BILLED TO DETAILS (Two Columns)
  // -------------------------------------------------------------
  const colWidth = (contentWidth - 10) / 2;
  const col1X = margin;
  const col2X = margin + colWidth + 10;
  const boxHeight = 36;

  // Left Box: BILLED FROM
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col1X, currentY, colWidth, boxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('BILLED FROM', col1X + 5, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('Paisa in Minutes', col1X + 5, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text('Adgrow Media Technologies Pvt Ltd', col1X + 5, currentY + 18);
  doc.text('GSTIN: 07AAICA8910B1ZT', col1X + 5, currentY + 23.5);
  doc.text('Nature of Services: Affiliate Marketing (SAC 998311)', col1X + 5, currentY + 29);

  // Right Box: BILLED TO
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(col2X, currentY, colWidth, boxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('BILLED TO', col2X + 5, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(partnerName, col2X + 5, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Billing Period: ${period}`, col2X + 5, currentY + 18);
  doc.text(`Issue Date: ${dateIssued}`, col2X + 5, currentY + 23.5);
  doc.text(`Due Date: ${dueDate}`, col2X + 5, currentY + 29);

  currentY += boxHeight + 8;

  // -------------------------------------------------------------
  // 3. INVOICE LINE ITEMS TABLE
  // -------------------------------------------------------------
  const tableHeaderHeight = 8;
  doc.setFillColor(10, 57, 119); // #0A3977 Dark Blue
  doc.roundedRect(margin, currentY, contentWidth, tableHeaderHeight, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  const colDescX = margin + 5;
  const colSacX = margin + 85;
  const colPeriodX = margin + 110;
  const colGstRateX = margin + 142;
  const colAmountX = pageWidth - margin - 5;

  doc.text('DESCRIPTION', colDescX, currentY + 5.2);
  doc.text('SAC CODE', colSacX, currentY + 5.2);
  doc.text('PERIOD', colPeriodX, currentY + 5.2);
  doc.text('GST RATE', colGstRateX, currentY + 5.2);
  doc.text('AMOUNT (INR)', colAmountX, currentY + 5.2, { align: 'right' });

  currentY += tableHeaderHeight;

  // Item Row
  const rowHeight = 14;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, rowHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Net Commission', colDescX, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(description.slice(0, 48), colDescX, currentY + 10);

  // SAC Code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(String(sacCode), colSacX, currentY + 7);

  // Period
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(period, colPeriodX, currentY + 7);

  // GST Rate
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('18%', colGstRateX, currentY + 7);

  // Net Amount
  const amountStr = formatINR(netCommission);
  const amountTextWidth = doc.getTextWidth(amountStr);
  const rupeeX = colAmountX - amountTextWidth - 3.5;

  drawRupee(doc, rupeeX, currentY + 7, 8.5, [15, 23, 42]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(amountStr, colAmountX, currentY + 7, { align: 'right' });

  currentY += rowHeight + 8;

  // -------------------------------------------------------------
  // 4. TAX BREAKDOWN & TOTAL CARD
  // -------------------------------------------------------------
  const summaryWidth = 92;
  const summaryX = pageWidth - margin - summaryWidth;
  const summaryHeight = 44;

  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, currentY, summaryWidth, summaryHeight, 2, 2, 'FD');

  let sY = currentY + 7;

  // Helper function to print a summary row with vector rupee
  const printSummaryRow = (label, valueNum, isBold = false, isHighlight = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(isHighlight ? 10 : 8.5);
    doc.setTextColor(isHighlight ? 10 : 71, isHighlight ? 57 : 85, isHighlight ? 119 : 105);
    doc.text(label, summaryX + 5, sY);

    const valStr = formatINR(valueNum);
    const valWidth = doc.getTextWidth(valStr);
    const rX = summaryX + summaryWidth - 5 - valWidth - 3.5;

    drawRupee(doc, rX, sY, isHighlight ? 10 : 8.5, isHighlight ? [10, 57, 119] : [15, 23, 42]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isHighlight ? 10 : 8.5);
    doc.setTextColor(isHighlight ? 10 : 15, isHighlight ? 57 : 23, isHighlight ? 119 : 42);
    doc.text(valStr, summaryX + summaryWidth - 5, sY, { align: 'right' });
  };

  printSummaryRow(`Net Commission (SAC ${sacCode})`, netCommission, true);
  sY += 6.5;
  printSummaryRow('CGST @ 9%', cgst);
  sY += 6.5;
  printSummaryRow('SGST @ 9%', sgst);
  sY += 5;

  // Total divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(summaryX + 4, sY, summaryX + summaryWidth - 4, sY);
  sY += 6.5;

  printSummaryRow('Total Payable', totalPayable, true, true);

  // Left-hand side note & payment status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Payment Status:', margin, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isPaid ? 5 : 217, isPaid ? 150 : 119, isPaid ? 105 : 6);
  doc.text(status, margin + 25, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Due Date:', margin, currentY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(dueDate, margin + 25, currentY + 18);

  currentY += summaryHeight + 14;

  // -------------------------------------------------------------
  // 5. LEGAL DECLARATION & SIGNATURE
  // -------------------------------------------------------------
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TERMS & NOTES', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('1. Reverse Charge Applicable: No', margin, currentY + 4);
  doc.text('2. Payment is due within 15 calendar days from the date of invoice issuance.', margin, currentY + 7.5);
  doc.text('3. This is a computer-generated tax invoice and does not require a physical signature.', margin, currentY + 11);

  // Signatory block
  const sigX = pageWidth - margin - 55;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 57, 119);
  doc.text('For Paisa in Minutes', sigX, currentY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('(Adgrow Media Technologies Pvt Ltd)', sigX, currentY + 5.5);
  doc.setFont('helvetica', 'italic');
  doc.text('Authorized Signatory', sigX, currentY + 11);

  // -------------------------------------------------------------
  // 6. SAVE & TRIGGER AUTOMATIC DOWNLOAD
  // -------------------------------------------------------------
  doc.save(filename);

  return {
    success: true,
    filename,
    doc
  };
}
