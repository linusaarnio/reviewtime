import { Injectable } from '@nestjs/common';
import { CreateUser, User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  public async getUser(userId: number): Promise<User | undefined> {
    const userResult = await this.repo.getById(userId);
    if (userResult === null) {
      return undefined;
    }
    const installations = userResult.installations.map((inst) => inst.id);
    return { ...userResult, installations };
  }

  public async create(user: CreateUser): Promise<void> {
    await this.repo.create(user);
  }

  public async update(user: CreateUser): Promise<void> {
    await this.repo.update(user);
  }

  public async upsert(user: CreateUser): Promise<void> {
    const existing = await this.getUser(user.id);
    if (existing === undefined) {
      await this.create(user);
      return;
    }
    if (existing.id !== user.id) {
      throw new Error(
        'Updated user from GitHub has different id than existing user with same login',
      );
    }
    await this.update(user);
  }
}
