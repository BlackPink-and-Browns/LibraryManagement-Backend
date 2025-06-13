import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Timestamp
} from "typeorm";
import AbstractEntity from "./abstract.entity";
import Address from "./address.entity";
import Department from "./department.entity";

export enum EmployeeRole {
    UI = 'UI',
    UX = 'UX',
    DEVELOPER = 'DEVELOPER',
    HR = 'HR'
}

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PROBATION = "PROBATION"
}

@Entity()
class Employee extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    employeeID : string

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

	@Column()
	age:number

    @Column()
    experience: number

    @Column({type:'enum' , enum: EmployeeStatus , default:EmployeeStatus.INACTIVE})
    status : EmployeeStatus

    @Column({type:"date"})
    joiningDate: Date

	@OneToOne(() => Address , (address) => address.employee , {
		cascade:true
	})
	address : Address

    @ManyToOne(()=> Department , (address) => address.employees)
    department : Department

    @Column()
    password:string

    @Column({type:'enum',
        enum:EmployeeRole,
        default: EmployeeRole.DEVELOPER
    })
    role:EmployeeRole
}

export default Employee;
