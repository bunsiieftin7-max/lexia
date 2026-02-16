require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { initializeDatabase } = require('./config/database');
const { startCronJobs } = require('./jobs');

// Import routes
const statsRoutes = require('./routes/stats.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const badgesRoutes = require('./routes/badges.routes');
const questionsRoutes = require('./routes/questions.routes');
const flashcardRoutes = require('./routes/flashcard.routes');
const qcmRoutes = require('./routes/qcm.routes');
const streakRoutes = require('./routes/streak.routes');
const plannerRoutes = require('./routes/planner.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/flashcard', flashcardRoutes);
app.use('/api/qcm', qcmRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/planner', plannerRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Drept Academy API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      notifications: '/api/notifications',
      badges: '/api/badges',
      questions: '/api/questions',
      flashcard: '/api/flashcard',
      qcm: '/api/qcm',
      streak: '/api/streak',
      planner: '/api/planner'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Erreur serveur:', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue' 
      : err.message
  });
});

// Initialize and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    logger.info('Base de données connectée');

    // Start cron jobs if enabled
    if (process.env.ENABLE_CRON_JOBS === 'true') {
      startCronJobs();
      logger.info('Jobs planifiés démarrés');
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`📍 Environnement: ${process.env.NODE_ENV}`);
      logger.info(`🌐 URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
    });
  } catch (error) {
    logger.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt gracieux...');
  process.exit(0);
});

startServer();

module.exports = app;
