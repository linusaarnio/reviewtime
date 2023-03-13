import { Module } from '@nestjs/common';
import { App } from 'octokit';
import { GithubController } from './github/controller/github.controller';
import { GithubService } from './github/service/github.service';
import { LoggerModule } from 'nestjs-pino';
import { PullRequestController } from './pullrequest/controller/pullrequest.controller';
import { PullRequestService } from './pullrequest/service/pullrequest.service';
import { PullRequestRepository } from './pullrequest/repository/pullrequest.repository';
import { PrismaClient } from '@prisma/client';
import { Webhooks } from '@octokit/webhooks';
import { UserService } from './user/service/user.service';
import { UserRepository } from './user/repository/user.repository';
import { UserController } from './user/controller/user.controller';
import { GithubWebookController } from './github/controller/github.webhook.controller';
import { InstallationService } from './installation/service/installation.service';
import { InstallationRepository } from './installation/repository/installation.repository';
import { EmailService } from './notification/email/email.service';
import { MailService as SendGridService } from '@sendgrid/mail';
import * as SendGrid from '@sendgrid/mail';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [
    GithubWebookController,
    GithubController,
    PullRequestController,
    UserController,
  ],
  providers: [
    GithubService,
    PullRequestService,
    PullRequestRepository,
    UserService,
    UserRepository,
    InstallationService,
    InstallationRepository,
    PrismaClient,
    {
      provide: EmailService,
      inject: [UserService, SendGridService],
      useFactory: (
        userService: UserService,
        sendGridService: SendGridService,
      ) =>
        new EmailService(
          process.env.SENDGRID_VERIFIED_FROM_EMAIL,
          userService,
          sendGridService,
        ),
    },
    {
      provide: SendGridService,
      useFactory: () => {
        const sendGridMailService = SendGrid;
        sendGridMailService.setApiKey(process.env.SENDGRID_API_KEY);
        return sendGridMailService;
      },
    },
    {
      provide: App,
      useFactory: () =>
        new App({
          appId: process.env.GITHUB_APP_ID,
          privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
          oauth: {
            clientId: process.env.GITHUB_APP_OAUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_APP_OAUTH_CLIENT_SECRET,
          },
        }),
    },
    {
      provide: Webhooks,
      useFactory: () =>
        new Webhooks({ secret: process.env.GITHUB_APP_WEBHOOK_SECRET }),
    },
  ],
})
export class AppModule {}
