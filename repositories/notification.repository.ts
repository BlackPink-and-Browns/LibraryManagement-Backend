import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";

class NotificationRepository {
  constructor(private repository: Repository<Notification>) {}

  async create(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }
}

export default NotificationRepository;
