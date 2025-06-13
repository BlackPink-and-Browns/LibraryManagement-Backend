
import { DataSource } from 'typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import Employee, { EmployeeStatus } from '../../entities/employee.entity';
import EmployeeRepository from '../../repositories/employee.repository';
import Address from '../../entities/address.entity';
import { EmployeeRole } from '../../entities/employee.entity';
import AbstractEntity from '../../entities/abstract.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Department from '../../entities/department.entity';
import { mock, MockProxy } from "jest-mock-extended";
import DepartmentController from '../../controllers/department.controller';

describe('EmployeeRepository', () => {
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let employeeRepository: EmployeeRepository;

//   beforeAll(async () => {
//     container = await new PostgreSqlContainer()
//       .withDatabase('test_db')
//       .withUsername('test_user')
//       .withPassword('test_password')
//       .start();

//     dataSource = new DataSource({
//       type: 'postgres',
//       host: container.getHost(),
//       port: container.getPort(),
//       username: container.getUsername(),
//       password: container.getPassword(),
//       database: container.getDatabase(),
//       entities: [Employee, Address, AbstractEntity],
//       migrations: ['db/migrations/*.ts'],
//       namingStrategy: new SnakeNamingStrategy(),
//     });

//     await dataSource.initialize();

//     // Run migrations
//     await dataSource.runMigrations();

//     const typeormRepository = dataSource.getRepository(Employee);
//     employeeRepository = new EmployeeRepository(typeormRepository);
//   });

    beforeAll(async () => {
  try {
    container = await new PostgreSqlContainer()
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      entities: [Employee, Address, AbstractEntity, Department],
      migrations: ['db/migrations/*.ts'],
      namingStrategy: new SnakeNamingStrategy(),
    });

    await dataSource.initialize();
    await dataSource.runMigrations();

    const typeormRepository = dataSource.getRepository(Employee);
    employeeRepository = new EmployeeRepository(typeormRepository);
  } catch (error) {
    console.error('Error during beforeAll setup:', error);
    console.error(error.stack); // stack trace here
    throw error; // Re-throw so Jest knows the setup failed
  }
}, 30000);
  
  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  describe('find', () => {
    it('should return all employees with their addresses', async () => {
      // Create test data
      const employeeRepo = dataSource.getRepository(Employee);

      const address = new Address();
      address.line1 = "line1"
      address.line2 = "line2"
      address.houseNo = "house"
      address.pincode = 456

      const department = new Department()
      department.name = "hr"
      department.employees = new Array()

      const employee = employeeRepo.create({
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'hashedPassword',
        role: EmployeeRole.DEVELOPER,
        address : address,
        employeeID: "12345",
        experience: 15,
        joiningDate : "2025-05-23",
        status : EmployeeStatus.ACTIVE,
        department: department
      });
      await employeeRepo.save(employee);
      
      //Act
      const result = await employeeRepository.findAll();
      
      //Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'hashedPassword',
        role: EmployeeRole.DEVELOPER,
        address : address,
        employeeID: "12345",
        experience: 15,
        joiningDate : "2025-05-23",
        status : EmployeeStatus.ACTIVE,
        department: null
      });
    });
  });
});  