import {Controller, Logger} from '@nestjs/common';
import {EventPattern, Payload, Ctx, RmqContext} from '@nestjs/microservices';
import {NotificationsService} from '../../notifications/notifications.service';
import {NotificationType} from '../../notifications/enums/notification-type.enum';
import {COMMENT_EVENTS} from '../patterns';

interface CommentCreatedEvent {
  commentId: string;
  taskId: string;
  taskTitle: string;
  content: string;
  createdBy: {
    id: string;
    username: string;
  };
  assigneeIds: string[];
}

@Controller()
export class CommentEventsConsumer {
  private readonly logger = new Logger(CommentEventsConsumer.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(COMMENT_EVENTS.COMMENT_CREATED)
  async handleCommentCreated(
    @Payload() data: CommentCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Received comment.created event for task ${data.taskId}`);

    try {
      // Notificar todos os assignees da tarefa sobre o novo comentário
      for (const userId of data.assigneeIds) {
        // Não notificar quem fez o comentário
        if (userId !== data.createdBy.id) {
          await this.notificationsService.create({
            userId,
            type: NotificationType.COMMENT_CREATED,
            message: `${data.createdBy.username} comentou na tarefa: "${data.taskTitle}"`,
            taskId: data.taskId,
            metadata: {
              commentId: data.commentId,
              createdBy: data.createdBy,
              content: data.content.substring(0, 100), // Apenas preview
            },
          });
        }
      }

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Error handling comment.created event: ${error.message}`,
      );
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }
}
