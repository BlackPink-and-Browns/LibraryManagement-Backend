import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import Employee from './employee.entity';
import { NotificationType } from './enums';

@Entity()
export class Notification extends AbstractEntity {
  @ManyToOne(() => Employee, employee => employee.notifications)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column('text')
  message: string;

  @Column({
      type: 'enum',
      enum: NotificationType,
    })
    type: NotificationType;

  @Column({ default: false })
  read: boolean;
}
