import { Repository } from "typeorm";
import Employee from "../entities/employee.entity";

class EmployeeRepository {
    constructor(private repository: Repository<Employee>) {}

    async create(employee: Employee): Promise<Employee> {
        return this.repository.save(employee);
    }

    async findAll(): Promise<Employee[]> {
        return this.repository.find({
            relations: {
                address:true,
                department:true
            }
        });
    }

    async findOneByEmail(email:string) : Promise<Employee | null> {
        return this.repository.findOneBy({email})
    }

    async findOneByID(id: number): Promise<Employee> {
        return this.repository.findOne({where : {id},relations:{address:true,department:true}});
    }

    async update (id:number , employee : Employee) : Promise<void> {
        await this.repository.save({id, ...employee}) // ... spread
    }

    async delete (id: number) : Promise<void> {
        await this.repository.delete({id})
    }

    async remove(employee : Employee) : Promise<void> {
        await this.repository.remove(employee)
    }

    async 
}

export default EmployeeRepository