import { AppDataSource } from '../config/ormconfig';
import { Message } from '../entities/Message';
import { User } from '../entities/User';

export class MessageService {
  private static messageRepository = AppDataSource.getRepository(Message);

  static async getMessages(before?: string, limit: number = 50) {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .select([
        'message.id',
        'message.content',
        'message.image_url',
        'message.createdAt',
        'message.senderId',
        'sender.id',
        'sender.username',
        'sender.nickname'
      ])
      .orderBy('message.createdAt', 'DESC')
      .take(limit);

    if (before) {
      queryBuilder.where('message.createdAt < :before', { before });
    }

    const messages = await queryBuilder.getMany();
    
    return messages.map(message => ({
      id: message.id,
      content: message.content,
      imageUrl: message.image_url,
      sender: {
        id: message.sender.id,
        username: message.sender.username,
        nickname: message.sender.nickname
      },
      timestamp: message.createdAt.toISOString()
    })).reverse();
  }

  static async createMessage(content: string, imageUrl: string | null, user: User) {
    const message = new Message();
    message.content = content || '';
    message.image_url = imageUrl || '';
    message.sender = user;
    message.senderId = user.id;

    await this.messageRepository.save(message);

    return await this.messageRepository.findOne({
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
  }

  static async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender']
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.sender.id !== userId) {
      throw new Error('Not authorized to delete this message');
    }

    await this.messageRepository.remove(message);
    return true;
  }
} 