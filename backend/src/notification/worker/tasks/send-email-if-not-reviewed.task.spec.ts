import { Helpers } from 'graphile-worker';
import {
  SendEmailIfNotReviewedTask,
  SendEmailIfNotReviewedPayload,
} from './send-email-if-not-reviewed.task';

class EmailServiceMock {
  sendDeadlineWarningEmailIfUserEnabled = jest.fn();
  sendOverdueEmailIfUserEnabled = jest.fn();
}

class PullRequestServiceMock {
  isReviewed = jest.fn();
}

describe('SendEmailIfNotReviewedTask', () => {
  let emailService: EmailServiceMock;
  let pullRequestService: PullRequestServiceMock;
  let task: SendEmailIfNotReviewedTask;

  beforeEach(() => {
    emailService = new EmailServiceMock();
    pullRequestService = new PullRequestServiceMock();
    task = new SendEmailIfNotReviewedTask(
      emailService as any,
      pullRequestService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not send an email if the pull request is reviewed', async () => {
    const payload: SendEmailIfNotReviewedPayload = {
      emailType: 'DEADLINE_WARNING',
      reviewRequest: {
        id: 1,
        reviewer: { id: 2 },
        dueAt: new Date().toISOString(),
      },
      pullRequest: { title: 'Test PR', url: 'http://example.com/test' },
    };
    pullRequestService.isReviewed.mockResolvedValue(true);

    await task.handler(payload, {} as Helpers);

    expect(
      emailService.sendDeadlineWarningEmailIfUserEnabled,
    ).not.toHaveBeenCalled();
    expect(emailService.sendOverdueEmailIfUserEnabled).not.toHaveBeenCalled();
  });

  it('should send a deadline warning email if emailType is "DEADLINE_WARNING" and the pull request is not reviewed', async () => {
    const payload: SendEmailIfNotReviewedPayload = {
      emailType: 'DEADLINE_WARNING',
      reviewRequest: {
        id: 1,
        reviewer: { id: 2 },
        dueAt: new Date().toISOString(),
      },
      pullRequest: { title: 'Test PR', url: 'http://example.com/test' },
    };
    pullRequestService.isReviewed.mockResolvedValue(false);

    await task.handler(payload, {} as Helpers);

    expect(
      emailService.sendDeadlineWarningEmailIfUserEnabled,
    ).toHaveBeenCalledWith(
      {
        ...payload.reviewRequest,
        dueAt: new Date(payload.reviewRequest.dueAt),
      },
      payload.pullRequest,
    );
    expect(emailService.sendOverdueEmailIfUserEnabled).not.toHaveBeenCalled();
  });

  it('should send an overdue email if emailType is "OVERDUE" and the pull request is not reviewed', async () => {
    const payload: SendEmailIfNotReviewedPayload = {
      emailType: 'OVERDUE',
      reviewRequest: {
        id: 1,
        reviewer: { id: 2 },
        dueAt: new Date().toISOString(),
      },
      pullRequest: { title: 'Test PR', url: 'http://example.com/test' },
    };
    pullRequestService.isReviewed.mockResolvedValue(false);

    await task.handler(payload, {} as Helpers);

    expect(emailService.sendOverdueEmailIfUserEnabled).toHaveBeenCalledWith(
      {
        ...payload.reviewRequest,
        dueAt: new Date(payload.reviewRequest.dueAt),
      },
      payload.pullRequest,
    );
    expect(
      emailService.sendDeadlineWarningEmailIfUserEnabled,
    ).not.toHaveBeenCalled();
  });
});
