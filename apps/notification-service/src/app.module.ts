import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {NotificationsModule} from './notifications/notifications.module';
import {EventsModule} from './events/events.module';
import databaseConfig from './config/database.config';
import rabbitmqConfig from './config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, rabbitmqConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        if (!dbConfig) throw new Error('Database config not found');
        return dbConfig;
      },
      inject: [ConfigService],
    }),
    NotificationsModule,
    EventsModule,
  ],
})
export class AppModule {}
