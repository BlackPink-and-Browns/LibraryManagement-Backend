import { NotificationType } from "../../entities/enums";

export class CreateNotificationDTO {
    employeeId: number;
    message: string;
    type: NotificationType;
}