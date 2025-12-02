import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsArray,
  IsOptional,
} from "class-validator";
import { TaskPriority } from "../enums/task-priority.enum";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  deadline!: string;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsArray()
  @IsOptional()
  assigneeIds?: string[];
}
