import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    token: string;
  };
}

/**
 * Middleware to verify Bearer token authentication
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);

  // Basic token validation - in production, verify against JWT
  if (!token || token.length < 10) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = {
    id: 'user-from-token',
    token,
  };

  next();
};