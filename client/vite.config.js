import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // TailwindCSS v4 — config lives in index.css, not a JS file
  ],
  server: {
    port: 5173,
    // Proxy API calls to the Express backend during local development
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
