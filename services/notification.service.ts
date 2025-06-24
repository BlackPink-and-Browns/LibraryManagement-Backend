import { LoggerService } from "./logger.service";
import NotificationRepository from "../repositories/notification.repository";
import { Notification } from "../entities/notification.entity";
import { AuditLogType, EntityType, NotificationType } from "../entities/enums";
import { CreateNotificationDTO } from "../dto/notification/create-notification.dto";
import { EntityManager } from "typeorm";
import { error } from "winston";
import { auditLogService } from "../routes/audit.route";
import { io } from "../app";

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
            
        const savedNotifications = await this.notificationRepository.createMany(notifications);

        savedNotifications.forEach(savedNotification => {
        io.to(`user-${savedNotification.employeeId}`).emit('new-notification', {
          id: savedNotification.id,
          message: savedNotification.message,
          type: savedNotification.type,
          createdAt: savedNotification.createdAt
        });
        this.logger.info(`Notification emitted for user ${savedNotification.employeeId}`);
      });
    }


  async createNotification(createNotificationDTO: CreateNotificationDTO, manager: EntityManager){
    try {
        const newNotification = new Notification()
        newNotification.type = createNotificationDTO.type;
        newNotification.employeeId = createNotificationDTO.employeeId;
        newNotification.message = createNotificationDTO.message;
        const notificationManagerRepository = manager.getRepository(Notification)
        const savedNotification = await notificationManagerRepository.save(newNotification)

        io.to(`user-${createNotificationDTO.employeeId}`).emit('new-notification', {
            id: savedNotification.id,
            message: savedNotification.message,
            type: savedNotification.type,
            createdAt: savedNotification.createdAt
        });
        
        this.logger.info(`Single notification emitted for user ${createNotificationDTO.employeeId}`);
        
        const createdAudit = await auditLogService.createAuditLog(
            AuditLogType.CREATE,
            createNotificationDTO.employeeId,
            (await savedNotification).id.toString(),
            EntityType.WAITLIST,
            manager
        );
        return {error: ""}
    } catch (error) {
        return ({error: error})
    }
  };
}

export default NotificationService;
