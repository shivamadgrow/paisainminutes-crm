import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          if (assetInfo.name && assetInfo.name.includes('logo')) {
            return 'assets/paisa-logo.png';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  }
})
