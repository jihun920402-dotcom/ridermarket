import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // 프론트엔드에서 /api로 시작하는 모든 요청을 백엔드(8080)로 전달
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 백엔드 컨트롤러가 @RequestMapping("/api") 구조라면 rewrite는 하지 않습니다.
        // 만약 백엔드에 /api가 없고 바로 /products라면 아래 주석을 해제하세요.
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})