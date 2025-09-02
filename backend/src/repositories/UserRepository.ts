import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  async findByUsername(username: string) {
    return this.repo.findOneBy({ username });
  }

  async create(user: Partial<User>) {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }
}
