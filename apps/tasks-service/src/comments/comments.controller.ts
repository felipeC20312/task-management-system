import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {CommentsService} from './comments.service';

import {CreateCommentDto, FilterCommentDto} from '@monorepo/common-types';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern({cmd: 'create-comment'})
  async create(
    @Payload()
    data: {
      taskId: string;
      createCommentDto: CreateCommentDto;
      userId: string;
    },
  ) {
    return this.commentsService.create(
      data.taskId,
      data.createCommentDto,
      data.userId,
    );
  }

  @MessagePattern({cmd: 'find-all-comments'})
  async findAll(
    @Payload() data: {taskId: string; filterDto: FilterCommentDto},
  ) {
    return this.commentsService.findAll(data.taskId, data.filterDto);
  }
}
