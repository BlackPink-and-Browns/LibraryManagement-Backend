import { Repository } from "typeorm";
import { AuditLog } from "../entities/auditlog.entity";
import { error } from "winston";
import httpException from "../exceptions/http.exception";

class AuditLogRepository {
    constructor(private repository: Repository<AuditLog>) {}

    async create(auditlog: AuditLog): Promise<AuditLog> {
        return this.repository.save(auditlog);
    }

    async findAll(user_id?: number, entity_id?: string): Promise<AuditLog[]> {
        return this.repository.find({
            where: {
                ...(user_id && { employee: { id: Number(user_id) } }),
                ...(entity_id && { entityId: entity_id.toString() }),
            },
            select: {
                action: true,
                entityType: true,
                entityId: true,
                employee: {
                    id:true,
                    employeeID: true,
                },
                createdAt: true,
            },
            relations: {
                employee: true,
            },
        });
    }

    async findRecentLogs(take: number) {
        return this.repository.find({
        take,
        order: { createdAt: 'DESC' },
        select: {
            createdAt: true,
            action: true,
            entityType: true,
            entityId: true,
            employee: {
            id: true,
            employeeID: true,
            },
        },
        relations: {
                employee: true,
        },
        });
    }


}

export default AuditLogRepository;
