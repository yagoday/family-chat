import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
      }

      const user = await AuthService.validateCredentials(username, password);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Update user's online status
      await AuthService.updateUserOnlineStatus(user, true);

      const token = AuthService.generateToken(user.id);

      // Set HTTP-only cookie with the JWT token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        user: AuthService.getUserProfile(user)
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      // Update user's online status
      await AuthService.updateUserOnlineStatus(user, false);

      // Clear the auth cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      res.json(AuthService.getUserProfile(user));
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 