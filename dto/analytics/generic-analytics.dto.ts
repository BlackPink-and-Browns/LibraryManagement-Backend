import { Expose } from 'class-transformer';

export class GenericAnalyticsResponseDto {
  @Expose()
  total_books: number;

  @Expose()
  active_users: number;

  @Expose()
  shelves: number;

  @Expose()
  books_issued: number;
}