import { EmailService } from './email.service';

class UserServiceMock {
  getUser = jest.fn();
}

class SendGridServiceMock {
  send = jest.fn().mockResolvedValue({});
}

describe('EmailService', () => {
  let emailService: EmailService;
  let userService: UserServiceMock;
  let sendGridService: SendGridServiceMock;

  beforeEach(() => {
    userService = new UserServiceMock();
    sendGridService = new SendGridServiceMock();
    emailService = new EmailService(
      'from@example.com',
      userService as any,
      sendGridService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send overdue email if user has enabled email notifications', async () => {
    const reviewRequest = { reviewer: { id: 1 }, dueAt: new Date() };
    const pullRequest = { title: 'Test PR', url: 'http://example.com/test' };
    userService.getUser.mockResolvedValue({
      email: 'user@example.com',
      emailNotificationsEnabled: true,
    });

    await emailService.sendOverdueEmailIfUserEnabled(
      reviewRequest as any,
      pullRequest,
    );

    expect(sendGridService.send).toHaveBeenCalled();
  });

  it('should send deadline warning email if user has enabled email notifications', async () => {
    const reviewRequest = { reviewer: { id: 1 }, dueAt: new Date() };
    const pullRequest = { title: 'Test PR', url: 'http://example.com/test' };
    userService.getUser.mockResolvedValue({
      email: 'user@example.com',
      emailNotificationsEnabled: true,
    });

    await emailService.sendDeadlineWarningEmailIfUserEnabled(
      reviewRequest as any,
      pullRequest,
    );

    expect(sendGridService.send).toHaveBeenCalled();
  });

  it('should send review requested email if user has enabled email notifications', async () => {
    const reviewRequest = { reviewer: { id: 1 }, dueAt: new Date() };
    const pullRequest = { title: 'Test PR', url: 'http://example.com/test' };
    userService.getUser.mockResolvedValue({
      email: 'user@example.com',
      emailNotificationsEnabled: true,
    });

    await emailService.sendReviewRequestedEmailIfUserEnabled(
      reviewRequest as any,
      pullRequest,
    );

    expect(sendGridService.send).toHaveBeenCalled();
  });

  it('should not send any email if user has not enabled email notifications', async () => {
    const reviewRequest = { reviewer: { id: 1 }, dueAt: new Date() };
    const pullRequest = { title: 'Test PR', url: 'http://example.com/test' };
    userService.getUser.mockResolvedValue({
      email: 'user@example.com',
      emailNotificationsEnabled: false,
    });

    await emailService.sendOverdueEmailIfUserEnabled(
      reviewRequest as any,
      pullRequest,
    );
    await emailService.sendDeadlineWarningEmailIfUserEnabled(
      reviewRequest as any,
      pullRequest,
    );
    await emailService.sendReviewRequestedEmailIfUserEnabled(
      reviewRequest as any,
      pullRequest,
    );

    expect(sendGridService.send).not.toHaveBeenCalled();
  });
});
