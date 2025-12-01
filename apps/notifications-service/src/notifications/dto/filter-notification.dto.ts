import {IsOptional, IsBoolean, IsInt, Min} from 'class-validator';
import {Type} from 'class-transformer';

export class FilterNotificationDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  read?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  size?: number = 20;
}
