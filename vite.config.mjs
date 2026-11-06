import { defineConfig } from 'vite';

export default defineConfig({
  base: '/warehouse-catalog/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
