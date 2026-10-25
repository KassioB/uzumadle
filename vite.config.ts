import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Fora do .gitignore (que lista dist): a Vercel não encontrava a pasta de saída com esse nome.
  build: { outDir: 'build' },
  server: { port: 5174 },
});
