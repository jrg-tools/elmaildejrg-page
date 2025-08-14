import path from 'node:path';
import node from '@astrojs/node';
import react from '@astrojs/react';
import clerk from '@clerk/astro';
import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '~': path.resolve('./'),
      },
    },
    define: {
      'process.env.PUBLIC_CLERK_PUBLISHABLE_KEY': JSON.stringify(
        process.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
      ),
    },
  },
  integrations: [react(), clerk({
    secretKey: process.env.CLERK_SECRET_KEY,
  })],
  env: {
    schema: {
      // client
      PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_API_URL: envField.string({ context: 'client', access: 'public', url: true }),
      // server
      CLERK_SECRET_KEY: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
