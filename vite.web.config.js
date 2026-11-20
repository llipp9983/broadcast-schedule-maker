import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 웹(HTML 한 파일) 빌드: 스크립트, 스타일, 폰트를 모두 index.html 안에 넣는다.
// file:// 로 열어도 동작해야 하므로 Electron용 CSP 메타 태그는 제거한다.
const stripCsp = () => ({
  name: 'strip-csp',
  transformIndexHtml: (html) => html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/i, ''),
});

export default defineConfig({
  plugins: [react(), viteSingleFile(), stripCsp()],
  base: './',
  build: { outDir: 'dist-web', assetsInlineLimit: 100000000, cssCodeSplit: false, emptyOutDir: true },
});
