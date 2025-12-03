import {Controller, Get, Query, Param, Put, Inject} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import {CurrentUser} from '../auth/decorators/current-user.decorator';
import {firstValueFrom, timeout} from 'rxjs';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('api/notifications')
export class NotificationsController {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({summary: 'Get user notifications'})
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'size', required: false, type: Number})
  @ApiQuery({name: 'read', required: false, type: Boolean})
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async getNotifications(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('read') read?: boolean,
  ) {
    return firstValueFrom(
      this.notificationsClient
        .send(
          {cmd: 'get-notifications'},
          {userId: user.userId, page, size, read},
        )
        .pipe(timeout(5000)),
    );
  }

  @Put(':id/read')
  @ApiOperation({summary: 'Mark notification as read'})
  @ApiParam({name: 'id', type: String})
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
  })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return firstValueFrom(
      this.notificationsClient
        .send({cmd: 'mark-notification-read'}, {id, userId: user.userId})
        .pipe(timeout(5000)),
    );
  }
}
