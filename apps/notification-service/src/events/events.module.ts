import {Module} from '@nestjs/common';
import {TaskEventsConsumer} from './consumers/task-events.consumer';
import {CommentEventsConsumer} from './consumers/comment-events.consumer';
import {NotificationsModule} from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TaskEventsConsumer, CommentEventsConsumer],
})
export class EventsModule {}
