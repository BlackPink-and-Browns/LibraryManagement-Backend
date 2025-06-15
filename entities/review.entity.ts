import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { Book } from './book.entity';
import Employee from './employee.entity';

@Entity()
export class Review extends AbstractEntity {
  @ManyToOne(() => Book, book => book.reviews)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Employee, employee => employee.reviews)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column('text')
  content: string;

  @Column('int')
  rating: number;
}
