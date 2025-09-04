import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private userRepo = new UserRepository();
  private JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  async login(username: string, password: string) {
    // Input validation
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Find user
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }
    };
  }

  async createDefaultUser() {
    // Check if default user already exists
    const existingUser = await this.userRepo.findByUsername('admin');
    if (existingUser) {
      return existingUser;
    }

    // Create default user
    const hashedPassword = await bcrypt.hash('password123', 10);
    return this.userRepo.create({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
