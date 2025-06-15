import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Book } from './book.entity';
import { Genre } from './genre.entity';
import AbstractEntity from './abstract.entity';

@Entity()
export class BookGenre extends AbstractEntity{
  @PrimaryColumn()
  bookId: string;

  @PrimaryColumn()
  genreId: string;

  @ManyToOne(() => Book, book => book.bookGenres)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Genre, genre => genre.bookGenres)
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;
}
