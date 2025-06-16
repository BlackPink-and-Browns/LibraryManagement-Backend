import { AuditLog } from "../entities/auditlog.entity";
import Employee from "../entities/employee.entity";
import AuditLogRepository from "../repositories/audit.repository";
import { LoggerService } from "./logger.service";

class AuditLogService {
    private logger = LoggerService.getInstance(AuditLogService.name);

    constructor(private auditlogrepository: AuditLogRepository) {}

    async getAllAuditLogs(
        user_id?: number,
        entity_id?: string
    ): Promise<AuditLog[]> {
        this.logger.info("all audits returned");
        return this.auditlogrepository.findAll(user_id = user_id,entity_id = entity_id);
    }

    async createAuditLog(
        action: string,
        employee_id: number,
        entity_id: string,
        entity_type: string
    ): Promise<void> {
        const auditlog = new AuditLog();
        auditlog.action = action;
        auditlog.employeeId = employee_id;
        auditlog.entityId = entity_id;
        auditlog.entityType = entity_type;
        await this.auditlogrepository.create(auditlog);
    }
}

export default AuditLogService;
