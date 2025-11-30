import {IsUUID, IsArray} from 'class-validator';

export class MarkReadDto {
  @IsArray()
  @IsUUID('4', {each: true})
  notificationIds: string[];
}
