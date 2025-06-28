import path from 'node:path';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';
import tailwindcss from '@tailwindcss/vite';

// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // integrations: [clerk()],
  adapter: vercel(),
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '~': path.resolve('./'),
      },
    },
  },
  integrations: [react(), clerk()],
});
