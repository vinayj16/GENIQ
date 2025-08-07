import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
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
  
  // Log environment for debugging (only in development)
  if (mode === 'development') {
    console.log('Vite Mode:', mode);
    console.log('API URL:', env.VITE_API_URL);
  }
  
  return {
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
      host: true,
      proxy: {
        '/api': {
          target: 'https://geniq-ou4a.onrender.com',
          changeOrigin: true,
          secure: true,
          ws: true,
          headers: {
            'X-API-Key': 'prod_geniq_api_key_2024',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization, X-API-Key'
          },
          configure: (proxy) => {
            proxy.on('error', (err: Error) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq) => {
              console.log('Sending request to:', proxyReq.path);
              // Add API key header for production API
              proxyReq.setHeader('X-API-Key', 'prod_geniq_api_key_2024');
            });
            proxy.on('proxyRes', (proxyRes) => {
              console.log('Received response with status:', proxyRes.statusCode);
            });
          }
          // Remove pathRewrite - keep /api in the path
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: isProduction ? 'esbuild' : false,
      target: 'esnext',
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      },
      // Ensure proper asset paths in production
      assetsInlineLimit: 4096,
      cssCodeSplit: true
    },
    // Base URL for production
    base: isProduction ? '/' : '/',
    // Clear the screen on dev server start
    clearScreen: true,
    // Log level
    logLevel: isProduction ? 'warn' : 'info',
    // Environment variables
    envDir: '.',
    envPrefix: ['VITE_', 'PUBLIC_'],
    // Optimize deps for production
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },
    // Preview server config
    preview: {
      port: 4173,
      open: !process.env.CI
    }
  };
});
