import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Load environment variables from .env file
import { config } from 'dotenv';

// Load environment variables
config({
  path: path.resolve(__dirname, '../.env')
});

console.log('🚀 Starting GENIQ Backend in production mode...');
console.log('📅', new Date().toISOString());
console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 10000);
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
    
    const port = process.env.PORT || 10000;
    const host = process.env.HOST || '0.0.0.0';
    
    // Start the server
    const server = startServer(port, () => {
      console.log(`✅ Server running on http://${host}:${port}`);
      console.log(`📊 Health check at http://${host}:${port}/health`);
    });
    
    // Log API key status
    const apiKey = process.env.VITE_API_KEY;
    console.log(`🔑 API Key loaded: ${apiKey ? '****' + apiKey.slice(-3) : 'Not set'}`);
    
    const googleApiKey = process.env.GOOGLE_AI_API_KEY;
    console.log(`🤖 Google AI API Key loaded: ${googleApiKey ? '****' + googleApiKey.slice(-4) : 'Not set'}`);
    
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💤 Process terminated!');
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:');
    console.error(error);
    process.exit(1);
  }
})();
