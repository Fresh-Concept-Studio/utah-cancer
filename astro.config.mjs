import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://fresh-concept-studio.github.io';
const base = process.env.BASE_PATH ?? '/utah-cancer';

export default defineConfig({
  site,
  base,
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  server: { port: 4322 },
  devToolbar: { enabled: false },
});
