import {Injectable, Inject} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {TASK_PATTERNS} from '../patterns';

@Injectable()
export class TaskEventsPublisher {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishTaskCreated(data: {
    taskId: string;
    title: string;
    createdBy: string;
    assigneeIds: string[];
  }) {
    return this.client.emit(TASK_PATTERNS.TASK_CREATED, data).toPromise();
  }

  async publishTaskUpdated(data: {
    taskId: string;
    title: string;
    updatedBy: string;
    changes: Record<string, any>;
    assigneeIds: string[];
  }) {
    return this.client.emit(TASK_PATTERNS.TASK_UPDATED, data).toPromise();
  }

  async publishCommentCreated(data: {
    taskId: string;
    commentId: string;
    userId: string;
    content: string;
    assigneeIds: string[];
  }) {
    return this.client.emit(TASK_PATTERNS.COMMENT_CREATED, data).toPromise();
  }
}
