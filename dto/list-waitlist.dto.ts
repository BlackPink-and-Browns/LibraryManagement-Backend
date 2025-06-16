import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { WaitlistStatus } from "../entities/enums";


export class WaitlistBookResponseDto {
  id: number;
  title: string;
}

export class SingleWaitListResponseDto {
  id: number;
  
  @ValidateNested()
  @Type(() => WaitlistBookResponseDto)
  book: WaitlistBookResponseDto;

  status: WaitlistStatus;
  createdAt: Date;
  updatedAt: Date;
}