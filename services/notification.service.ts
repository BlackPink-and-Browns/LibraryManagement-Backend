import { LoggerService } from "./logger.service";
import NotificationRepository from "../repositories/notification.repository";
import { Notification } from "../entities/notification.entity";
import { NotificationType } from "../entities/enums";

class NotificationService {
    private logger = LoggerService.getInstance(NotificationService.name);

    constructor(private notificationRepository: NotificationRepository) {}

    async getAllNoticationByEmployeeId(
        user_id: number,
        read?: boolean | ""
    ): Promise<Notification[]> {
        const waitlists = await this.notificationRepository.findAllByEmployeeId(
            user_id,
            read
        );
        this.logger.info("notification array returned");
        return waitlists;
    }

    async updateNotification(
        user_id: number,
        notificationId: number
    ): Promise<void> {
        await this.notificationRepository.updateSelectedItem(
            user_id,
            notificationId
        );
        this.logger.info(`set notification to read`);
    }

    async createMultpleRequestNotifications(
        user_ids: number[],
        message: string,
    ): Promise<void> {
        const notifications: Notification[] = []
        user_ids.forEach(id => {
            const notification = new Notification()
            notification.employeeId = id
            notification.message = message,
            notification.read = false,
            notification.type = NotificationType.BOOK_REQUEST
            notifications.push(notification)
        });
            

        await this.notificationRepository.createMany(notifications);
    }
}

export default NotificationService;
