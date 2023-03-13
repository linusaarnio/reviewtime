import { Injectable } from '@nestjs/common';
import { MailService as SendGridService } from '@sendgrid/mail';
import { UserService } from 'src/user/service/user.service';
import { Email } from './email.model';

@Injectable()
export class EmailService {
  constructor(
    private readonly fromEmail: string,
    private readonly userService: UserService,
    private sendGridService: SendGridService,
  ) {}

  public async sendEmailIfUserEnabled(email: Email) {
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
}
