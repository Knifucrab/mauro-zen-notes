const { UserService } = require('../services/user.service');

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username and password are required'
        });
      }

      if (username.length < 3) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username must be at least 3 characters long'
        });
      }

      // Create user
      const user = await UserService.createUser({ username, password });

      // Generate token for immediate login after registration
      const token = UserService.generateToken(user.id, user.username);

      res.status(201).json({
        message: 'User created successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'Username already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
      }

      if (error.message === 'Password must be at least 6 characters long') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create user'
      });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username and password are required'
        });
      }

      // Authenticate user
      const result = await UserService.authenticateUser(username, password);

      res.json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid username or password'
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Login failed'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserService.getUserProfile(userId);

      res.json({
        message: 'Profile retrieved successfully',
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve profile'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { username } = req.body;

      // Validate input
      if (username !== undefined && username.length < 3) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Username must be at least 3 characters long'
        });
      }

      const updatedUser = await UserService.updateUser(userId, { username });

      res.json({
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.message === 'Username already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update profile'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Current password and new password are required'
        });
      }

      await UserService.changePassword(userId, currentPassword, newPassword);

      res.json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.message === 'Invalid current password') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      if (error.message === 'New password must be at least 6 characters long') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to change password'
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const userId = req.user.id;
      const username = req.user.username;

      // Generate new token
      const token = UserService.generateToken(userId, username);

      res.json({
        message: 'Token refreshed successfully',
        data: {
          token,
          user: req.user
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to refresh token'
      });
    }
  }

  // Route to create default admin user
  async createDefaultUser(req, res) {
    try {
      const defaultUsername = 'admin';
      const defaultPassword = 'password123';

      // Check if admin user already exists
      const existingUser = await UserService.getUserById('admin');
      if (existingUser) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Default admin user already exists'
        });
      }

      // Create default admin user
      const user = await UserService.createUser({
        username: defaultUsername,
        password: defaultPassword
      });

      res.status(201).json({
        message: 'Default admin user created successfully',
        data: {
          username: user.username,
          id: user.id,
          createdAt: user.createdAt
        },
        credentials: {
          username: defaultUsername,
          password: defaultPassword
        }
      });
    } catch (error) {
      console.error('Create default user error:', error);
      
      if (error.message === 'Username already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Default admin user already exists'
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create default user'
      });
    }
  }

  async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled on the client side
      // by removing the token. We can add token blacklisting here if needed.
      res.json({
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Logout failed'
      });
    }
  }
}

module.exports = new AuthController();
