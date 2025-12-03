import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {ThrottlerModule} from '@nestjs/throttler';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {TasksModule} from './tasks/tasks.module';
import {NotificationsModule} from './notifications/notifications.module';
import appConfig from './config/app.config';

import {jwtConfig, rabbitMqConfig} from '@monorepo/common-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, rabbitMqConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(String(process.env.THROTTLE_TTL), 10) || 1,
        limit: parseInt(String(process.env.THROTTLE_LIMIT), 10) || 10,
      },
    ]),
    AuthModule,
    TasksModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
