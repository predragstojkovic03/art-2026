import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@art-2026/shared': path.resolve(__dirname, '../../shared/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
