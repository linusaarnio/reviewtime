import { Module } from '@nestjs/common';
import { App } from 'octokit';
import { GithubController } from './github/controller/github.controller';
import { GithubService } from './github/service/github.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [GithubController],
  providers: [
    GithubService,
    {
      provide: App,
      inject: [],
      useFactory: () =>
        new App({
          appId: process.env.GITHUB_APP_ID,
          privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
          oauth: {
            clientId: process.env.GITHUB_APP_OAUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_APP_OAUTH_CLIENT_SECRET,
          },
          webhooks: {
            secret: process.env.GITHUB_APP_WEBHOOK_SECRET,
          },
        }),
    },
  ],
})
export class AppModule {}
