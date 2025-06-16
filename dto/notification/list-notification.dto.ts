import { Expose } from 'class-transformer';

export class SingleNotificationResponseDto {
  @Expose()
  id: number;

  @Expose()
  message: string;
  
  @Expose()
  type: string;
  
  @Expose()
  read: boolean;
  
  @Expose()
  createdAt: Date;
  
  @Expose()
  updatedAt: Date;
}