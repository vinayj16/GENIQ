import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import type { UserConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  // Create Vite config object
  const config: UserConfig = {
    plugins: [react()],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.NODE_ENV === 'production' 
        ? 'https://geniq-mtkc.onrender.com' 
        : 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
          configure: (proxy) => {
            proxy.on('error', (err: Error) => {
              // eslint-disable-next-line no-console
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req) => {
              // eslint-disable-next-line no-console
              console.log('Proxying request:', req.method, req.url);
            });
          },
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      target: 'es2015',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: undefined // Disable manual chunking to avoid build issues
        }
      }
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  };

  return config;
});
