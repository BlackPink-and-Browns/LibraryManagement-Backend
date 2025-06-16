import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import Employee from './employee.entity';

@Entity()
export class Notification extends AbstractEntity {
  @ManyToOne(() => Employee, employee => employee.notifications)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column('text')
  message: string;

  @Column()
  type: string;

  @Column({ default: false })
  read: boolean;
}
