import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/admin/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, '../Shivam Data/paisainminutes/admin'),
    emptyOutDir: true,
  },
  server: {
    allowedHosts: true,
  },
})
