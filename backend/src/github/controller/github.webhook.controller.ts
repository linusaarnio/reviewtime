import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { emitterEventNames, Webhooks } from '@octokit/webhooks';
import { PullRequestService } from 'src/pullrequest/service/pullrequest.service';
import { UserService } from 'src/user/service/user.service';

type EventName = (typeof emitterEventNames)[number];

@ApiTags('github')
@Controller('/github/webhooks')
export class GithubWebookController {
  constructor(
    private readonly githubWebhooksClient: Webhooks,
    private readonly pullRequestService: PullRequestService,
    private readonly userService: UserService,
  ) {
    this.registerWebhooks();
  }

  @ApiOkResponse()
  @Post('/')
  public async receiveWebhook(
    @Body() body: Record<string, any>,
    @Headers('x-github-delivery') id: string,
    @Headers('x-github-event') name: EventName,
    @Headers('x-hub-signature-256') signature: string,
  ): Promise<void> {
    this.githubWebhooksClient.verifyAndReceive({
      id,
      name,
      signature,
      payload: JSON.stringify(body),
    });
  }

  private registerWebhooks() {
    console.log('Registering webhooks');
    this.registerPullRequestOpened();
    this.registerReviewRequested();
  }

  private registerPullRequestOpened() {
    this.githubWebhooksClient.on('pull_request.opened', async ({ payload }) => {
      if (payload.installation === undefined) {
        console.log(
          'GOT pull request without installation. Pr number ',
          payload.pull_request.number,
        );
        return;
      }
      console.log('Creating pull request'); // TODO replace with real logging
      const author = payload.pull_request.user;
      await this.userService.upsert({
        id: author.id,
        login: author.login,
        avatarUrl: author.avatar_url,
      });
      await this.pullRequestService.createPullRequest({
        id: payload.pull_request.id,
        number: payload.number,
        authorId: payload.pull_request.user.id,
        repositoryId: payload.repository.id,
        title: payload.pull_request.title,
        url: payload.pull_request.url,
        installationId: payload.installation.id,
      });
    });
  }

  private registerReviewRequested() {
    this.githubWebhooksClient.on(
      'pull_request.review_requested',
      async ({ payload }) => {
        if (!('requested_reviewer' in payload)) {
          console.log(
            'No requested reviewer in pr with number ',
            payload.pull_request.number,
          );
          return;
        }
        const reviewer = payload.requested_reviewer;
        await this.userService.upsert({
          id: reviewer.id,
          login: reviewer.login,
          avatarUrl: reviewer.avatar_url,
        });
        await this.pullRequestService.createReviewRequest({
          pullRequestId: payload.pull_request.id,
          reviewerId: reviewer.id,
        });
      },
    );
  }
}
