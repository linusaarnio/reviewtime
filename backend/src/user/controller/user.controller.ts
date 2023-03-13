import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import {
  LoggedInUserResponse,
  SettingsResponse,
  UpdateEmailRequest,
} from './user.api';

@ApiCookieAuth()
@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: LoggedInUserResponse })
  @ApiUnauthorizedResponse()
  @Get('/')
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

  @ApiOkResponse({ type: SettingsResponse })
  @ApiUnauthorizedResponse()
  @Get('/settings')
  public async getUserSettings(
    @Session() session: Record<string, any>,
  ): Promise<SettingsResponse> {
    const userId = session.userId as number | undefined;
    if (userId === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await this.userService.getUser(userId);

    return {
      email: user.email,
      emailNotificationsEnabled: user.emailNotificationsEnabled,
    };
  }

  @ApiCreatedResponse()
  @Post('/email')
  public async updateEmail(
    @Body() body: UpdateEmailRequest,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const userId = session.userId as number | undefined;
    if (userId === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.userService.updateEmail(
      userId,
      body.email,
      body.emailNotificationsEnabled,
    );
  }
}
