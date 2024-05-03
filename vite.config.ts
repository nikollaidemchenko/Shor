import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({}) => {
  return {
    base: `/`,
    plugins: [
      checker({
        typescript: true,
      }),
    ],
    server: {
      port: 8080,
    },
    build: {
      minify: 'terser',
    },
  };
});
