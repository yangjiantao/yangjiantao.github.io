import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shanmeii.cn',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
});
