import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      proxy: proxyTarget
        ? {
          '/api': {
            target: proxyTarget,
            changeOrigin: true,
            secure: true,
            rewrite: (p) => p.replace(/^\/api/, ''),
            headers: {
              // Allow custom admin headers through proxy
              'X-Forwarded-Host': 'localhost:5173',
            },
          },
        }
        : undefined,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  }
})
