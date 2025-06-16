import { Repository } from "typeorm";
import { AuditLog } from "../entities/auditlog.entity";

class AuditLogRepository {
    constructor(private repository: Repository<AuditLog>) {}

    async create(auditlog: AuditLog): Promise<AuditLog> {
        return this.repository.save(auditlog);
    }

    async findAll(): Promise<AuditLog[]> {
        return this.repository.find({
            select: {
                id: true,
                action: true,
                entityType: true,
                entityId: true,
                employee: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            relations: {
                employee: true,
            },
        });
    }
}
