import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { Book } from './book.entity';
import  Employee  from './employee.entity';
import { WaitlistStatus } from '../types/enums';

@Entity()
export class Waitlist extends AbstractEntity {
  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Employee, employee => employee.waitlistEntries)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ default: false })
  notified: boolean;

  @Column({
    type: 'enum',
    enum: WaitlistStatus,
    default: WaitlistStatus.REQUESTED
  })
  status: WaitlistStatus;
}
