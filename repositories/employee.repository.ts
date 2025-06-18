import { Repository } from "typeorm";
import Employee from "../entities/employee.entity";
import { EmployeeLibraryResponseDto } from "../dto/employee/employee-library-response.dto";
import { borrowService } from "../routes/borrow.route";
import { BorrowStatus } from "../entities/enums";

class EmployeeRepository {
    constructor(private repository: Repository<Employee>) {}

    async create(employee: Employee): Promise<Employee> {
        return this.repository.save(employee);
    }

    async findAll(): Promise<Employee[]> {
        return this.repository.find({
            relations: {
                address: true,
                department: true,
            },
        });
    }

    async findOneByEmail(email: string): Promise<Employee | null> {
        return this.repository.findOneBy({ email });
    }

    async findOneByID(id: number): Promise<Employee> {
        return this.repository.findOne({
            where: { id },
            relations: { address: true, department: true },
        });
    }

    async update(id: number, employee: Employee): Promise<void> {
        await this.repository.save({ id, ...employee }); // ... spread
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async remove(employee: Employee): Promise<void> {
        await this.repository.remove(employee);
    }

    async findBasicEmployeeDetails(id: number): Promise<Employee> {
        return this.repository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                department: {
                    name: true,
                },
                
            },
            relations: { address: true, department: true },
        });
    }

    async findEmployeeLibraryDetails(id: number): Promise<EmployeeLibraryResponseDto> {
        const response = new EmployeeLibraryResponseDto()
        const e = await this.findOneByID(id)
        let unread_notifications = 0
        let current_borrowed = 0
        let current_overdue = 0
        let total_borrowed = e.borrowRecords.length
        e.borrowRecords.forEach((borrowRecord)=> {
            if(borrowRecord.status == BorrowStatus.BORROWED){
                current_borrowed +=1
            }
            if(borrowRecord.status == BorrowStatus.OVERDUE) {
                current_overdue +=1
            }
        })

        e.notifications.forEach((notification)=> {
            if(notification.read == false){
                unread_notifications+=1
            }
        })

        response.id = e.id
        response.email = e.email
        response.name = e.name
        response.current_borrowed = current_borrowed
        response.current_overdue = current_overdue
        response.total_borrowed = total_borrowed
        response.unread_notifications = unread_notifications
        return response
    }


}

export default EmployeeRepository;
