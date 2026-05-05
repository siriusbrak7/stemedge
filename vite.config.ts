import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
  },

  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-icons';
            return 'vendor';
          }

          if (id.includes('/src/data/mockData') || id.includes('/src/data/expansionTopics') || id.includes('/src/data/subjects')) {
            return 'curriculum-data';
          }

          if (id.includes('/src/components/interactives/')) {
            return 'interactive-shell';
          }
        },
      },
    },
  },
});
