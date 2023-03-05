class PullRequest {
  title: string;
  url: string;
  repository: { name: string };
}

export class AuthoredPullRequest extends PullRequest {
  reviewRequests: ReviewRequest[];
}

export class ReviewingPullRequest extends PullRequest {
  author: {
    login: string;
    avatarUrl: string;
  };
  reviewDueAt: Date;
}

export class ReviewRequest {
  dueAt: Date;
  reviewer: {
    avatarUrl: string;
    login: string;
  };
}

export interface CreatePullRequest {
  id: number;
  number: number;
  title: string;
  repositoryId: number;
  installationId: number;
  authorId: number;
  url: string;
}

export interface CreateReviewRequest {
  pullRequestId: number;
  reviewerId: number;
}
