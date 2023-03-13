import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface UserDTO {
  id: number;
  avatarUrl: string;
  login: string;
  emailNotificationsEnabled: boolean;
  email: string | null;
  installations: { id: number }[];
}

interface CreateUserDTO {
  id: number;
  avatarUrl: string;
  login: string;
  email?: string;
  emailNotificationsEnabled?: boolean;
}

interface UpdateUserDTO {
  avatarUrl?: string;
  login?: string;
  email?: string;
  emailNotificationsEnabled?: boolean;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async getById(userId: number): Promise<UserDTO | null> {
    return this.prisma.user.findUnique({
      select: {
        id: true,
        avatarUrl: true,
        login: true,
        emailNotificationsEnabled: true,
        email: true,
        installations: { select: { id: true } },
      },
      where: { id: userId },
    });
  }

  public async create(user: CreateUserDTO): Promise<void> {
    await this.prisma.user.create({
      data: user,
    });
  }

  public async update(userId: number, updates: UpdateUserDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: updates,
    });
  }
}
