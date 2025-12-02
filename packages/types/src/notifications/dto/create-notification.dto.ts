import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsObject,
} from "class-validator";
import { NotificationType } from "../enums/notification-type.enum";

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  message!: string;

  @IsUUID()
  @IsOptional()
  taskId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
