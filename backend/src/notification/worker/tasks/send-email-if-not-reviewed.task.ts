import { Injectable } from '@nestjs/common';
import { Helpers } from 'graphile-worker';
import { Task, TaskHandler } from 'nestjs-graphile-worker';
import { EmailService } from 'src/notification/email/email.service';
import { PullRequestService } from 'src/pullrequest/service/pullrequest.service';

export interface SendEmailIfNotReviewedPayload {
  emailType: EmailType;
  reviewRequest: { id: number; reviewer: { id: number }; dueAt: Date | string };
  pullRequest: { title: string; url: string };
}

export type EmailType = 'OVERDUE' | 'DEADLINE_WARNING';

@Injectable()
@Task('send-email-if-not-reviewed')
export class SendEmailIfNotReviewedTask {
  constructor(
    private readonly emailService: EmailService,
    private readonly pullRequestService: PullRequestService,
  ) {}

  @TaskHandler()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handler(payload: SendEmailIfNotReviewedPayload, _: Helpers) {
    const isReviewed = await this.pullRequestService.isReviewed(
      payload.reviewRequest.id,
    );
    if (isReviewed) {
      return;
    }
    switch (payload.emailType) {
      case 'DEADLINE_WARNING':
        await this.emailService.sendDeadlineWarningEmailIfUserEnabled(
          {
            ...payload.reviewRequest,
            dueAt: new Date(payload.reviewRequest.dueAt),
          },
          payload.pullRequest,
        );
        break;
      case 'OVERDUE':
        await this.emailService.sendOverdueEmailIfUserEnabled(
          {
            ...payload.reviewRequest,
            dueAt: new Date(payload.reviewRequest.dueAt),
          },
          payload.pullRequest,
        );
        break;
    }
  }
}
