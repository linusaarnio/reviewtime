import { ReviewRequest } from 'src/pullrequest/model/pullrequest.model';
import { EmailService } from './email/email.service';
import { NotificationWorkerService } from './worker/notification.worker.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationWorkerService: NotificationWorkerService,
    private readonly emailService: EmailService,
  ) {}

  public async queueReviewRequestEmails(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ) {
    await this.emailService.sendReviewRequestedEmailIfUserEnabled(
      { ...reviewRequest, dueAt: reviewRequest.dueAt },
      pullRequest,
    );
    await this.notificationWorkerService.sendEmailIfNotReviewed(
      { emailType: 'DEADLINE_WARNING', reviewRequest, pullRequest },
      reviewRequest.deadlineWarningAt,
    );
    await this.notificationWorkerService.sendEmailIfNotReviewed(
      { emailType: 'OVERDUE', reviewRequest, pullRequest },
      reviewRequest.dueAt,
    );
  }
}
