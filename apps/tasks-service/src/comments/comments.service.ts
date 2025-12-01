import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Comment} from './entities/comment.entity';
import {Task} from '../tasks/entities/task.entity';
import {CreateCommentDto} from './dto/create-comment.dto';
import {FilterCommentDto} from './dto/filter-comment.dto';
import {TaskEventsPublisher} from '../events/publishers/task-events.publisher';
import {TaskHistory} from '../tasks/entities/task-history.entity';
import {HistoryAction} from '../tasks/enums/history-action.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
    private taskEventsPublisher: TaskEventsPublisher,
  ) {}

  async create(
    taskId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    // Verify task exists
    const task = await this.taskRepository.findOne({
      where: {id: taskId},
      relations: ['assignees'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Create comment
    const comment = this.commentRepository.create({
      ...createCommentDto,
      taskId,
      userId,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Create history entry
    const history = this.historyRepository.create({
      taskId,
      userId,
      action: HistoryAction.COMMENTED,
      changes: {commentId: savedComment.id},
    });

    await this.historyRepository.save(history);

    // Publish event
    await this.taskEventsPublisher.publishCommentCreated({
      taskId,
      commentId: savedComment.id,
      userId,
      content: createCommentDto.content,
      assigneeIds: task.assignees.map((a) => a.userId),
    });

    return savedComment;
  }

  async findAll(taskId: string, filterDto: FilterCommentDto) {
    const {page = 1, size = 10} = filterDto;

    // Verify task exists
    const taskExists = await this.taskRepository.findOne({
      where: {id: taskId},
    });

    if (!taskExists) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const skip = (page - 1) * size;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: {taskId},
      order: {createdAt: 'DESC'},
      skip,
      take: size,
    });

    return {
      data: comments,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
