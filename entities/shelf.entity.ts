import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import { Office } from './office.entity';
import { BookCopy } from './bookcopy.entity';

@Entity()
export class Shelf extends AbstractEntity {
  @Column({ unique: true })
  label: string;

  @ManyToOne(() => Office, office => office.shelves)
  @JoinColumn({ name: 'office_id' })
  office: Office;

  @OneToMany(() => BookCopy, copy => copy.shelf)
  bookCopies: BookCopy[];
}