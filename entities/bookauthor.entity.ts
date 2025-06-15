import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Book } from './book.entity';
import { Author } from './author.entity';
import AbstractEntity from './abstract.entity';

@Entity()
export class BookAuthor extends AbstractEntity{
  @PrimaryColumn()
  bookId: string;

  @PrimaryColumn()
  authorId: string;

  @ManyToOne(() => Book, book => book.bookAuthors)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Author, author => author.bookAuthors)
  @JoinColumn({ name: 'author_id' })
  author: Author;
}
