import { App, Octokit } from 'octokit';

import { GitHubAppUserAuthentication } from '@octokit/auth-oauth-app';

export class AuthenticatedGitHubUser {
  private readonly authenticateAsUser: Promise<Octokit>;

  constructor(authentication: GitHubAppUserAuthentication, githubClient: App) {
    this.authenticateAsUser = githubClient.oauth.getUserOctokit({
      ...authentication,
    }) as Promise<Octokit>;
  }

  public async getId(): Promise<number> {
    return this.authenticateAsUser.then(async (client) => {
      const authenticatedUserResponse = await client.request('GET /user');
      return authenticatedUserResponse.data.id;
    });
  }

  public async getLogin(): Promise<string> {
    return this.authenticateAsUser.then(async (client) => {
      const authenticatedUserResponse = await client.request('GET /user');
      return authenticatedUserResponse.data.login;
    });
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
}
