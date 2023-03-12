import { Injectable } from '@nestjs/common';
import { UserOverviewResponse } from '../controller/pullrequest.api';
import {
  AuthoredPullRequest,
  CreatePullRequest,
  CreateReview,
  CreateReviewRequest,
  ReviewingPullRequest,
} from '../model/pullrequest.model';
import { PullRequestRepository } from '../repository/pullrequest.repository';

@Injectable()
export class PullRequestService {
  dueAfterMinutes = 30; // TODO get this from a service instead

  constructor(private readonly repo: PullRequestRepository) {}

  public async getAuthoredByUser(
    userId: number,
  ): Promise<AuthoredPullRequest[]> {
    const pullRequests = await this.repo.getByAuthorId(userId);
    return pullRequests.map((pr) => ({
      ...pr,
      reviewRequests: pr.reviewRequests.map((request) => ({
        ...request,
        dueAt: this.getDueTime(request.requestedAt),
      })),
    }));
  }

  public async getReviewsRequestedFromUser(
    userId: number,
  ): Promise<ReviewingPullRequest[]> {
    const pullRequests = await this.repo.getByReviewAssignee(userId);
    return pullRequests.map((pr) => ({
      ...pr,
      reviewDueAt: this.getDueTime(pr.reviewRequests[0].requestedAt),
    }));
  }

  public async createPullRequest(pullRequest: CreatePullRequest) {
    await this.repo.createPullRequest(pullRequest);
  }

  public async createReviewRequest(reviewRequest: CreateReviewRequest) {
    await this.repo.createReviewRequest(reviewRequest, new Date());
  }

  public async createReview(review: CreateReview) {
    await this.repo.createReview(review, new Date());
  }

  public async getOverview(userId: number): Promise<UserOverviewResponse> {
    const authoredByUser = await this.getAuthoredByUser(userId);
    const reviewsRequestedFromUser = await this.getReviewsRequestedFromUser(
      userId,
    );
    const waitingForOthers = authoredByUser.reduce(
      (numberOfReviewRequests: number, currentPr: AuthoredPullRequest) => {
        return numberOfReviewRequests + currentPr.reviewRequests.length;
      },
      0,
    );

    return {
      waitingForOthers,
      waitingForUser: reviewsRequestedFromUser.length,
      nextReviewDue: this.getNextReviewDue(reviewsRequestedFromUser),
    };
  }

  private getNextReviewDue(
    prs: ReviewingPullRequest[],
  ): ReviewingPullRequest | undefined {
    if (prs.length === 0) {
      return undefined;
    }
    return prs.reduce(
      (
        previousSoonestDue: ReviewingPullRequest,
        currentPr: ReviewingPullRequest,
      ) => {
        return currentPr.reviewDueAt < previousSoonestDue.reviewDueAt
          ? currentPr
          : previousSoonestDue;
      },
    );
  }

  private getDueTime(requestTime?: Date): Date {
    if (requestTime === undefined) {
      return new Date();
    }
    return new Date(requestTime.getTime() + 1000 * 60 * this.dueAfterMinutes);
  }
}
