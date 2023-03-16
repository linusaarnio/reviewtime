import { Injectable } from '@nestjs/common';
import { UserOverviewResponse } from '../controller/pullrequest.api';
import {
  AuthoredPullRequest,
  CreatePullRequest,
  CreateReview,
  CreateReviewRequest,
  ReviewingPullRequest,
  ReviewRequest,
} from '../model/pullrequest.model';
import { PullRequestRepository } from '../repository/pullrequest.repository';

@Injectable()
export class PullRequestService {
  constructor(
    private readonly repo: PullRequestRepository,
    private readonly reviewDueAfterMinutes: number,
  ) {}

  public async getAuthoredByUser(
    userId: number,
  ): Promise<AuthoredPullRequest[]> {
    const pullRequests = await this.repo.getByAuthorId(userId);
    return pullRequests.map((pr) => ({
      ...pr,
      reviewRequests: pr.reviewRequests.map((request) => ({
        ...request,
        dueAt: this.getDueTime(request.requestedAt),
        deadlineWarningAt: this.getDeadlineWarningAt(request.requestedAt),
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
      reviewDeadlineWarningAt: this.getDeadlineWarningAt(
        pr.reviewRequests[0].requestedAt,
      ),
    }));
  }

  public async createPullRequest(pullRequest: CreatePullRequest) {
    await this.repo.createPullRequest(pullRequest);
  }

  public async createReviewRequest(
    reviewRequest: CreateReviewRequest,
  ): Promise<ReviewRequest> {
    const created = await this.repo.createReviewRequest(
      reviewRequest,
      new Date(),
    );
    return {
      ...created,
      dueAt: this.getDueTime(created.requestedAt),
      deadlineWarningAt: this.getDeadlineWarningAt(created.requestedAt),
    };
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

  public async isReviewed(reviewRequestId: number): Promise<boolean> {
    const reviewRequest = await this.repo.getReviewRequest(reviewRequestId);
    if (reviewRequest === null) {
      throw new Error(`Reviewrequest with id ${reviewRequestId} was null`);
    }
    return reviewRequest.review !== null;
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
    return new Date(
      requestTime.getTime() + 1000 * 60 * this.reviewDueAfterMinutes,
    );
  }

  private getDeadlineWarningAt(requestTime?: Date): Date {
    if (requestTime === undefined) {
      return new Date();
    }
    return new Date(
      requestTime.getTime() + (1000 * 60 * this.reviewDueAfterMinutes) / 2,
    );
  }
}
