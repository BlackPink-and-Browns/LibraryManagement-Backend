// AuditLog.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './abstract.entity';
import Employee from './employee.entity'; // assuming User.ts is actually Employee.ts

@Entity()
export class AuditLog extends AbstractEntity {
  @ManyToOne(() => Employee, employee => employee.auditLogs, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column('text')
  action: string;

  @Column()
  entityType: string;

  @Column('uuid', { nullable: true })
  entityId: string;
}
