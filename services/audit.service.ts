import { EntityManager } from "typeorm";
import { AuditLog } from "../entities/auditlog.entity";
import Employee from "../entities/employee.entity";
import AuditLogRepository from "../repositories/audit.repository";
import { LoggerService } from "./logger.service";
import httpException from "../exceptions/http.exception";

class AuditLogService {
    private logger = LoggerService.getInstance(AuditLogService.name);

    constructor(private auditlogrepository: AuditLogRepository) {}

    async getAllAuditLogs(
        user_id?: number,
        entity_id?: string
    ): Promise<AuditLog[]> {
        this.logger.info("all audits returned");
        return this.auditlogrepository.findAll(
            (user_id = user_id),
            (entity_id = entity_id)
        );
    }

    async createAuditLog(
        action: string,
        employee_id: number,
        entity_id: string,
        entity_type: string,
        manager?: EntityManager
    ){
        try {
            const auditlog = new AuditLog();
            auditlog.action = action;
            auditlog.employeeId = employee_id;
            auditlog.entityId = entity_id;
            auditlog.entityType = entity_type;
            
            if (manager) {
                const auditLogRepository = manager.getRepository(AuditLog);
                // throw new httpException(500, "Audit log service error");
                await auditLogRepository.save(auditlog);
            } else {
                await this.auditlogrepository.create(auditlog);
            }
            return {error: ""}
        } catch (error) {
            return ({error:error})   
        }
    }
}

export default AuditLogService;
