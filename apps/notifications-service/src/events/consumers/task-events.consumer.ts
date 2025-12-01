import {Controller, Logger} from '@nestjs/common';
import {EventPattern, Payload, Ctx, RmqContext} from '@nestjs/microservices';
import {NotificationsService} from '../../notifications/notifications.service';
import {NotificationType} from '../../notifications/enums/notification-type.enum';
import {TASK_EVENTS} from '../patterns';

interface TaskCreatedEvent {
  taskId: string;
  title: string;
  createdBy: {
    id: string;
    username: string;
  };
  assigneeIds: string[];
}

interface TaskUpdatedEvent {
  taskId: string;
  title: string;
  updatedBy: {
    id: string;
    username: string;
  };
  changes: Record<string, any>;
  assigneeIds: string[];
}

interface TaskAssignedEvent {
  taskId: string;
  title: string;
  assignedBy: {
    id: string;
    username: string;
  };
  assigneeIds: string[];
}

interface TaskStatusChangedEvent {
  taskId: string;
  title: string;
  oldStatus: string;
  newStatus: string;
  changedBy: {
    id: string;
    username: string;
  };
  assigneeIds: string[];
}

@Controller()
export class TaskEventsConsumer {
  private readonly logger = new Logger(TaskEventsConsumer.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(TASK_EVENTS.TASK_CREATED)
  async handleTaskCreated(
    @Payload() data: TaskCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Received task.created event for task ${data.taskId}`);

    try {
      // Notificar todos os assignees
      for (const userId of data.assigneeIds) {
        // Não notificar o criador
        if (userId !== data.createdBy.id) {
          await this.notificationsService.create({
            userId,
            type: NotificationType.TASK_CREATED,
            message: `${data.createdBy.username} criou uma nova tarefa: "${data.title}"`,
            taskId: data.taskId,
            metadata: {
              createdBy: data.createdBy,
            },
          });
        }
      }

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error handling task.created event: ${error.message}`);
      // Rejeitar a mensagem para retry
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern(TASK_EVENTS.TASK_UPDATED)
  async handleTaskUpdated(
    @Payload() data: TaskUpdatedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Received task.updated event for task ${data.taskId}`);

    try {
      // Notificar todos os assignees sobre a atualização
      for (const userId of data.assigneeIds) {
        // Não notificar quem fez a atualização
        if (userId !== data.updatedBy.id) {
          await this.notificationsService.create({
            userId,
            type: NotificationType.TASK_UPDATED,
            message: `${data.updatedBy.username} atualizou a tarefa: "${data.title}"`,
            taskId: data.taskId,
            metadata: {
              updatedBy: data.updatedBy,
              changes: data.changes,
            },
          });
        }
      }

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error handling task.updated event: ${error.message}`);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern(TASK_EVENTS.TASK_ASSIGNED)
  async handleTaskAssigned(
    @Payload() data: TaskAssignedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Received task.assigned event for task ${data.taskId}`);

    try {
      // Notificar apenas os novos assignees
      for (const userId of data.assigneeIds) {
        if (userId !== data.assignedBy.id) {
          await this.notificationsService.create({
            userId,
            type: NotificationType.TASK_ASSIGNED,
            message: `Você foi atribuído à tarefa: "${data.title}"`,
            taskId: data.taskId,
            metadata: {
              assignedBy: data.assignedBy,
            },
          });
        }
      }

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error handling task.assigned event: ${error.message}`);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern(TASK_EVENTS.TASK_STATUS_CHANGED)
  async handleTaskStatusChanged(
    @Payload() data: TaskStatusChangedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Received task.status.changed event for task ${data.taskId}`,
    );

    try {
      // Notificar todos os assignees sobre mudança de status
      for (const userId of data.assigneeIds) {
        if (userId !== data.changedBy.id) {
          await this.notificationsService.create({
            userId,
            type: NotificationType.TASK_STATUS_CHANGED,
            message: `O status da tarefa "${data.title}" mudou de ${data.oldStatus} para ${data.newStatus}`,
            taskId: data.taskId,
            metadata: {
              changedBy: data.changedBy,
              oldStatus: data.oldStatus,
              newStatus: data.newStatus,
            },
          });
        }
      }

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Error handling task.status.changed event: ${error.message}`,
      );
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, true);
    }
  }
}
