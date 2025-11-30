import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Notification} from './entities/notification.entity';
import {CreateNotificationDto} from './dto/create-notification.dto';
import {FilterNotificationDto} from './dto/filter-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    this.logger.log(
      `Creating notification for user ${createNotificationDto.userId}`,
    );

    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return this.notificationRepository.save(notification);
  }

  async findByUser(
    userId: string,
    filterDto: FilterNotificationDto,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    size: number;
  }> {
    const {read, page = 1, size = 20} = filterDto;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', {userId});

    if (read !== undefined) {
      queryBuilder.andWhere('notification.read = :read', {read});
    }

    queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      size,
    };
  }

  async markAsRead(userId: string, notificationIds: string[]): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({read: true})
      .where('userId = :userId', {userId})
      .andWhere('id IN (:...notificationIds)', {notificationIds})
      .execute();

    this.logger.log(
      `Marked ${notificationIds.length} notifications as read for user ${userId}`,
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({read: true})
      .where('userId = :userId', {userId})
      .andWhere('read = :read', {read: false})
      .execute();

    this.logger.log(`Marked all notifications as read for user ${userId}`);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    await this.notificationRepository.delete({
      id: notificationId,
      userId,
    });

    this.logger.log(
      `Deleted notification ${notificationId} for user ${userId}`,
    );
  }
}
