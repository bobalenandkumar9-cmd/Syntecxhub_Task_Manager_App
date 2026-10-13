import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, "/api" requests are forwarded to the Express backend,
// so no CORS configuration is needed while coding.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
