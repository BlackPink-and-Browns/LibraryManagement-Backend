import { IsString, IsUUID, IsInt, Min, Max, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
