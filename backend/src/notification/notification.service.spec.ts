import { NotificationService } from './notification.service';
class NotificationWorkerServiceMock {
  sendEmailIfNotReviewed = jest.fn();
}

class EmailServiceMock {
  sendReviewRequestedEmailIfUserEnabled = jest.fn();
}

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notificationWorkerService: NotificationWorkerServiceMock;
  let emailService: EmailServiceMock;

  beforeEach(() => {
    notificationWorkerService = new NotificationWorkerServiceMock();
    emailService = new EmailServiceMock();
    notificationService = new NotificationService(
      notificationWorkerService as any,
      emailService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should queue review request emails correctly', async () => {
    const reviewRequest = {
      id: 1,
      reviewer: { id: 2 },
      dueAt: new Date('2023-08-10'),
      deadlineWarningAt: new Date('2023-08-09'),
    };
    const pullRequest = { title: 'Test PR', url: 'http://example.com/test' };

    await notificationService.queueReviewRequestEmails(
      reviewRequest as any,
      pullRequest,
    );

    expect(
      emailService.sendReviewRequestedEmailIfUserEnabled,
    ).toHaveBeenCalledWith(
      { ...reviewRequest, dueAt: reviewRequest.dueAt },
      pullRequest,
    );
    expect(
      notificationWorkerService.sendEmailIfNotReviewed,
    ).toHaveBeenCalledTimes(2);
    expect(
      notificationWorkerService.sendEmailIfNotReviewed,
    ).toHaveBeenCalledWith(
      { emailType: 'DEADLINE_WARNING', reviewRequest, pullRequest },
      reviewRequest.deadlineWarningAt,
    );
    expect(
      notificationWorkerService.sendEmailIfNotReviewed,
    ).toHaveBeenCalledWith(
      { emailType: 'OVERDUE', reviewRequest, pullRequest },
      reviewRequest.dueAt,
    );
  });
});
