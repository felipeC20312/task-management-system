export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface CreateTaskDto {
  title: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  assigneeIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeIds?: string[];
}

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: UserDto;
  assignees: UserDto[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterTaskDto {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  size?: number;
}
