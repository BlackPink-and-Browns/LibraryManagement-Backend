import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import { Book } from "./book.entity";

@Entity()
export class Author extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}
