import { Injectable } from '@nestjs/common';
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
      reviewDueAt: this.getDueTime(pr.reviewRequests.at(0)?.requestedAt),
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

  private getDueTime(requestTime?: Date): Date {
    if (requestTime === undefined) {
      return new Date();
    }
    return new Date(requestTime.getTime() + 1000 * 60 * this.dueAfterMinutes);
  }
}
