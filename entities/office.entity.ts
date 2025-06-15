import { Entity, Column, OneToMany } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { Shelf } from './shelf.entity';

@Entity()
export class Office extends AbstractEntity {
  @Column()
  name: string;

  @Column('text')
  address: string;

  @OneToMany(() => Shelf, shelf => shelf.office)
  shelves: Shelf[];
}
