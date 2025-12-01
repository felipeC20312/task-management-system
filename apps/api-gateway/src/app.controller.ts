import {Controller, Get} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Public} from './auth/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({summary: 'Health check endpoint'})
  @ApiResponse({status: 200, description: 'API is running'})
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'API Gateway',
    };
  }

  @Public()
  @Get('health')
  @ApiOperation({summary: 'Detailed health check'})
  @ApiResponse({status: 200, description: 'Service health status'})
  getDetailedHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
