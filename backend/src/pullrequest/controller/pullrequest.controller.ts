import {
  Controller,
  Get,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PullRequestService } from '../service/pullrequest.service';
import {
  AuthoredByUserResponse,
  ReviewRequestedFromUserResponse,
} from './pullrequest.api';

@ApiCookieAuth()
@ApiTags('pullrequest')
@Controller('/pullrequests')
export class PullRequestController {
  constructor(private readonly pullRequestService: PullRequestService) {}

  @ApiOkResponse({ type: AuthoredByUserResponse })
  @Get('/authored')
  public async getAuthoredByUser(
    @Session() session: Record<string, any>,
  ): Promise<AuthoredByUserResponse> {
    const userId = session.userId as number | undefined;
    if (userId === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }
    const pullRequests = await this.pullRequestService.getAuthoredByUser(
      userId,
    );
    return { pullRequests };
  }

  @ApiOkResponse({ type: ReviewRequestedFromUserResponse })
  @Get('/review-requested')
  public async getReviewRequestedFromUser(
    @Session() session: Record<string, any>,
  ): Promise<ReviewRequestedFromUserResponse> {
    const userId = session.userId as number | undefined;
    if (userId === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }
    const pullRequests =
      await this.pullRequestService.getReviewsRequestedFromUser(userId);
    return { pullRequests };
  }
}
