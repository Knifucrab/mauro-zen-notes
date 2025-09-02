import { getDataSource } from '../data-source';
import { User } from '../entity/User';

export class UserRepository {
  private async getRepo() {
    const dataSource = await getDataSource();
    return dataSource.getRepository(User);
  }

  async findByUsername(username: string) {
    const repo = await this.getRepo();
    return repo.findOneBy({ username });
  }

  async create(user: Partial<User>) {
    const repo = await this.getRepo();
    const newUser = repo.create(user);
    return repo.save(newUser);
  }
}
