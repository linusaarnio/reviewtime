import { App, Octokit } from 'octokit';

import { GitHubAppUserAuthentication } from '@octokit/auth-oauth-app';

interface UserResponse {
  id: number;
  login: string;
  avatar_url: string;
}
export class AuthenticatedGitHubUser {
  private readonly authenticateAsUser: Promise<Octokit>;
  private userResponse: UserResponse | undefined;

  constructor(authentication: GitHubAppUserAuthentication, githubClient: App) {
    this.authenticateAsUser = githubClient.oauth.getUserOctokit({
      ...authentication,
    }) as Promise<Octokit>;
  }

  public async getId(): Promise<number> {
    return this.getUserResponse().then((response) => response.id);
  }

  public async getLogin(): Promise<string> {
    return this.getUserResponse().then((response) => response.login);
  }

  public async getAvatarUrl(): Promise<string> {
    return this.getUserResponse().then((response) => response.avatar_url);
  }

  public async getInstallations(): Promise<number[]> {
    return this.authenticateAsUser.then(async (client) => {
      const installationsResponse = await client.request(
        'GET /user/installations{?per_page,page}',
        {},
      );
      const installationsRaw: any[] = installationsResponse.data.installations;
      return installationsRaw.map((installation) => installation.id);
    });
  }

  private async getUserResponse(): Promise<UserResponse> {
    if (this.userResponse !== undefined) {
      return this.userResponse;
    }
    return this.authenticateAsUser.then(async (client) => {
      const authenticatedUserResponse = await client.request('GET /user');
      this.userResponse = authenticatedUserResponse.data;
      return authenticatedUserResponse.data;
    });
  }
}
