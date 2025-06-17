import { LoggerService } from "./logger.service";
import NotificationRepository from "../repositories/notification.repository";
import { Notification } from "../entities/notification.entity";

class NotificationService {
  private logger = LoggerService.getInstance(NotificationService.name);

  constructor(
    private notificationRepository: NotificationRepository,
) {}

    async getAllNoticationByEmployeeId(user_id: number, read?: boolean | ""): Promise<Notification[]> {
            this.logger.info(`${read}  ${user_id}`)
            const waitlists = await this.notificationRepository.findAllByEmployeeId(user_id, read)
            this.logger.info("Notification array returned");
            return waitlists;
        }
}


export default NotificationService;