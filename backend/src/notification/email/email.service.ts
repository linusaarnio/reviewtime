import { Injectable } from '@nestjs/common';
import { MailService as SendGridService } from '@sendgrid/mail';
import { formatDistanceToNow } from 'date-fns';
import { UserService } from 'src/user/service/user.service';
import { Email } from './email.model';

interface ReviewRequest {
  reviewer: { id: number };
  dueAt: Date;
}
@Injectable()
export class EmailService {
  constructor(
    private readonly fromEmail: string,
    private readonly userService: UserService,
    private sendGridService: SendGridService,
  ) {}

  public async sendOverdueEmailIfUserEnabled(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ) {
    await this.sendEmailIfUserEnabled(
      this.getOverdueEmail(reviewRequest, pullRequest),
    );
  }

  public async sendDeadlineWarningEmailIfUserEnabled(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ) {
    await this.sendEmailIfUserEnabled(
      this.getDeadlineWarningEmail(reviewRequest, pullRequest),
    );
  }

  public async sendReviewRequestedEmailIfUserEnabled(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ) {
    await this.sendEmailIfUserEnabled(
      this.getReviewRequestedEmail(reviewRequest, pullRequest),
    );
  }

  private async sendEmailIfUserEnabled(email: Email) {
    const recipient = await this.userService.getUser(email.recipientUserId);
    if (
      recipient === undefined ||
      recipient.emailNotificationsEnabled === false ||
      recipient.email === undefined
    ) {
      return;
    }
    this.sendGridService
      .send({
        ...email,
        to: recipient.email,
        from: { name: 'ReviewTime', email: this.fromEmail },
      })
      .catch((error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      });
  }

  private getOverdueEmail(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ): Email {
    return {
      recipientUserId: reviewRequest.reviewer.id,
      subject: 'Review request overdue',
      html: `Your review for pull request <b>${pullRequest.title}</b> is overdue. <br /> Review it now at ${pullRequest.url}`,
      text: `Your review for pull request ${pullRequest.title} is overdue. Review it now at ${pullRequest.url}`,
    };
  }

  private getDeadlineWarningEmail(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ): Email {
    console.log('due at date');
    console.log(reviewRequest.dueAt);
    return {
      recipientUserId: reviewRequest.reviewer.id,
      subject: `Review request due in ${formatDistanceToNow(
        reviewRequest.dueAt,
      )}`,
      html: `Your review for pull request <b>${
        pullRequest.title
      }</b> is due in ${formatDistanceToNow(
        reviewRequest.dueAt,
      )}. <br /> Review it now at ${pullRequest.url}`,
      text: `Your review for pull request ${
        pullRequest.title
      } is due in ${formatDistanceToNow(
        reviewRequest.dueAt,
      )}. Review it now at ${pullRequest.url}`,
    };
  }

  private getReviewRequestedEmail(
    reviewRequest: ReviewRequest,
    pullRequest: { title: string; url: string },
  ): Email {
    return {
      recipientUserId: reviewRequest.reviewer.id,
      subject: `Review requested, due in ${formatDistanceToNow(
        reviewRequest.dueAt,
      )}`,
      html: `Your review has been requested for pull request <b>${
        pullRequest.title
      }</b>. It is due in ${formatDistanceToNow(
        reviewRequest.dueAt,
      )}. <br /> Review it now at ${pullRequest.url}`,
      text: `Your review has been requested for pull request ${
        pullRequest.title
      }. It is due in ${formatDistanceToNow(
        reviewRequest.dueAt,
      )}. Review it now at ${pullRequest.url}`,
    };
  }
}
