import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {NotificationsService} from './notifications.service';
import {FilterNotificationDto} from './dto/filter-notification.dto';
import {MarkReadDto} from './dto/mark-read.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern({cmd: 'get-notifications'})
  async getNotifications(
    @Payload() data: {userId: string; filterDto: FilterNotificationDto},
  ) {
    return this.notificationsService.findByUser(data.userId, data.filterDto);
  }

  @MessagePattern({cmd: 'get-unread-count'})
  async getUnreadCount(@Payload() data: {userId: string}) {
    return this.notificationsService.getUnreadCount(data.userId);
  }

  @MessagePattern({cmd: 'mark-notifications-read'})
  async markAsRead(
    @Payload() data: {userId: string; markReadDto: MarkReadDto},
  ) {
    await this.notificationsService.markAsRead(
      data.userId,
      data.markReadDto.notificationIds,
    );
    return {success: true};
  }

  @MessagePattern({cmd: 'mark-all-notifications-read'})
  async markAllAsRead(@Payload() data: {userId: string}) {
    await this.notificationsService.markAllAsRead(data.userId);
    return {success: true};
  }

  @MessagePattern({cmd: 'delete-notification'})
  async deleteNotification(
    @Payload() data: {userId: string; notificationId: string},
  ) {
    await this.notificationsService.deleteNotification(
      data.userId,
      data.notificationId,
    );
    return {success: true};
  }
}
