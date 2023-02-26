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
