import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {FilterTaskDto} from './dto/filter-task.dto';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern({cmd: 'create-task'})
  async create(
    @Payload() data: {createTaskDto: CreateTaskDto; userId: string},
  ) {
    return this.tasksService.create(data.createTaskDto, data.userId);
  }

  @MessagePattern({cmd: 'find-all-tasks'})
  async findAll(@Payload() filterDto: FilterTaskDto) {
    return this.tasksService.findAll(filterDto);
  }

  @MessagePattern({cmd: 'find-one-task'})
  async findOne(@Payload() id: string) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern({cmd: 'update-task'})
  async update(
    @Payload()
    data: {
      id: string;
      updateTaskDto: UpdateTaskDto;
      userId: string;
    },
  ) {
    return this.tasksService.update(data.id, data.updateTaskDto, data.userId);
  }

  @MessagePattern({cmd: 'remove-task'})
  async remove(@Payload() data: {id: string; userId: string}) {
    return this.tasksService.remove(data.id, data.userId);
  }
}
