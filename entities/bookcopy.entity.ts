import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { Book } from './book.entity';
import { Shelf } from './shelf.entity';
import { BorrowRecord } from './borrowrecord.entity';

@Entity()
export class BookCopy extends AbstractEntity {
  @ManyToOne(() => Book, book => book.copies,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Shelf, shelf => shelf.bookCopies)
  @JoinColumn({ name: 'shelf_id' })
  shelf: Shelf;

  @Column({ default: true })
  is_available: boolean;

  @OneToMany(() => BorrowRecord, record => record.bookCopy)
  borrowRecords: BorrowRecord[];

  @Column({default: false})
  is_deleted: boolean
}
