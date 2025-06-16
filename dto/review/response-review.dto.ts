import { Expose } from 'class-transformer';

export class ReviewResponseDto {

  @Expose()
  rating: number;

  @Expose()
  content: string;

  @Expose()
  bookId: string;

  @Expose()
  userId: string;
}
