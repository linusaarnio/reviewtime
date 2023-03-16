import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Authenticated } from 'src/decorators/auth/authenticated.decorator';
import { UserId } from 'src/decorators/auth/user-id.decorator';
import { PullRequestService } from '../service/pullrequest.service';
import {
  AuthoredByUserResponse,
  ReviewRequestedFromUserResponse,
  UserOverviewResponse,
} from './pullrequest.api';

@Authenticated()
@ApiTags('pullrequest')
@Controller('/pullrequests')
export class PullRequestController {
  constructor(private readonly pullRequestService: PullRequestService) {}

  @ApiOkResponse({ type: AuthoredByUserResponse })
  @Get('/authored')
  public async getAuthoredByUser(
    @UserId() userId: number,
  ): Promise<AuthoredByUserResponse> {
    const pullRequests = await this.pullRequestService.getAuthoredByUser(
      userId,
    );
    return { pullRequests };
  }

  @ApiOkResponse({ type: ReviewRequestedFromUserResponse })
  @Get('/review-requested')
  public async getReviewRequestedFromUser(
    @UserId() userId: number,
  ): Promise<ReviewRequestedFromUserResponse> {
    const pullRequests =
      await this.pullRequestService.getReviewsRequestedFromUser(userId);
    return { pullRequests };
  }

  @ApiOkResponse({ type: UserOverviewResponse })
  @Get('/overview')
  public async getOverview(
    @UserId() userId: number,
  ): Promise<UserOverviewResponse> {
    return this.pullRequestService.getOverview(userId);
  }
}
