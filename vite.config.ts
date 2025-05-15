import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  base:'/herzen-map/',
  resolve: {
    alias: {
      '@': '/src',
      '@modules': '/src/modules'
    }
  }
});