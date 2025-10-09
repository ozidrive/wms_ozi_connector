import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { validateApiKey } from './middleware/apiKeyCheck';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import inventoryRouter from './routes/inventory';
import returnsRouter from './routes/returns';
import authRouter from './routes/auth';
import pidgeRouter from './routes/pidge';
import formRouter from './routes/form';
import sequelize from './config/database';
import { SERVER_CONFIG } from './config/constants';

const app = express();
app.use(express.json());
app.use(cors());
app.use(validateApiKey);

app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/inventory', inventoryRouter);
app.use('/returns', returnsRouter);
app.use('/auth', authRouter);
app.use('/pidge', pidgeRouter);
app.use('/', formRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (optional - only if you want to create tables)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized.');
    
    // Start server
    app.listen(SERVER_CONFIG.PORT, () => {
      console.log(`Server is running on port ${SERVER_CONFIG.PORT}`);
      console.log(`Environment: ${SERVER_CONFIG.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();