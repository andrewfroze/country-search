import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/country-search/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
