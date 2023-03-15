import { Injectable } from '@nestjs/common';
import { WorkerService } from 'nestjs-graphile-worker';
import { SendEmailIfNotReviewedPayload } from './tasks/send-email-if-not-reviewed.task';

@Injectable()
export class NotificationWorkerService {
  constructor(private readonly graphileWorker: WorkerService) {}

  public async sendEmailIfNotReviewed(
    payload: SendEmailIfNotReviewedPayload,
    sendIfNotReviewedAt: Date,
  ) {
    await this.graphileWorker.addJob('send-email-if-not-reviewed', payload, {
      runAt: sendIfNotReviewedAt,
    });
  }
}
