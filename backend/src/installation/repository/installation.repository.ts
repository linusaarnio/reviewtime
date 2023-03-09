import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface CreateInstallationDTO {
  id: number;
}

interface CreateRepositoryDTO {
  id: number;
  name: string;
  installationId: number;
}

@Injectable()
export class InstallationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async createInstallation(installation: CreateInstallationDTO) {
    await this.prisma.installation.create({
      data: installation,
    });
  }

  public async deleteInstallation(id: number) {
    await this.prisma.installation.delete({ where: { id: id } });
  }

  public async createRepository(repository: CreateRepositoryDTO) {
    await this.prisma.repository.create({
      data: repository,
    });
  }

  public async deleteRepository(id: number) {
    await this.prisma.repository.delete({ where: { id: id } });
  }
}
