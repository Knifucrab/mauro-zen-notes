import { AppDataSource } from '../data-source';
import { Tag } from '../entity/Tag';

export class TagRepository {
  private repo = AppDataSource.getRepository(Tag);

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async findByName(name: string) {
    return this.repo.findOneBy({ name });
  }

  async create(tag: Partial<Tag>) {
    const newTag = this.repo.create(tag);
    return this.repo.save(newTag);
  }

  async update(id: number, data: Partial<Tag>) {
    const tag = await this.findById(id);
    if (!tag) return null;
    Object.assign(tag, data);
    return this.repo.save(tag);
  }

  async delete(id: number) {
    const tag = await this.findById(id);
    if (!tag) return null;
    await this.repo.remove(tag);
    return true;
  }
}
