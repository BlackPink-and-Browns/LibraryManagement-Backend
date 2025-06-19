import { IsString } from "class-validator";

export class ErrorItemDto {
  @IsString()
  error: string;
  
  @IsString()
  raw: string;
}

export class ErrorResponseDto {
  errors: ErrorItemDto[];
}
