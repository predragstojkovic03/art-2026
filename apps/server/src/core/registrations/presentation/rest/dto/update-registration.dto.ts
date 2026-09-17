import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateRegistrationDto {
  @IsOptional()
  @IsBoolean()
  paintingDay?: boolean;

  @IsOptional()
  @IsBoolean()
  photographyDay?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  groupSize?: number;
}
