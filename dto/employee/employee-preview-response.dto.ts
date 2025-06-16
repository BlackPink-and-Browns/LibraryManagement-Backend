import { Expose } from "class-transformer";

export class EmployeePreviewResponseDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
}