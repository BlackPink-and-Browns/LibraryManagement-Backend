import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { WaitlistStatus } from "../../entities/enums";


export class WaitlistBookResponseDto {
  @Expose()
  id: number;
  
  @Expose()
  title: string;
}

export class SingleWaitListResponseDto {
  @Expose()
  id: number;
  
  @Expose()
  @ValidateNested()
  @Type(() => WaitlistBookResponseDto)
  book: WaitlistBookResponseDto;

  @Expose()
  status: WaitlistStatus;

  @Expose()
  createdAt: Date;
  
  @Expose()
  updatedAt: Date;
}