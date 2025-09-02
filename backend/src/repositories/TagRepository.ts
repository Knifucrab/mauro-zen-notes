import { getDataSource } from '../data-source';
import { Tag } from '../entity/Tag';

export class TagRepository {
  private async getRepo() {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Tag);
  }

  async findAll() {
    const repo = await this.getRepo();
    return repo.find();
  }

  async findById(id: number) {
    const repo = await this.getRepo();
    return repo.findOneBy({ id });
  }

  async findByName(name: string) {
    const repo = await this.getRepo();
    return repo.findOneBy({ name });
  }

  async create(tag: Partial<Tag>) {
    const repo = await this.getRepo();
    const newTag = repo.create(tag);
    return repo.save(newTag);
  }

  async update(id: number, data: Partial<Tag>) {
    const tag = await this.findById(id);
    if (!tag) return null;
    Object.assign(tag, data);
    const repo = await this.getRepo();
    return repo.save(tag);
  }

  async delete(id: number) {
    const tag = await this.findById(id);
    if (!tag) return null;
    const repo = await this.getRepo();
    await repo.remove(tag);
    return true;
  }
}
