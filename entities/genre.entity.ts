import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import { Book } from "./book.entity";

@Entity()
export class Genre extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @ManyToMany(() => Book, (book) => book.genres)
  books: Book[];
}
