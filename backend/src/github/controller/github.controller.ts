import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Session,
} from '@nestjs/common';
import { AuthorizationCallbackRequest, AuthorizeResponse } from './github.api';
import { GithubService } from '../service/github.service';
import { createState } from '../utils/github.utils';

@Controller('/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/oauth/authorize')
  public async startAuthorization(
    @Session() session: Record<string, string>,
  ): Promise<AuthorizeResponse> {
    const state = createState();
    session.state = state;
    return { redirect_url: this.githubService.getAuthorizationUrl(state) };
  }

  @Get('/oauth/callback')
  public async authorizationCallback(
    @Query() query: AuthorizationCallbackRequest,
    @Session() session: Record<string, string>,
  ) {
    if (query.state !== session.state) {
      throw new ForbiddenException('Invalid state value');
    }

    const user = await this.githubService.authenticate(query.code);
    return { id: user.id, installations: user.installations };
  }
}
