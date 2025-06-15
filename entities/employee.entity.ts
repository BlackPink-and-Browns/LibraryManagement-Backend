import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import AbstractEntity from './abstract.entity';
import Address from './address.entity';
import Department from './department.entity';
import { BorrowRecord } from './borrowrecord.entity';
import { Waitlist } from './waitlist.entity';
import { Notification } from './notification.entity';
import { Review } from './review.entity';
import { AuditLog } from './auditlog.entity';
import { EmployeeRole,EmployeeStatus } from '../types/enums';

@Entity()
class Employee extends AbstractEntity {
  @Column({ unique: true })
  employeeID: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  experience: number;

  @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.INACTIVE })
  status: EmployeeStatus;

  @Column({ type: 'date' })
  joiningDate: Date;

  @OneToOne(() => Address, address => address.employee, { cascade: true })
  address: Address;

  @ManyToOne(() => Department, department => department.employees)
  department: Department;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.DEVELOPER
  })
  role: EmployeeRole;

  @OneToMany(() => BorrowRecord, record => record.borrowedBy)
  borrowRecords: BorrowRecord[];

  @OneToMany(() => Waitlist, waitlist => waitlist.employee)
  waitlistEntries: Waitlist[];

  @OneToMany(() => Notification, notification => notification.employee)
  notifications: Notification[];

  @OneToMany(() => Review, review => review.employee)
  reviews: Review[];

  @OneToMany(() => AuditLog, log => log.employee)
  auditLogs: AuditLog[];
}

export default Employee;
