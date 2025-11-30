import {DocumentBuilder} from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(process.env.SWAGGER_TITLE || 'Task Management API')
  .setDescription(
    process.env.SWAGGER_DESCRIPTION ||
      'API for collaborative task management system',
  )
  .setVersion(process.env.SWAGGER_VERSION || '1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Authentication endpoints')
  .addTag('tasks', 'Task management endpoints')
  .addTag('comments', 'Comment endpoints')
  .addTag('notifications', 'Notification endpoints')
  .build();
