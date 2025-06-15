import { Entity, Column, OneToMany } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { BookGenre } from './bookgenre.entity';

@Entity()
export class Genre extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => BookGenre, bg => bg.genre)
  bookGenres: BookGenre[];
}
