const jwt = require('jsonwebtoken');
const { UserService } = require('../services/user.service');

class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Access token is required'
        });
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Access token is required'
        });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token has expired'
          });
        }
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token'
        });
      }

      // Get user from database
      const user = await UserService.getUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not found'
        });
      }

      // Add user to request object (without password)
      req.user = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication failed'
      });
    }
  }

  static async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return next();
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (!token) {
        return next();
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserService.getUserById(decoded.userId);
        
        if (user) {
          req.user = {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
        }
      } catch (jwtError) {
        // Continue without authentication if token is invalid
      }

      next();
    } catch (error) {
      console.error('Optional authentication error:', error);
      next();
    }
  }
}

module.exports = AuthMiddleware;
