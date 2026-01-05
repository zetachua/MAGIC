// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/MAGIC/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // This will proxy requests starting with /api
        target: 'http://localhost:5000', // Your backend server URL
        changeOrigin: true, // Needed for virtual hosts
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix when forwarding
      },
    },
  },
});