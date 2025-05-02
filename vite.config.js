import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath, URL } from 'node:url';

// Get the base path based on environment
const base = process.env.DEPLOY_ENV === 'GH_PAGES' 
  ? '/aitural-ui/' // For GitHub Pages
  : process.env.DEPLOY_ENV === 'DIGITAL_OCEAN'
    ? '/' // For Digital Ocean
    : '/' // For local development

export default defineConfig({
  plugins: [vue()],
  base: base, // Set the base URL
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsInlineLimit: 0, // Don't inline any assets
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',
      '52.90.3.212'
    ],
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Remove problematic headers
            proxyReq.removeHeader('sec-ch-ua');
            proxyReq.removeHeader('sec-ch-ua-mobile');
            proxyReq.removeHeader('sec-ch-ua-platform');
            proxyReq.removeHeader('sec-fetch-site');
            proxyReq.removeHeader('sec-fetch-mode');
            proxyReq.removeHeader('sec-fetch-dest');
            
            // Set only the headers we need
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('X-Chat-Id', '8dace3c3-4973-43c8-991e-23682d5341323682s53413 3');
            
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
}) 