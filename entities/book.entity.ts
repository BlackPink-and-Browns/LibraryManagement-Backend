import { Entity, Column, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import { BookAuthor } from "./bookauthor.entity";
import { BookGenre } from "./bookgenre.entity";
import { BookCopy } from "./bookcopy.entity";
import { Review } from "./review.entity";

@Entity()
export class Book extends AbstractEntity {
  @Column({ unique: true })
  isbn: string;

  @Column()
  title: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({ nullable: true })
  cover_image: string;

  @OneToMany(() => BookAuthor, (ba) => ba.book)
  bookAuthors: BookAuthor[];

  @OneToMany(() => BookGenre, (bg) => bg.book)
  bookGenres: BookGenre[];

  @OneToMany(() => BookCopy, (copy) => copy.book)
  copies: BookCopy[];

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];
}
