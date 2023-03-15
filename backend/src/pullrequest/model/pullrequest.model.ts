export class PullRequest {
  title: string;
  url: string;
  repository: Repository;
}

class Repository {
  name: string;
}

export class AuthoredPullRequest extends PullRequest {
  reviewRequests: ReviewRequest[];
}

export class ReviewingPullRequest extends PullRequest {
  author: User;
  reviewDueAt: Date;
}

class User {
  login: string;
  avatarUrl: string;
}

export class ReviewRequest {
  id: number;
  deadlineWarningAt: Date;
  dueAt: Date;
  reviewer: User & { id: number };
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

export interface CreateReview {
  id: number;
  pullRequestId: number;
  reviewerId: number;
}
