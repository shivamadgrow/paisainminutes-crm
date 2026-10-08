import fs from 'fs';
import { generateInvoicePdf, formatINR } from '../public_html/crm/src/utils/invoicePdf.js';

// Setup mock window/doc.save for Node environment
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {};
}

async function testPdfGeneration() {
  console.log('--- Testing Invoice PDF Generation ---');
  let failures = 0;
  const assert = (condition, name) => {
    if (condition) {
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name}`);
      failures++;
    }
  };

  const sampleInvoice = {
    invoiceNo: 'INV-2026-6024',
    partnerName: 'Rupay91',
    period: '07-10-2026 to 09-10-2026',
    dateIssued: '2026-10-07',
    dueDate: '2026-10-22',
    netCommission: 10000,
    gstRate: 18,
    gstAmount: 1800,
    totalPayable: 11800,
    status: 'Unpaid',
    sacCode: '998311',
    description: 'Affiliate commission for retail personal loans'
  };

  try {
    const result = await generateInvoicePdf(sampleInvoice);
    assert(result && result.success === true, 'generateInvoicePdf completes successfully');
    assert(result.filename === 'INV-2026-6024.pdf', 'filename matches invoiceNo (INV-2026-6024.pdf)');
    
    const arrayBuffer = result.doc.output('arraybuffer');
    assert(arrayBuffer.byteLength > 1000, `PDF output generated with size ${arrayBuffer.byteLength} bytes`);

    // Verify formatINR
    assert(formatINR(10000) === '10,000', 'formatINR(10000) === 10,000');
    assert(formatINR(900) === '900', 'formatINR(900) === 900');
    assert(formatINR(11800) === '11,800', 'formatINR(11800) === 11,800');

    // Test error handling on null invoice
    let errorThrown = false;
    try {
      await generateInvoicePdf(null);
    } catch (e) {
      errorThrown = true;
    }
    assert(errorThrown, 'Throws error when invoice data is null/undefined');

    console.log(`--- Finished PDF Tests: ${failures === 0 ? 'ALL PASSED' : failures + ' FAILED'} ---`);
    if (failures > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

testPdfGeneration();
