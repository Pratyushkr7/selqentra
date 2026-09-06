import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Refuse to ship a production build whose calls to action have nowhere to go. */
function requireContact(mode: string): Plugin {
  return {
    name: 'selqentra:require-contact',
    apply: 'build',
    buildStart() {
      const env = loadEnv(mode, process.cwd(), 'VITE_');
      if (mode === 'preview') return;
      if (!env.VITE_CONTACT_EMAIL || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(env.VITE_CONTACT_EMAIL)) {
        throw new Error('\n\n  Selqentra: VITE_CONTACT_EMAIL is not set (or is not an email address).\n  Set it in .env.local or your host\'s environment panel, then build again.\n  Use `vite build --mode preview` only for local layout checks.\n');
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), requireContact(mode)],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: { output: { manualChunks: { three: ['three'], gsap: ['gsap', 'gsap/ScrollTrigger'] } } },
  },
}));
