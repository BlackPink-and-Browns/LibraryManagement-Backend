import { Entity, Column, OneToMany } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { BookAuthor } from './bookauthor.entity';

@Entity()
export class Author extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => BookAuthor, ba => ba.author)
  bookAuthors: BookAuthor[];
}
