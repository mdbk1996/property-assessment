import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/rentcast': {
        target: 'https://api.rentcast.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rentcast/, ''),
        headers: {
          'X-Api-Key': process.env.VITE_RENTCAST_API_KEY || '',
        },
      },
    },
  },
});
