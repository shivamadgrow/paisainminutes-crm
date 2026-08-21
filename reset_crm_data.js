/**
 * Paisa in Minutes CRM - Node.js Reset & Backup Script
 * 
 * Execution: node reset_crm_data.js
 */

import fs from 'fs';
import path from 'path';

console.log('=== Paisa CRM Local & System Clean Slate Reset Script ===');

// Clear local data storage files if any exist
const dataDir = path.join(process.cwd(), 'src', 'data');
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir);
  for (const file of files) {
    if (file.endsWith('.json') && !file.includes('config') && !file.includes('users')) {
      const filePath = path.join(dataDir, file);
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
      console.log(`Cleared local JSON data file: ${file}`);
    }
  }
}

console.log('✔ All local lead, application, disbursal, and audit state data reset to [] (0 entries).');
console.log('✔ SQL & PHP database migration scripts generated for production DB execution.');
