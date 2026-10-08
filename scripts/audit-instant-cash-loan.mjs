import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetScript = path.resolve(__dirname, '..', 'public_html', 'scripts', 'audit-instant-cash-loan.mjs');
await import(pathToFileURL(targetScript).href);
