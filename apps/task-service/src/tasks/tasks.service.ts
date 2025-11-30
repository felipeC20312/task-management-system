import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Task} from './entities/task.entity';
import {TaskAssignee} from './entities/task-assignee.entity';
import {TaskHistory} from './entities/task-history.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {FilterTaskDto} from './dto/filter-task.dto';
import {HistoryAction} from './enums/history-action.enum';
import {TaskEventsPublisher} from '../events/publishers/task-events.publisher';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskAssignee)
    private assigneeRepository: Repository<TaskAssignee>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
    private taskEventsPublisher: TaskEventsPublisher,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const {assigneeIds, ...taskData} = createTaskDto;

    // Create task
    const task = this.taskRepository.create({
      ...taskData,
      createdBy: userId,
    });

    const savedTask = await this.taskRepository.save(task);

    // Assign users if provided
    if (assigneeIds && assigneeIds.length > 0) {
      await this.assignUsers(savedTask.id, assigneeIds);
    }

    // Create history entry
    await this.createHistoryEntry(savedTask.id, userId, HistoryAction.CREATED, {
      task: taskData,
    });

    // Publish event
    await this.taskEventsPublisher.publishTaskCreated({
      taskId: savedTask.id,
      title: savedTask.title,
      createdBy: userId,
      assigneeIds: assigneeIds || [],
    });

    return this.findOne(savedTask.id);
  }

  async findAll(filterDto: FilterTaskDto) {
    const {status, priority, search, page = 1, size = 10} = filterDto;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .orderBy('task.createdAt', 'DESC');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('task.status = :status', {status});
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', {priority});
    }

    if (search) {
      queryBuilder.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        {search: `%${search}%`},
      );
    }

    // Pagination
    const skip = (page - 1) * size;
    queryBuilder.skip(skip).take(size);

    const [tasks, total] = await queryBuilder.getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: {id},
      relations: ['assignees', 'history'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id);

    const {assigneeIds, ...updateData} = updateTaskDto;

    // Track changes for history
    const changes: Record<string, any> = {};
    let statusChanged = false;

    Object.keys(updateData).forEach((key) => {
      if (task[key] !== updateData[key]) {
        changes[key] = {
          from: task[key],
          to: updateData[key],
        };

        if (key === 'status') {
          statusChanged = true;
        }
      }
    });

    // Update task
    Object.assign(task, updateData);
    const updatedTask = await this.taskRepository.save(task);

    // Update assignees if provided
    if (assigneeIds !== undefined) {
      await this.updateAssignees(id, assigneeIds, userId);
    }

    // Create history entry
    if (Object.keys(changes).length > 0) {
      const action = statusChanged
        ? HistoryAction.STATUS_CHANGED
        : HistoryAction.UPDATED;

      await this.createHistoryEntry(id, userId, action, changes);
    }

    // Get current assignee IDs
    const currentAssignees = await this.assigneeRepository.find({
      where: {taskId: id},
    });

    // Publish event
    await this.taskEventsPublisher.publishTaskUpdated({
      taskId: id,
      title: updatedTask.title,
      updatedBy: userId,
      changes,
      assigneeIds: currentAssignees.map((a) => a.userId),
    });

    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id);

    if (task.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.taskRepository.remove(task);

    return {message: 'Task deleted successfully'};
  }

  private async assignUsers(taskId: string, userIds: string[]) {
    const assignees = userIds.map((userId) =>
      this.assigneeRepository.create({taskId, userId}),
    );

    await this.assigneeRepository.save(assignees);
  }

  private async updateAssignees(
    taskId: string,
    newAssigneeIds: string[],
    userId: string,
  ) {
    // Get current assignees
    const currentAssignees = await this.assigneeRepository.find({
      where: {taskId},
    });

    const currentIds = currentAssignees.map((a) => a.userId);

    // Find removed assignees
    const removedIds = currentIds.filter((id) => !newAssigneeIds.includes(id));

    // Find new assignees
    const addedIds = newAssigneeIds.filter((id) => !currentIds.includes(id));

    // Remove old assignees
    if (removedIds.length > 0) {
      await this.assigneeRepository.delete({
        taskId,
        userId: In(removedIds),
      });

      await this.createHistoryEntry(taskId, userId, HistoryAction.UNASSIGNED, {
        userIds: removedIds,
      });
    }

    // Add new assignees
    if (addedIds.length > 0) {
      await this.assignUsers(taskId, addedIds);

      await this.createHistoryEntry(taskId, userId, HistoryAction.ASSIGNED, {
        userIds: addedIds,
      });
    }
  }

  private async createHistoryEntry(
    taskId: string,
    userId: string,
    action: HistoryAction,
    changes: Record<string, any>,
  ) {
    const history = this.historyRepository.create({
      taskId,
      userId,
      action,
      changes,
    });

    await this.historyRepository.save(history);
  }
}
