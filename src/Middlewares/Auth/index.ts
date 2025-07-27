import { verifyToken } from '@/libs/jwt';
import { NextFunction, Request, Response } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = verifyToken(token);
    // você pode guardar o payload no req para usar depois
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired!' });
  }
};
