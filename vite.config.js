import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Для GitHub Pages: npm run build:pages -- имя-репозитория
// или: npm run build -- --base /имя-репозитория/
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
