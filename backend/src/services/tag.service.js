const tagRepository = require('../repositories/tag.repository');

class TagService {
  async createTag(tagData) {
    const { name, color } = tagData;

    // Validate required fields
    if (!name?.trim()) {
      throw new Error('Tag name is required');
    }

    // Check if tag already exists
    const existingTag = await tagRepository.findByName(name.trim());
    if (existingTag) {
      throw new Error('Tag with this name already exists');
    }

    // Validate color format if provided
    if (color && !this.isValidColor(color)) {
      throw new Error('Invalid color format. Use hex color (e.g., #FF0000)');
    }

    const tag = await tagRepository.create({
      name: name.trim(),
      color: color || '#3B82F6' // Default blue color
    });

    return tag;
  }

  async getTags(options = {}) {
    const {
      page,
      limit = 20,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = options;

    // Validate sort parameters
    const validSortFields = ['name', 'createdAt'];
    const validSortOrders = ['asc', 'desc'];

    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    const safeSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'asc';

    let queryOptions = {
      search: search?.trim(),
      sortBy: safeSortBy,
      sortOrder: safeSortOrder
    };

    // Add pagination if specified
    if (page) {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 tags per page
      
      queryOptions.page = pageNum;
      queryOptions.limit = limitNum;
    }

    return await tagRepository.findAll(queryOptions);
  }

  async getTagById(id) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    return tag;
  }

  async updateTag(id, tagData) {
    const { name, color } = tagData;

    // Check if tag exists
    const existingTag = await tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag not found');
    }

    const updateData = {};

    // Update name if provided
    if (name !== undefined) {
      if (!name?.trim()) {
        throw new Error('Tag name cannot be empty');
      }

      // Check if new name conflicts with existing tag
      const nameConflict = await tagRepository.findByName(name.trim());
      if (nameConflict && nameConflict.id !== id) {
        throw new Error('Tag with this name already exists');
      }

      updateData.name = name.trim();
    }

    // Update color if provided
    if (color !== undefined) {
      if (color && !this.isValidColor(color)) {
        throw new Error('Invalid color format. Use hex color (e.g., #FF0000)');
      }
      updateData.color = color || '#3B82F6';
    }

    return await tagRepository.update(id, updateData);
  }

  async deleteTag(id) {
    // Check if tag exists
    const existingTag = await tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag not found');
    }

    // Note: Prisma will automatically handle the disconnection of notes
    // when the tag is deleted due to the implicit many-to-many relationship
    return await tagRepository.delete(id);
  }

  async getUserTags(userId, options = {}) {
    const {
      page,
      limit = 20,
      search
    } = options;

    let queryOptions = {
      search: search?.trim()
    };

    // Add pagination if specified
    if (page) {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
      
      queryOptions.page = pageNum;
      queryOptions.limit = limitNum;
    }

    return await tagRepository.getTagsWithNotes(userId, queryOptions);
  }

  async getMostUsedTags(userId, limit = 10) {
    const limitNum = Math.min(20, Math.max(1, parseInt(limit))); // Max 20 tags
    return await tagRepository.getMostUsedTags(userId, limitNum);
  }

  async getTagStats() {
    return await tagRepository.getTagStats();
  }

  async searchTags(query, options = {}) {
    if (!query?.trim()) {
      return await this.getTags(options);
    }

    return await this.getTags({
      ...options,
      search: query.trim()
    });
  }

  // Utility method to validate hex color
  isValidColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  // Get predefined color options
  getColorOptions() {
    return [
      { name: 'Blue', value: '#3B82F6' },
      { name: 'Red', value: '#EF4444' },
      { name: 'Green', value: '#10B981' },
      { name: 'Yellow', value: '#F59E0B' },
      { name: 'Purple', value: '#8B5CF6' },
      { name: 'Pink', value: '#EC4899' },
      { name: 'Indigo', value: '#6366F1' },
      { name: 'Teal', value: '#14B8A6' },
      { name: 'Orange', value: '#F97316' },
      { name: 'Cyan', value: '#06B6D4' },
      { name: 'Lime', value: '#84CC16' },
      { name: 'Amber', value: '#F59E0B' }
    ];
  }
}

module.exports = { TagService: new TagService() };
