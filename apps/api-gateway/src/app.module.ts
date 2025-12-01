import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD, APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {TasksModule} from './tasks/tasks.module';
import {NotificationsModule} from './notifications/notifications.module';
import {JwtAuthGuard} from './auth/guards/jwt-auth.guard';
import {RpcExceptionFilter} from './common/filters/rpc-exception.filter';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import rabbitmqConfig from './config/rabbitmq.config';
import {LoggingInterceptor} from './common/interceptors/loggin.interceptors';
import {HttpExceptionFilter} from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, rabbitmqConfig],
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
