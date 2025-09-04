import { TagRepository } from '../repositories/TagRepository';

export class TagService {
  private tagRepo = new TagRepository();

  async getAllTags() {
    return this.tagRepo.findAll();
  }

  async getTagById(id: number) {
    return this.tagRepo.findById(id);
  }

  async createTag(name: string, color?: string) {
    // Validate tag name length (max 20 characters)
    if (name.length > 20) {
      throw new Error('Tag name must be 20 characters or less');
    }

    // Check if tag already exists
    const existingTag = await this.tagRepo.findByName(name);
    if (existingTag) {
      throw new Error('Tag already exists');
    }

    // Color is required
    if (!color) {
      throw new Error('Color is required');
    }
    
    return this.tagRepo.create({ name, color });
  }

  async updateTag(id: number, name?: string, color?: string) {
    if (name && name.length > 20) {
      throw new Error('Tag name must be 20 characters or less');
    }
    
    const data: any = {};
    if (name) data.name = name;
    if (color) data.color = color;
    return this.tagRepo.update(id, data);
  }

  async deleteTag(id: number) {
    return this.tagRepo.delete(id);
  }
}
