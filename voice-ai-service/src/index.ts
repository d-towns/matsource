import express from 'express';
import cors from 'cors';
import { env, validateEnv } from './config/environment';
import routes from './routes';
import logger from './config/logger';
import { initSupabase } from './config/supabase';
import scheduler from './scheduler';

// Express app setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();
    
    // Initialize database connection
    await initSupabase();
    
    // Start the server
    const server = app.listen(env.port, () => {
      logger.info(`Server started on port ${env.port}`);
    });
    
    // Start the scheduler
    scheduler.start();
    
    // Handle graceful shutdown
    const handleShutdown = async () => {
      logger.info('Shutting down server...');
      
      // Stop the scheduler
      scheduler.stop();
      
      // Close server
      server.close(() => {
        logger.info('Server shut down successfully');
        process.exit(0);
      });
      
      // Force exit after timeout
      setTimeout(() => {
        logger.error('Forcing server shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
    
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer(); 