import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: 'localhost', 
    port: 5173,
    hmr: {
      host: undefined,
      clientPort: 443,
      protocol: 'wss'
    }
  },
  preview: {
    host: 'localhost', 
    port: 5173
  }
});