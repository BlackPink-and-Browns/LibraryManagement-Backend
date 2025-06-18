import { Expose } from "class-transformer";

export class DepartmentPreviewResponseDto {
  @Expose()
  id: number;
  
  @Expose()
  name: string;
}