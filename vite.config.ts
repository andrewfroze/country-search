import { defineConfig } from 'vite';

export default defineConfig({
  base: '/country-search/',
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
});
