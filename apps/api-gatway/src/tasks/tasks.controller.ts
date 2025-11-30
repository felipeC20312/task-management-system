import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CurrentUser} from '../auth/decorators/current-user.decorator';
import {firstValueFrom, timeout} from 'rxjs';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({summary: 'Get all tasks with pagination and filters'})
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'size', required: false, type: Number})
  @ApiQuery({name: 'status', required: false, type: String})
  @ApiQuery({name: 'priority', required: false, type: String})
  @ApiQuery({name: 'search', required: false, type: String})
  @ApiResponse({status: 200, description: 'Tasks retrieved successfully'})
  async findAll(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @CurrentUser() user?: any,
  ) {
    return firstValueFrom(
      this.tasksClient
        .send(
          {cmd: 'get-tasks'},
          {page, size, status, priority, search, userId: user.userId},
        )
        .pipe(timeout(5000)),
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Get task by ID'})
  @ApiParam({name: 'id', type: String})
  @ApiResponse({status: 200, description: 'Task found'})
  @ApiResponse({status: 404, description: 'Task not found'})
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return firstValueFrom(
      this.tasksClient
        .send({cmd: 'get-task'}, {id, userId: user.userId})
        .pipe(timeout(5000)),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'Create a new task'})
  @ApiResponse({status: 201, description: 'Task created successfully'})
  async create(@Body() createTaskDto: any, @CurrentUser() user: any) {
    return firstValueFrom(
      this.tasksClient
        .send({cmd: 'create-task'}, {...createTaskDto, userId: user.userId})
        .pipe(timeout(5000)),
    );
  }

  @Put(':id')
  @ApiOperation({summary: 'Update a task'})
  @ApiParam({name: 'id', type: String})
  @ApiResponse({status: 200, description: 'Task updated successfully'})
  @ApiResponse({status: 404, description: 'Task not found'})
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: any,
    @CurrentUser() user: any,
  ) {
    return firstValueFrom(
      this.tasksClient
        .send({cmd: 'update-task'}, {id, ...updateTaskDto, userId: user.userId})
        .pipe(timeout(5000)),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({summary: 'Delete a task'})
  @ApiParam({name: 'id', type: String})
  @ApiResponse({status: 204, description: 'Task deleted successfully'})
  @ApiResponse({status: 404, description: 'Task not found'})
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return firstValueFrom(
      this.tasksClient
        .send({cmd: 'delete-task'}, {id, userId: user.userId})
        .pipe(timeout(5000)),
    );
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'Add a comment to a task'})
  @ApiParam({name: 'id', type: String})
  @ApiResponse({status: 201, description: 'Comment added successfully'})
  async addComment(
    @Param('id') taskId: string,
    @Body() createCommentDto: any,
    @CurrentUser() user: any,
  ) {
    return firstValueFrom(
      this.tasksClient
        .send(
          {cmd: 'create-comment'},
          {taskId, ...createCommentDto, userId: user.userId},
        )
        .pipe(timeout(5000)),
    );
  }

  @Get(':id/comments')
  @ApiOperation({summary: 'Get comments for a task'})
  @ApiParam({name: 'id', type: String})
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'size', required: false, type: Number})
  @ApiResponse({status: 200, description: 'Comments retrieved successfully'})
  async getComments(
    @Param('id') taskId: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @CurrentUser() user?: any,
  ) {
    return firstValueFrom(
      this.tasksClient
        .send({cmd: 'get-comments'}, {taskId, page, size, userId: user.userId})
        .pipe(timeout(5000)),
    );
  }
}
