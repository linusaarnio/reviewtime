import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Authenticated } from 'src/decorators/auth/authenticated.decorator';
import { UserId } from 'src/decorators/auth/user-id.decorator';
import { UserService } from '../service/user.service';
import {
  LoggedInUserResponse,
  SettingsResponse,
  UpdateEmailRequest,
} from './user.api';

@Authenticated()
@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: LoggedInUserResponse })
  @Get('/')
  public async getLoggedInUser(
    @UserId() userId: number,
  ): Promise<LoggedInUserResponse> {
    const user = await this.userService.getUser(userId);
    if (user === undefined) {
      console.log(
        `User ${userId} was saved in state but not found in userService`,
      );
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
  @Get('/settings')
  public async getUserSettings(
    @UserId() userId: number,
  ): Promise<SettingsResponse> {
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
    @UserId() userId: number,
  ): Promise<void> {
    return this.userService.updateEmail(
      userId,
      body.email,
      body.emailNotificationsEnabled,
    );
  }
}
