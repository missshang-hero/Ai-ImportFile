import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import { resolve } from 'path';
import { APP_ID } from './src/config';

// https://vite.dev/config/
export default defineConfig(() => {
  const root = process.cwd();
  const base = process.env.npm_config_projectdir ? `/${process.env.npm_config_projectdir}/` : '/';
  return {
    root,
    base,
    plugins: [
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties'],
          ],
        },
      }),
      mkcert(),
    ],
    css: {
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: 'fet-proxy.xbanban.com',
      open: true,
      port: Number(APP_ID),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'static',
    },
  };
});
