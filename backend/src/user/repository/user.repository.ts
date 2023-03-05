import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface UserDTO {
  id: number;
  avatarUrl: string;
  login: string;
  installations: { id: number }[];
}

interface CreateUserDTO {
  id: number;
  avatarUrl: string;
  login: string;
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

  public async update(user: CreateUserDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }
}
