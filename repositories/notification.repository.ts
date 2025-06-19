import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";

class NotificationRepository {
  constructor(private repository: Repository<Notification>) {}

  async create(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }

  async createMany(notifications: Notification[]) : Promise<Notification[]> {
    return this.repository.save(notifications)
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
        select: {
          id: true,
          employeeId: true,
          message: true,
          type: true,
          read: true,
          createdAt: true,
          updatedAt: true
          }
      });
    }

    async updateSelectedItem(employee_id: number,notificationId: number) : Promise<void> {
      await this.repository.update(
        {
          id: notificationId,
          employeeId: employee_id,
        },
        {
          read: true
        }
      )
    }

}

export default NotificationRepository;
