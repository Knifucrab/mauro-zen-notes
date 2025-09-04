const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

class UserService {
  async createUser(userData) {
    const { username, password } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await userRepository.create({
      username,
      password: hashedPassword
    });

    return user;
  }

  async authenticateUser(username, password) {
    // Find user by username
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d' // Token expires in 7 days
      }
    );

    // Return user info (without password) and token
    return {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }

  async getUserById(id) {
    return await userRepository.findById(id);
  }

  async updateUser(id, userData) {
    const updateData = {};

    // Update username if provided
    if (userData.username) {
      const existingUser = await userRepository.findByUsername(userData.username);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Username already exists');
      }
      updateData.username = userData.username;
    }

    // Update password if provided
    if (userData.password) {
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    return await userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    return await userRepository.delete(id);
  }

  async getUserProfile(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const stats = await userRepository.getUserStats(id);

    return {
      ...user,
      stats
    };
  }

  async changePassword(id, oldPassword, newPassword) {
    // Get user with password
    const user = await userRepository.findByIdWithPassword(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid current password');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    return await userRepository.update(id, {
      password: hashedPassword
    });
  }

  generateToken(userId, username) {
    return jwt.sign(
      {
        userId,
        username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = { UserService: new UserService() };
