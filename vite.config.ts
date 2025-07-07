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
  define: {
    // 브라우저 환경에서 global을 window로 매핑
    global: 'window',
  },
  optimizeDeps: {
    // sockjs-client를 사전 번들링하여 define 치환이 적용되도록 함
    include: ['sockjs-client'],
  },
  ssr: {
    noExternal: ['styled-components', 'react-image-file-resizer'],
  },
});
