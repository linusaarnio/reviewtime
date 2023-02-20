import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthorizationCallbackRequest,
  LoggedInUserResponse,
  AuthorizeResponse,
} from './github.api';
import { GithubService } from '../service/github.service';
import { createState } from '../utils/github.utils';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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

  @ApiOkResponse({ type: LoggedInUserResponse })
  @Get('/oauth/callback')
  public async authorizationCallback(
    @Query() query: AuthorizationCallbackRequest,
    @Session() session: Record<string, any>,
  ): Promise<LoggedInUserResponse> {
    if (query.state !== session.state) {
      throw new ForbiddenException('Invalid state value');
    }

    const user = await this.githubService.authenticate(query.code);
    session.user = user;
    return {
      id: user.id,
      login: user.login,
      avatar_url: user.avatarUrl,
      installations: user.installations,
    };
  }

  @ApiOkResponse({ type: LoggedInUserResponse })
  @ApiUnauthorizedResponse()
  @Get('/user')
  public async getLoggedInUser(
    @Session() session: Record<string, any>,
  ): Promise<LoggedInUserResponse> {
    const user = session.user;
    if (user === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: user.id,
      login: user.login,
      avatar_url: user.avatarUrl,
      installations: user.installations,
    };
  }

  @ApiOkResponse()
  @Get('/logout')
  public async logout(
    @Session() session: any, // TODO proper typing for session
  ): Promise<void> {
    session.destroy();
  }
}
