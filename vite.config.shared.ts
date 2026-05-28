// Shared Vite config used by every Task/Solution app.
// Each app's own vite.config.ts simply re-exports this, so there is ONE place
// that wires up the React plugin and ONE set of dependencies at the repo root.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // `root` defaults to the cwd, i.e. the individual app folder you run from.
  server: { open: true },
});
