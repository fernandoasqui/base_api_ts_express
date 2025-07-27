import 'dotenv/config';
import express from 'express';
import { authenticate } from './Middlewares/Auth';
import { logger } from './Middlewares/Logger';
import allRoutes from './Routes';

const app = express();

app.use(express.json());
app.use(logger);

// Middleware global para exigir token, exceto nas rotas de login e register
app.use((req, res, next) => {
  const publicPaths = ['/auth/login', '/auth/register'];

  // Se for rota pública, ignora authMiddleware
  if (publicPaths.includes(req.path)) {
    return next();
  }

  // Se não for rota pública, aplica o middleware
  return authenticate(req, res, next);
});

//rotas
app.use(allRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'API is online!', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
