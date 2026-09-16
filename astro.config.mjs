import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://fresh-concept-studio.github.io',
  base: '/utah-cancer',
  output: 'static',
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  server: { port: 4322 },
  devToolbar: { enabled: false },
});
