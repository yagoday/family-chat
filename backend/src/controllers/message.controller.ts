import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';
import { AuthRequest } from '../middleware/auth';

export class MessageController {
  static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { before, limit = 50 } = req.query;
      const messages = await MessageService.getMessages(before as string | undefined, Number(limit));
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content, imageUrl } = req.body;
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      if (!content && !imageUrl) {
        res.status(400).json({ message: 'Message must have content or image' });
        return;
      }

      const message = await MessageService.createMessage(content, imageUrl, user);
      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      try {
        await MessageService.deleteMessage(id, user.id);
        res.status(204).send();
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Message not found') {
            res.status(404).json({ message: 'Message not found' });
            return;
          } else if (error.message === 'Not authorized to delete this message') {
            res.status(403).json({ message: 'Not authorized to delete this message' });
            return;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 