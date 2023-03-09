export interface CreateInstallation {
  id: number;
}

export interface CreateRepository {
  id: number;
  name: string;
  installationId: number;
}
