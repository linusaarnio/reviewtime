import { Injectable } from '@nestjs/common';
import { App } from 'octokit';
import { AuthenticatedGitHubUser } from './authenticated-github-user';

interface GithubUser {
  id: number;
  installations: number[];
}

@Injectable()
export class GithubService {
  constructor(private readonly githubClient: App) {}

  public getAuthorizationUrl(state: string): string {
    const result = this.githubClient.oauth.getWebFlowAuthorizationUrl({
      redirectUrl: 'http://localhost:3000/github/oauth/callback', // TODO set to frontend url (or get it from frontend with request?)
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

    const [id, installations] = await Promise.all([
      user.getId(),
      user.getInstallations(),
    ]);

    return { id, installations };
  }
}
