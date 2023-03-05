import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreatePullRequest,
  CreateReviewRequest,
} from '../model/pullrequest.model';

interface PullRequestResult {
  title: string;
  url: string;
  repository: { name: string };
  author: {
    login: string;
    avatarUrl: string;
  };
  reviewRequests: {
    requestedAt: Date;
    reviewer: {
      avatarUrl: string;
      login: string;
    };
  }[];
}

@Injectable()
export class PullRequestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async getByAuthorId(userId: number): Promise<PullRequestResult[]> {
    const results = await this.prisma.pullRequest.findMany({
      select: {
        title: true,
        url: true,
        repository: { select: { name: true } },
        author: { select: { avatarUrl: true, login: true } },
        reviewRequests: {
          where: { reviewId: undefined },
          select: {
            requestedAt: true,
            reviewer: { select: { avatarUrl: true, login: true } },
          },
        },
      },
      where: { authorId: userId },
    });
    return results;
  }

  public async getByReviewAssignee(
    userId: number,
  ): Promise<PullRequestResult[]> {
    const results = await this.prisma.pullRequest.findMany({
      select: {
        title: true,
        url: true,
        repository: { select: { name: true } },
        author: { select: { avatarUrl: true, login: true } },
        reviewRequests: {
          where: { AND: [{ reviewId: undefined }, { reviewerId: userId }] },
          select: {
            requestedAt: true,
            reviewer: { select: { avatarUrl: true, login: true } },
          },
        },
      },
      where: { reviewRequests: { some: { reviewerId: userId } } },
    });
    return results;
  }

  public async createPullRequest(
    pullRequest: CreatePullRequest,
  ): Promise<void> {
    await this.prisma.pullRequest.create({
      data: pullRequest,
    });
  }

  public async createReviewRequest(
    reviewRequest: CreateReviewRequest,
    requestedAt: Date,
  ): Promise<void> {
    await this.prisma.reviewRequest.create({
      data: { ...reviewRequest, requestedAt },
    });
  }
}
