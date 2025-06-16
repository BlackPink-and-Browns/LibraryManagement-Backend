import { Expose } from 'class-transformer';

export class ReviewResponseDto {

  @Expose()
  rating: number;

  @Expose()
  comment: string;

  @Expose()
  bookId: string;

  @Expose()
  userId: string;
}
