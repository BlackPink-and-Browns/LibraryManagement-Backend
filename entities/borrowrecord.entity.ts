import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { BookCopy } from './bookcopy.entity';
import  Employee  from './employee.entity';
import { Shelf } from './shelf.entity';
import { BorrowStatus } from './enums';

@Entity()
export class BorrowRecord extends AbstractEntity {
  @ManyToOne(() => BookCopy, copy => copy.borrowRecords)
  @JoinColumn({ name: 'book_copy_id' })
  bookCopy: BookCopy;

  @ManyToOne(() => Employee, employee => employee.borrowRecords)
  @JoinColumn({ name: 'borrowed_by' })
  borrowedBy: Employee;

  @Column({ type: 'timestamp', nullable: true })
  borrowed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  returned_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @ManyToOne(() => Shelf, { nullable: true })
  @JoinColumn({ name: 'return_shelf_id' })
  returnShelf: Shelf;

  @Column({ default: false })
  overdue_alert_sent: boolean;

  @Column({
    type: 'enum',
    enum: BorrowStatus,
    default: BorrowStatus.BORROWED
  })
  status: BorrowStatus;
}
