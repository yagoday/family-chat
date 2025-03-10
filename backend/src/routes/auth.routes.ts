import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login as RequestHandler);
router.post('/logout', authenticateToken as RequestHandler, AuthController.logout as RequestHandler);
router.get('/profile', authenticateToken as RequestHandler, AuthController.getProfile as RequestHandler);

export default router; 