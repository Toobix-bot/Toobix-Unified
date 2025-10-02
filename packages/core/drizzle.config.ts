import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: '../../data/toobix-unified.db',
  },
  verbose: true,
  strict: true,
});
