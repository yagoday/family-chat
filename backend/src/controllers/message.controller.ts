import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Message } from '../entities/Message';
import { AuthRequest } from '../middleware/auth';

export class MessageController {
  static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { before, limit = 50 } = req.query;
      const messageRepository = AppDataSource.getRepository(Message);

      const queryBuilder = messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .select([
          'message.id',
          'message.content',
          'message.image_url',
          'message.createdAt',
          'message.user_id',
          'sender.id',
          'sender.username',
          'sender.nickname'
        ])
        .orderBy('message.createdAt', 'DESC')
        .take(Number(limit));

      if (before) {
        queryBuilder.where('message.createdAt < :before', { before });
      }

      const messages = await queryBuilder.getMany();
      
      // Transform messages to include proper timestamp
      const formattedMessages = messages.map(message => ({
        id: message.id,
        content: message.content,
        imageUrl: message.image_url,
        sender: {
          id: message.sender.id,
          username: message.sender.username,
          nickname: message.sender.nickname
        },
        timestamp: message.createdAt.toISOString()
      }));

      res.json(formattedMessages.reverse());
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

      const messageRepository = AppDataSource.getRepository(Message);
      const message = new Message();
      message.content = content || '';
      message.image_url = imageUrl;
      message.sender = user;
      message.senderId = user.id;

      await messageRepository.save(message);

      // Load the sender relationship for the response
      const savedMessage = await messageRepository.findOne({
        where: { id: message.id },
        relations: ['sender'],
        select: {
          id: true,
          content: true,
          image_url: true,
          createdAt: true,
          sender: {
            id: true,
            username: true,
            isOnline: true
          }
        }
      });

      res.status(201).json(savedMessage);
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

      const messageRepository = AppDataSource.getRepository(Message);
      const message = await messageRepository.findOne({
        where: { id },
        relations: ['sender']
      });

      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }

      if (message.sender.id !== user.id) {
        res.status(403).json({ message: 'Not authorized to delete this message' });
        return;
      }

      await messageRepository.remove(message);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 