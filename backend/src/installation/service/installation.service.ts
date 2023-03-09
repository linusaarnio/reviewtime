import { Injectable } from '@nestjs/common';
import {
  CreateInstallation,
  CreateRepository,
} from '../model/installation.model';
import { InstallationRepository } from '../repository/installation.repository';

@Injectable()
export class InstallationService {
  constructor(private readonly repo: InstallationRepository) {}

  public async createInstallation(installation: CreateInstallation) {
    await this.repo.createInstallation(installation);
  }

  public async deleteInstallation(id: number) {
    await this.repo.deleteInstallation(id);
  }

  public async createRepository(repository: CreateRepository) {
    await this.repo.createRepository(repository);
  }

  public async deleteRepository(id: number) {
    await this.repo.deleteRepository(id);
  }
}
