import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { emitterEventNames, Webhooks } from '@octokit/webhooks';
import { InstallationService } from 'src/installation/service/installation.service';
import { NotificationService } from 'src/notification/notification.service';
import { PullRequestService } from 'src/pullrequest/service/pullrequest.service';
import { UserService } from 'src/user/service/user.service';

type EventName = (typeof emitterEventNames)[number];

interface Repository {
  id: number;
  name: string;
}
@ApiTags('github')
@Controller('/github/webhooks')
export class GithubWebookController {
  constructor(
    private readonly githubWebhooksClient: Webhooks,
    private readonly pullRequestService: PullRequestService,
    private readonly userService: UserService,
    private readonly installationService: InstallationService,
    private readonly notificationService: NotificationService,
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
    this.registerInstallationActions();
    this.registerInstallationRepositoriesActions();
    this.registerReviewSubmitted();
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
        url: payload.pull_request.html_url,
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
        await new Promise((r) => setTimeout(r, 2000)); // Wait 2 seconds to make sure this isn't done before PR is registered
        const reviewer = payload.requested_reviewer;
        await this.userService.upsert({
          id: reviewer.id,
          login: reviewer.login,
          avatarUrl: reviewer.avatar_url,
        });
        const reviewRequest = await this.pullRequestService.createReviewRequest(
          {
            pullRequestId: payload.pull_request.id,
            reviewerId: reviewer.id,
          },
        );
        await this.notificationService.queueReviewRequestEmails(reviewRequest, {
          title: payload.pull_request.title,
          url: payload.pull_request.html_url,
        });
      },
    );
  }

  private registerReviewSubmitted() {
    this.githubWebhooksClient.on(
      'pull_request_review.submitted',
      async ({ payload }) => {
        const pullRequestId = payload.pull_request.id;
        const reviewerId = payload.review.user.id;
        await this.pullRequestService.createReview({
          id: payload.review.id,
          pullRequestId,
          reviewerId,
        });
      },
    );
  }

  private registerInstallationActions() {
    this.githubWebhooksClient.on('installation', async ({ payload }) => {
      const id = payload.installation.id;
      switch (payload.action) {
        case 'created':
          await this.installationService.createInstallation({ id });
          if (payload.repositories !== undefined) {
            await this.createInstallationRepositories(id, payload.repositories);
          }
          break;
        case 'deleted':
          this.installationService.deleteInstallation(id);
          break;
        default:
          console.log(
            `received unhandled installation action: ${payload.action}`,
          );
          return; // TODO handle suspend and unsuspend
      }
    });
  }

  private registerInstallationRepositoriesActions() {
    this.githubWebhooksClient.on(
      'installation_repositories',
      async ({ payload }) => {
        const installationId = payload.installation.id;
        switch (payload.action) {
          case 'added':
            await this.createInstallationRepositories(
              installationId,
              payload.repositories_added,
            );
          case 'removed':
            await this.deleteInstallationRepositories(
              payload.repositories_removed,
            );
        }
      },
    );
  }

  private async createInstallationRepositories(
    installationId: number,
    repositories: Repository[],
  ) {
    for (const repository of repositories) {
      await this.installationService.createRepository({
        id: repository.id,
        name: repository.name,
        installationId,
      });
    }
  }

  private async deleteInstallationRepositories(repositories: Repository[]) {
    for (const repository of repositories) {
      await this.installationService.deleteRepository(repository.id);
    }
  }
}
