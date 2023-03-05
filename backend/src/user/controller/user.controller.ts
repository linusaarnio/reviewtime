import {
  Controller,
  Get,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { LoggedInUserResponse } from './user.api';

@ApiCookieAuth()
@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: LoggedInUserResponse })
  @ApiUnauthorizedResponse()
  @Get('/user')
  public async getLoggedInUser(
    @Session() session: Record<string, any>,
  ): Promise<LoggedInUserResponse> {
    const userId = session.userId as number | undefined;
    if (userId === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await this.userService.getUser(userId);
    if (user === undefined) {
      console.log(
        `User ${userId} was saved in state but not found in userService`,
      ); // TODO real logging
      throw new Error('Could not get user from DB');
    }

    return {
      id: user.id,
      login: user.login,
      avatar_url: user.avatarUrl,
      installations: user.installations,
    };
  }
}
