import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Session,
} from '@nestjs/common';
import {
  AuthorizationCallbackRequest,
  AuthorizationCallbackResponse,
  AuthorizeResponse,
} from './github.api';
import { GithubService } from '../service/github.service';
import { createState } from '../utils/github.utils';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiCookieAuth()
@ApiTags('github')
@Controller('/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @ApiOkResponse({ type: AuthorizeResponse })
  @Get('/oauth/authorize')
  public async startAuthorization(
    @Session() session: Record<string, string>,
  ): Promise<AuthorizeResponse> {
    const state = createState();
    session.state = state;
    return { authorization_url: this.githubService.getAuthorizationUrl(state) };
  }

  @ApiOkResponse({ type: AuthorizationCallbackResponse })
  @Get('/oauth/callback')
  public async authorizationCallback(
    @Query() query: AuthorizationCallbackRequest,
    @Session() session: Record<string, string>,
  ): Promise<AuthorizationCallbackResponse> {
    if (query.state !== session.state) {
      throw new ForbiddenException('Invalid state value');
    }

    const user = await this.githubService.authenticate(query.code);
    return {
      id: user.id,
      login: user.login,
      installations: user.installations,
    };
  }
}
