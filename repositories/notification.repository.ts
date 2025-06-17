import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";

class NotificationRepository {
  constructor(private repository: Repository<Notification>) {}

  async create(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }

  async findAllByEmployeeId(employee_id: number, read: boolean | "") {
      const whereClause: { employeeId: number; read?: boolean } = {
        employeeId: employee_id,
      };

      if (typeof read === 'boolean') {
        whereClause.read = read;
      }
      return this.repository.find({
        where: whereClause,
        order:{
          updatedAt: "DESC",
        },
        // select: {
        //   id: true,
        //   employeeId: true,
        //   status: true,
        //   book: {
        //     id: true,
        //     title: true
        //   }
        // },
        // relations: { 
        //   book: true 
        // },
      });
    }
}

export default NotificationRepository;
