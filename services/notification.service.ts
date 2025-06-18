import { LoggerService } from "./logger.service";
import NotificationRepository from "../repositories/notification.repository";
import { Notification } from "../entities/notification.entity";
import { AuditLogType, EntityType, NotificationType } from "../entities/enums";
import { CreateNotificationDTO } from "../dto/notification/create-notification.dto";
import { EntityManager } from "typeorm";
import { error } from "winston";
import { auditLogService } from "../routes/audit.route";

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

  async createNotification(createNotificationDTO: CreateNotificationDTO, manager: EntityManager){
    try {
        const newNotification = new Notification()
        newNotification.type = createNotificationDTO.type;
        newNotification.employeeId = createNotificationDTO.employeeId;
        newNotification.message = createNotificationDTO.message;
        const notificationManagerRepository = manager.getRepository(Notification)
        const createdNotification = await notificationManagerRepository.save(newNotification)
        
        const createdAudit = await auditLogService.createAuditLog(
            AuditLogType.CREATE,
            createNotificationDTO.employeeId,
            (await createdNotification).id.toString(),
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
