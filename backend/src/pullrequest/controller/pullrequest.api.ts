import {
  AuthoredPullRequest,
  ReviewingPullRequest,
} from '../model/pullrequest.model';

export class AuthoredByUserResponse {
  public readonly pullRequests: AuthoredPullRequest[];
}

export class ReviewRequestedFromUserResponse {
  public readonly pullRequests: ReviewingPullRequest[];
}

export class UserOverviewResponse {
  waitingForOthers: number;

  waitingForUser: number;

  nextReviewDue?: ReviewingPullRequest;
}
