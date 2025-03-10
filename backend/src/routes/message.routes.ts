import { Router, RequestHandler } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All message routes require authentication
router.use(authenticateToken as RequestHandler);

router.get('/', MessageController.getMessages as RequestHandler);
router.post('/', MessageController.createMessage as RequestHandler);
router.delete('/:id', MessageController.deleteMessage as RequestHandler);

export default router; 