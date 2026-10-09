import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yangjiantao.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
});
