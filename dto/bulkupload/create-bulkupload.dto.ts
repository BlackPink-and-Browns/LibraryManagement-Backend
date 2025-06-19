import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

export class ErrorItemDto {
  @IsString()
  error: string;

  @IsString()
  raw: string;
}

export class ErrorResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorItemDto)
  errors: ErrorItemDto[];
}
