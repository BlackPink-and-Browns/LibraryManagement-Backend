import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import AbstractEntity from "./abstract.entity";
import { Genre } from "./genre.entity";
import { BookCopy } from "./bookcopy.entity";
import { Review } from "./review.entity";
import { Author } from "./author.entity";

@Entity()
export class Book extends AbstractEntity {
  @Column({ unique: true })
  isbn: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({ nullable: true })
  cover_image: string;

  @ManyToMany(() => Author, (author) => author.books, {
    cascade: true,
  })
  @JoinTable({
    name: "book_authors", //  custom junction table name
    joinColumn: {
      name: "book_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "author_id",
      referencedColumnName: "id"
    }
  })
  authors: Author[];

  @ManyToMany(() => Genre, (genre) => genre.books, {
    cascade: true,
  })
  @JoinTable({
    name: "book_genres", //  custom junction table name
    joinColumn: {
      name: "book_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "genre_id",
      referencedColumnName: "id"
    }
  })
  genres: Genre[];

  @OneToMany(() => BookCopy, (copy) => copy.book)
  copies: BookCopy[];

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @Column({ nullable: true })
  is_available: boolean

  @Column({ nullable: true })
  avg_rating: number
}
