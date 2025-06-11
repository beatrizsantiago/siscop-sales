import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'sales',
      filename: 'remoteEntry.js',
      exposes: {
        './sales-app': './src/App/index.tsx',
      },
      shared: [
        'react',
        'react-dom',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled',
      ],
    }),
  ],
  server: {
    port: 3004,
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@usecases': path.resolve(__dirname, 'src/usecases'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@App': path.resolve(__dirname, 'src/App'),
      '@fb': path.resolve(__dirname, 'src/firebase'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@generalTypes': path.resolve(__dirname, 'src/types'),
    },
  },
  optimizeDeps: {
    exclude: ['@phosphor-icons/react'],
  },
})
