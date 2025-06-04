import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    cssMinify: true,
    ssr: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 API 서버
        changeOrigin: true,
      },
    },
  },
  ssr: {
    noExternal: ['styled-components'],
  },
});
