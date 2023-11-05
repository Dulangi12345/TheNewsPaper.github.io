import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    workbox({
      globDirectory: 'build',
      globPatterns: ['**/*.{js,css,html,png}'],
      swDest: 'build/sw.js',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 10,
            },
          },
        },
      ],
    }),
  
  ],
})
