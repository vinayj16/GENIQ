import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Load environment variables
dotenv.config({
  path: path.join(__dirname, '../.env.production')
});

// Log environment info
console.log('🚀 Starting GENIQ Backend in production mode...');
console.log('📅', new Date().toISOString());
console.log('🌐 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', process.env.PORT || 5000);
console.log('🏠 Host:', process.env.HOST || '0.0.0.0');

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});

// Start the server with error handling
(async () => {
  try {
    // Dynamic import for ES modules
    const { startServer } = await import('./server.js');
    
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || '0.0.0.0';
    
    // Start the server
    const server = startServer();
    
    console.log(`✅ Server running on http://${host}:${port}`);
    console.log(`📊 Health check at http://${host}:${port}/health`);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err);
      app.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      app.close(() => {
        console.log('💤 Process terminated!');
      });
    });

  } catch (error) {
    console.error('FATAL ERROR:', error);
    process.exit(1);
  }
})();
