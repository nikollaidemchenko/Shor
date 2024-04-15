import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({}) => {
  return {
    base: `/`,
    plugins: [
      react({
        babel: {
          configFile: './.babelrc',
        },
      }),
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
