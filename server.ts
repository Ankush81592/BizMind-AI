import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { seedDemoData } from './server/seed.js';

import authRoutes from './server/routes/auth.js';
import dashboardRoutes from './server/routes/dashboard.js';
import businessRoutes from './server/routes/business.js';
import analyticsRoutes from './server/routes/analytics.js';
import agentsRoutes from './server/routes/agents.js';
import copilotRoutes from './server/routes/copilot.js';
import digitalTwinRoutes from './server/routes/digitalTwin.js';
import scenariosRoutes from './server/routes/scenarios.js';
import reportsRoutes from './server/routes/reports.js';
import importRoutes from './server/routes/import.js';
import notificationsRoutes from './server/routes/notifications.js';
import supportRoutes from './server/routes/support.js';
import searchRoutes from './server/routes/search.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize demo data
  await seedDemoData();

  // Middlewares
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'BizMind AI',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/business', businessRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/agents', agentsRoutes);
  app.use('/api/copilot', copilotRoutes);
  app.use('/api/digital-twin', digitalTwinRoutes);
  app.use('/api/scenarios', scenariosRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/import', importRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/search', searchRoutes);

  // Global API error handler
  app.use('/api', (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error occurred. Please try again.' });
  });

  // Frontend Serving: Vite middleware in development, static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BizMind AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
