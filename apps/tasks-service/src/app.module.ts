import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TasksModule} from './tasks/tasks.module';
import {CommentsModule} from './comments/comments.module';

import {databaseConfig, rabbitMqConfig} from '@monorepo/common-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, rabbitMqConfig],
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
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}
