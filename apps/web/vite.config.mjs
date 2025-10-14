import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(new URL('.', import.meta.url)));

const htmlEntries = readdirSync(__dirname)
  .filter((file) => file.endsWith('.html'))
  .reduce((entries, file) => {
    const name = file.replace(/\.html$/, '');
    entries[name] = resolve(__dirname, file);
    return entries;
  }, {});

export default defineConfig({
  root: __dirname,
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: htmlEntries
    }
  }
});
