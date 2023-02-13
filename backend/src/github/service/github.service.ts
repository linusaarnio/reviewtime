import { Injectable } from '@nestjs/common';
import { App } from 'octokit';
import { AuthenticatedGitHubUser } from './authenticated-github-user';

interface GithubUser {
  id: number;
  login: string;
  installations: number[];
}

@Injectable()
export class GithubService {
  constructor(private readonly githubClient: App) {}

  public getAuthorizationUrl(state: string): string {
    const result = this.githubClient.oauth.getWebFlowAuthorizationUrl({
      state,
    });
    return result.url;
  }

  public async authenticate(code: string): Promise<GithubUser> {
    const user = await this.githubClient.oauth
      .createToken({ code })
      .then(
        ({ authentication }) =>
          new AuthenticatedGitHubUser(authentication, this.githubClient),
      );

    const [id, login, installations] = await Promise.all([
      user.getId(),
      user.getLogin(),
      user.getInstallations(),
    ]);

    return { id, login, installations };
  }
}
