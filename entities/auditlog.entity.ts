// AuditLog.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import Employee from './employee.entity'; // assuming User.ts is actually Employee.ts

@Entity()
export class AuditLog extends AbstractEntity {
  @ManyToOne(() => Employee, employee => employee.auditLogs, { nullable: true })
  employee: Employee;

  @Column()
  employeeId: number

  @Column('text')
  action: string;

  @Column()
  entityType: string;

  @Column()
  entityId: string;
}
