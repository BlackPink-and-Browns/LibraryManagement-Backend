import { LoggerService } from "./logger.service";
import NotificationRepository from "../repositories/notification.repository";
import { Notification } from "../entities/notification.entity";

class NotificationService {
  private logger = LoggerService.getInstance(NotificationService.name);

  constructor(
    private notificationRepository: NotificationRepository,
) {}

    async getAllNoticationByEmployeeId(user_id: number, read?: boolean | ""): Promise<Notification[]> {
        const waitlists = await this.notificationRepository.findAllByEmployeeId(user_id, read)
        this.logger.info("notification array returned");
        return waitlists;
    }

    async updateNotification(user_id: number, notificationId: number): Promise<void> {
        await this.notificationRepository.updateSelectedItem(user_id, notificationId)
        this.logger.info(`set notification to read`)
    }
}


export default NotificationService;