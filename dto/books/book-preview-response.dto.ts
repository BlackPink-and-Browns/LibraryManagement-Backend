import { Expose } from "class-transformer";

export class BookPreviewResponseDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
}