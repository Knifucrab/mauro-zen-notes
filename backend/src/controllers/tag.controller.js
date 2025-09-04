const { TagService } = require('../services/tag.service');

class TagController {
  async createTag(req, res) {
    try {
      const { name, color } = req.body;

      // Validate input
      if (!name?.trim()) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Tag name is required'
        });
      }

      const tag = await TagService.createTag({ name, color });

      res.status(201).json({
        message: 'Tag created successfully',
        data: tag
      });
    } catch (error) {
      console.error('Create tag error:', error);
      
      if (error.message === 'Tag name is required') {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      if (error.message === 'Tag with this name already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
      }

      if (error.message.includes('Invalid color format')) {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create tag'
      });
    }
  }

  async getTags(req, res) {
    try {
      const {
        page,
        limit = 20,
        search,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      const result = await TagService.getTags({
        page: page ? parseInt(page) : undefined,
        limit: parseInt(limit),
        search,
        sortBy,
        sortOrder
      });

      res.json({
        message: 'Tags retrieved successfully',
        data: result.tags,
        ...(result.pagination && { pagination: result.pagination })
      });
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve tags'
      });
    }
  }

  async getTagById(req, res) {
    try {
      const { id } = req.params;
      const tag = await TagService.getTagById(id);

      res.json({
        message: 'Tag retrieved successfully',
        data: tag
      });
    } catch (error) {
      console.error('Get tag error:', error);
      
      if (error.message === 'Tag not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve tag'
      });
    }
  }

  async updateTag(req, res) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;

      const updatedTag = await TagService.updateTag(id, { name, color });

      res.json({
        message: 'Tag updated successfully',
        data: updatedTag
      });
    } catch (error) {
      console.error('Update tag error:', error);
      
      if (error.message === 'Tag not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      if (error.message === 'Tag name cannot be empty' ||
          error.message.includes('Invalid color format')) {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        });
      }

      if (error.message === 'Tag with this name already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update tag'
      });
    }
  }

  async deleteTag(req, res) {
    try {
      const { id } = req.params;
      await TagService.deleteTag(id);

      res.json({
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      console.error('Delete tag error:', error);
      
      if (error.message === 'Tag not found') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete tag'
      });
    }
  }

  async getUserTags(req, res) {
    try {
      const userId = req.user.id;
      const {
        page,
        limit = 20,
        search
      } = req.query;

      const result = await TagService.getUserTags(userId, {
        page: page ? parseInt(page) : undefined,
        limit: parseInt(limit),
        search
      });

      res.json({
        message: 'User tags retrieved successfully',
        data: result.tags,
        ...(result.pagination && { pagination: result.pagination })
      });
    } catch (error) {
      console.error('Get user tags error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve user tags'
      });
    }
  }

  async getMostUsedTags(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10 } = req.query;

      const tags = await TagService.getMostUsedTags(userId, parseInt(limit));

      res.json({
        message: 'Most used tags retrieved successfully',
        data: tags
      });
    } catch (error) {
      console.error('Get most used tags error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve most used tags'
      });
    }
  }

  async getTagStats(req, res) {
    try {
      const stats = await TagService.getTagStats();

      res.json({
        message: 'Tag statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get tag stats error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve tag statistics'
      });
    }
  }

  async searchTags(req, res) {
    try {
      const { q: query, page, limit = 20, sortBy = 'name', sortOrder = 'asc' } = req.query;

      const result = await TagService.searchTags(query, {
        page: page ? parseInt(page) : undefined,
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      res.json({
        message: 'Tags search completed successfully',
        data: result.tags,
        ...(result.pagination && { pagination: result.pagination }),
        query: query || ''
      });
    } catch (error) {
      console.error('Search tags error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to search tags'
      });
    }
  }

  async getColorOptions(req, res) {
    try {
      const colorOptions = TagService.getColorOptions();

      res.json({
        message: 'Color options retrieved successfully',
        data: colorOptions
      });
    } catch (error) {
      console.error('Get color options error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve color options'
      });
    }
  }
}

module.exports = new TagController();
