import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/OJM/' : '/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        myPage: resolve(root, 'my-page.html'),
        signIn: resolve(root, 'sign-in.html'),
        signUp: resolve(root, 'sign-up.html'),
      },
    },
  },
}));
