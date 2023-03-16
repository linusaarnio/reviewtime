import { Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser, User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  public async getUser(userId: number): Promise<User> {
    const userResult = await this.repo.getById(userId);
    if (userResult === null) {
      throw Error(`User with id ${userId} was null from repository`);
    }
    const installations = userResult.installations.map((inst) => inst.id);
    return {
      ...userResult,
      installations,
      email: userResult.email === null ? undefined : userResult.email,
    };
  }

  public async create(user: CreateUser): Promise<void> {
    await this.repo.create(user);
  }

  public async update(user: UpdateUser): Promise<void> {
    await this.repo.update(user.id, user);
  }

  public async upsert(user: CreateUser): Promise<void> {
    const existing = await this.repo.getById(user.id);
    if (existing === null) {
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

  public async updateEmail(
    userId: number,
    email: string,
    emailNotificationsEnabled?: boolean,
  ) {
    await this.repo.update(userId, { email, emailNotificationsEnabled });
  }
}
