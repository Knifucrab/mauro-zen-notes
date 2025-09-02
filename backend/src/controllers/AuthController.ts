import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  static async createDefaultUser(req: Request, res: Response) {
    try {
      const user = await authService.createDefaultUser();
      res.json({ message: 'Default user created', username: user.username });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
