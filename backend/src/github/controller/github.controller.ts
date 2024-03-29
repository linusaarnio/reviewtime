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
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authenticated } from 'src/decorators/auth/authenticated.decorator';

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
  @ApiForbiddenResponse()
  @Get('/oauth/callback')
  public async authorizationCallback(
    @Query() query: AuthorizationCallbackRequest,
    @Session() session: Record<string, any>,
  ): Promise<AuthorizationCallbackResponse> {
    if (query.state !== session.state) {
      throw new ForbiddenException('Invalid state value');
    }
    try {
      const userId = await this.githubService.authenticate(query.code);
      session.userId = userId;
    } catch (e) {
      console.error(e);
      throw new ForbiddenException('Failed to authenticate with GitHub');
    }
    return { success: true };
  }

  @Authenticated()
  @ApiOkResponse()
  @Get('/logout')
  public async logout(@Session() session): Promise<void> {
    session.destroy();
  }
}
