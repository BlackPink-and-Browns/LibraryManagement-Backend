import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteWaitlistRequestsDto {
  @IsArray()
  // @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  waitlistIds: number[];
}         