import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Get the repository name for GitHub Pages
const base = process.env.NODE_ENV === 'production'
  ? '/aitural-ui/' // Corrected repository name
  : '/'

export default defineConfig({
  plugins: [vue()],
  base: base, // Set the base URL
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app'
    ],
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://52.90.3.212:8080',
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