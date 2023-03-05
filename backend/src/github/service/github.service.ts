import { Injectable } from '@nestjs/common';
import { App } from 'octokit';
import { CreateUser } from 'src/user/model/user.model';
import { UserService } from 'src/user/service/user.service';

export type UserID = number;

@Injectable()
export class GithubService {
  constructor(
    private readonly githubClient: App,
    private readonly userService: UserService,
  ) {}

  public getAuthorizationUrl(state: string): string {
    const result = this.githubClient.oauth.getWebFlowAuthorizationUrl({
      state,
    });
    return result.url;
  }

  public async authenticate(code: string): Promise<UserID> {
    const userOctokit = await this.githubClient.oauth
      .createToken({ code })
      .then(({ authentication }) =>
        this.githubClient.oauth.getUserOctokit({
          ...authentication,
        }),
      );
    const { id, login, avatar_url } = await userOctokit
      .request('GET /user')
      .then((response) => response.data);
    await this.userService.upsert({ id, login, avatarUrl: avatar_url });
    return id;
  }

  public async upsertUser(login: string): Promise<void> {
    const user = await this.getUser(login);
    await this.userService.upsert(user);
  }

  private async getUser(login: string): Promise<CreateUser> {
    const response = await this.githubClient.octokit.rest.users
      .getByUsername({
        username: login,
      })
      .then((response) => response.data);
    return {
      avatarUrl: response.avatar_url,
      id: response.id,
      login: response.login,
    };
  }
}
